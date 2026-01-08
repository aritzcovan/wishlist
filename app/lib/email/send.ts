import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailParams {
  to: string[]
  subject: string
  html: string
  text?: string
}

export interface EmailResponse {
  success: boolean
  error?: string
  sent_count?: number
  failed_count?: number
}

export async function sendEmail(
  params: SendEmailParams
): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Wishlist App <onboarding@resend.dev>', // Update with your verified domain
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    })

    if (error) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        error: error.message || 'Failed to send email',
        sent_count: 0,
        failed_count: params.to.length,
      }
    }

    return {
      success: true,
      sent_count: params.to.length,
      failed_count: 0,
    }
  } catch (error) {
    console.error('Email service error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      sent_count: 0,
      failed_count: params.to.length,
    }
  }
}

// Format wishlist content for email
export interface WishlistEmailData {
  wishlist_name: string
  items: Array<{
    name: string
    description: string | null
    category: string
  }>
}

export function formatWishlistEmail(data: WishlistEmailData): {
  subject: string
  html: string
  text: string
} {
  const { wishlist_name, items } = data

  // Group items by category
  const itemsByCategory = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, typeof items>
  )

  // Generate HTML
  const htmlCategories = Object.entries(itemsByCategory)
    .map(
      ([category, categoryItems]) => `
      <div style="margin-bottom: 24px;">
        <h3 style="color: #374151; margin-bottom: 12px;">${category}</h3>
        <ul style="list-style: none; padding: 0;">
          ${categoryItems
            .map(
              (item) => `
            <li style="margin-bottom: 8px;">
              <strong>${item.name}</strong>
              ${item.description ? `<br/><span style="color: #6b7280;">${item.description}</span>` : ''}
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
    `
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${wishlist_name}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #111827; margin-bottom: 8px;">${wishlist_name}</h1>
        <p style="color: #6b7280; margin-bottom: 32px;">A wishlist has been shared with you!</p>
        ${htmlCategories}
      </body>
    </html>
  `

  // Generate plain text
  const textCategories = Object.entries(itemsByCategory)
    .map(([category, categoryItems]) => {
      const itemsList = categoryItems
        .map(
          (item) =>
            `  - ${item.name}${item.description ? `\n    ${item.description}` : ''}`
        )
        .join('\n')
      return `${category}:\n${itemsList}`
    })
    .join('\n\n')

  const text = `${wishlist_name}\n\nA wishlist has been shared with you!\n\n${textCategories}`

  return {
    subject: `${wishlist_name} - My Wishlist`,
    html,
    text,
  }
}

