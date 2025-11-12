import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // brandId

  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=no_code', request.url))
  }

  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Exchange code for access token (platform-specific implementation)
  // This is a simplified version - actual implementation would vary by platform
  try {
    // Store the connection in database
    await supabase.from('social_accounts').insert({
      user_id: session.user.id,
      brand_id: state || '',
      platform: platform as any,
      access_token: 'temp_token', // Would be replaced with actual token
      username: null,
    })

    return NextResponse.redirect(new URL('/settings?connected=' + platform, request.url))
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/settings?error=connection_failed', request.url))
  }
}

