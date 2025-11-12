"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

interface SchedulePostParams {
  brandId: string
  content: string
  platforms: Array<"instagram" | "facebook" | "tiktok" | "linkedin" | "youtube" | "snapchat">
  assets: string[]
  scheduledFor: string
  status: "draft" | "scheduled" | "posted" | "failed"
}

export async function schedulePost(params: SchedulePostParams) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const { data: post, error } = await supabase
      .from("scheduled_posts")
      .insert({
        brand_id: params.brandId,
        user_id: session.user.id,
        content: params.content,
        platforms: params.platforms,
        assets: params.assets,
        scheduled_for: params.scheduledFor,
        status: params.status,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, post }
  } catch (error) {
    console.error("Schedule post error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to schedule post",
    }
  }
}

