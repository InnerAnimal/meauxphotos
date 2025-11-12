"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { uploadToR2, generateR2Path } from "@/lib/r2/upload"
import sharp from "sharp"
import { generateFilename } from "@/lib/utils/format"

export async function uploadAsset(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const file = formData.get("file") as File
    const brandId = formData.get("brandId") as string
    const tagsJson = formData.get("tags") as string
    const tags = JSON.parse(tagsJson || "[]")

    if (!file || !brandId) {
      return { success: false, error: "Missing required fields" }
    }

    // Get brand info
    const { data: brand } = await supabase
      .from("brands")
      .select("slug")
      .eq("id", brandId)
      .single()

    if (!brand) {
      return { success: false, error: "Brand not found" }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let optimizedBuffer = buffer
    let fileType: "image" | "video" | "document" = "document"
    let dimensions: { width: number; height: number } | null = null
    let finalFilename = file.name

    // Determine file type
    if (file.type.startsWith("image/")) {
      fileType = "image"
      try {
        // Optimize image with Sharp
        const image = sharp(buffer)
        const metadata = await image.metadata()
        dimensions = {
          width: metadata.width || 0,
          height: metadata.height || 0,
        }

        // Resize if needed (max 1920px width)
        if (dimensions.width > 1920) {
          image.resize(1920, null, {
            withoutEnlargement: true,
            fit: "inside",
          })
        }

        // Convert to WebP
        optimizedBuffer = await image
          .webp({ quality: 85, effort: 6 })
          .toBuffer()

        const ext = "webp"
        const baseName = file.name.replace(/\.[^/.]+$/, "")
        finalFilename = generateFilename(baseName, ext)
      } catch (error) {
        console.error("Image optimization error:", error)
        // Fallback to original if optimization fails
        optimizedBuffer = buffer
      }
    } else if (file.type.startsWith("video/")) {
      fileType = "video"
      // Video optimization would require FFmpeg (optional)
      // For now, use original file
      optimizedBuffer = buffer
    } else {
      fileType = "document"
      optimizedBuffer = buffer
    }

    // Generate R2 path
    const r2Path = generateR2Path(brand.slug, fileType, finalFilename)

    // Upload to R2
    const cdnUrl = await uploadToR2({
      bucket: process.env.R2_BUCKET_NAME!,
      key: r2Path,
      body: optimizedBuffer,
      contentType: file.type === "image/" ? "image/webp" : file.type,
    })

    // Save to database
    const { data: asset, error: dbError } = await supabase
      .from("assets")
      .insert({
        brand_id: brandId,
        user_id: session.user.id,
        filename: finalFilename,
        r2_path: r2Path,
        cdn_url: cdnUrl,
        file_type: fileType,
        file_size: optimizedBuffer.length,
        dimensions,
        tags,
      })
      .select()
      .single()

    if (dbError) {
      return { success: false, error: dbError.message }
    }

    return {
      success: true,
      asset: {
        id: asset.id,
        cdnUrl: asset.cdn_url,
        filename: asset.filename,
      },
    }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

