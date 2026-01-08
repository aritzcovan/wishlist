import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/client';
import { sendEmail, formatWishlistEmail } from '@/app/lib/email/send';
import { validateEmailList } from '@/app/utils/validation';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { wishlist_id, recipient_emails } = body;

    // Validate inputs
    if (!wishlist_id) {
      return NextResponse.json(
        { success: false, error: 'Wishlist ID is required' },
        { status: 400 }
      );
    }

    if (!recipient_emails || !Array.isArray(recipient_emails)) {
      return NextResponse.json(
        { success: false, error: 'Recipient emails must be an array' },
        { status: 400 }
      );
    }

    if (recipient_emails.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one recipient email is required' },
        { status: 400 }
      );
    }

    if (recipient_emails.length > 10) {
      return NextResponse.json(
        { success: false, error: 'Maximum 10 recipients allowed' },
        { status: 400 }
      );
    }

    // Validate email addresses
    const emailValidation = validateEmailList(recipient_emails);
    if (!emailValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid email addresses: ${emailValidation.invalid.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch wishlist with items
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlists')
      .select(
        `
        id,
        name,
        items (
          id,
          name,
          description,
          category:event_categories (
            name
          )
        )
      `
      )
      .eq('id', wishlist_id)
      .eq('user_id', user.id)
      .single();

    if (wishlistError || !wishlist) {
      return NextResponse.json(
        { success: false, error: 'Wishlist not found' },
        { status: 404 }
      );
    }

    // Format email content
    const emailData = formatWishlistEmail({
      wishlist_name: wishlist.name,
      items: wishlist.items.map((item: any) => ({
        name: item.name,
        description: item.description,
        category: item.category?.name || 'Uncategorized',
      })),
    });

    // Send email
    const emailResult = await sendEmail({
      to: emailValidation.valid,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Failed to send email',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Wishlist shared successfully',
      sent_count: emailResult.sent_count || 0,
      failed_count: emailResult.failed_count || 0,
    });
  } catch (error) {
    console.error('Share API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}


