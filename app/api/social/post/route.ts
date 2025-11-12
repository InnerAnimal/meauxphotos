import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postId, platform } = body

    if (!postId || !platform) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get post data
    const { data: post, error: postError } = await supabase
      .from('scheduled_posts')
      .select('*, assets:assets(*)')
      .eq('id', postId)
      .single()

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Get social account for platform
    const { data: socialAccount, error: accountError } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('brand_id', post.brand_id)
      .eq('platform', platform)
      .single()

    if (accountError || !socialAccount) {
      return NextResponse.json(
        { error: `No ${platform} account connected` },
        { status: 400 }
      )
    }

    // Platform-specific posting logic would go here
    // This is a placeholder - actual implementation would use each platform's API
    // Example: Instagram Graph API, TikTok Content API, etc.

    // Update post status
    await supabase
      .from('scheduled_posts')
      .update({ status: 'posted', posted_at: new Date().toISOString() })
      .eq('id', postId)

    return NextResponse.json({ success: true, message: 'Post published successfully' })
  } catch (error) {
    console.error('Post publishing error:', error)
    return NextResponse.json(
      { error: 'Failed to publish post' },
      { status: 500 }
    )
  }
}

