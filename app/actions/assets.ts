"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { deleteFromR2 } from "@/lib/r2/delete"

export async function deleteAsset(assetId: string) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    // Get asset info
    const { data: asset, error: fetchError } = await supabase
      .from("assets")
      .select("r2_path, user_id")
      .eq("id", assetId)
      .single()

    if (fetchError || !asset) {
      return { success: false, error: "Asset not found" }
    }

    // Check permissions (user must own the asset or be admin)
    if (asset.user_id !== session.user.id) {
      // Check if user is admin/owner
      const { data: member } = await supabase
        .from("team_members")
        .select("role")
        .eq("user_id", session.user.id)
        .single()

      if (!member || (member.role !== "admin" && member.role !== "owner")) {
        return { success: false, error: "Unauthorized" }
      }
    }

    // Delete from R2
    await deleteFromR2(asset.r2_path)

    // Delete from database
    const { error: deleteError } = await supabase
      .from("assets")
      .delete()
      .eq("id", assetId)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Delete error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    }
  }
}

