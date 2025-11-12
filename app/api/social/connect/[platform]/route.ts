import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform
  const { searchParams } = new URL(request.url)
  const brandId = searchParams.get('brandId')

  // OAuth URLs for each platform
  const oauthUrls: Record<string, string> = {
    instagram: `https://api.instagram.com/oauth/authorize?client_id=${process.env.META_APP_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + '/api/social/callback/instagram')}&scope=instagram_basic,instagram_content_publish&response_type=code&state=${brandId}`,
    facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + '/api/social/callback/facebook')}&scope=pages_show_list,pages_read_engagement&state=${brandId}`,
    tiktok: `https://www.tiktok.com/v2/auth/authorize?client_key=${process.env.TIKTOK_CLIENT_KEY}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + '/api/social/callback/tiktok')}&response_type=code&scope=video.upload,video.publish&state=${brandId}`,
    linkedin: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + '/api/social/callback/linkedin')}&scope=w_member_social&state=${brandId}`,
    youtube: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.YOUTUBE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + '/api/social/callback/youtube')}&response_type=code&scope=youtube.upload&access_type=offline&state=${brandId}`,
    snapchat: `https://accounts.snapchat.com/login/oauth2/authorize?client_id=${process.env.SNAPCHAT_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + '/api/social/callback/snapchat')}&response_type=code&scope=snapchat-marketing-api&state=${brandId}`,
  }

  const url = oauthUrls[platform]
  if (!url) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  return NextResponse.redirect(url)
}

