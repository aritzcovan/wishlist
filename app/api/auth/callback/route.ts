import { createClient } from '@/app/lib/supabase/client'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect based on type
  if (type === 'recovery') {
    // Password recovery - redirect to reset password page with token
    return NextResponse.redirect(`${requestUrl.origin}/reset-password`)
  }

  // Default - redirect to dashboard
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}

