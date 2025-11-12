import { PutObjectCommand } from '@aws-sdk/client-s3'
import { createR2Client } from './client'

export interface UploadOptions {
  bucket: string
  key: string
  body: Buffer | Uint8Array | string
  contentType?: string
  metadata?: Record<string, string>
}

export async function uploadToR2(options: UploadOptions): Promise<string> {
  const client = createR2Client()
  const bucket = options.bucket || process.env.R2_BUCKET_NAME!

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: options.key,
      Body: options.body,
      ContentType: options.contentType,
      Metadata: options.metadata,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  )

  const publicUrl = process.env.R2_PUBLIC_URL || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  return `${publicUrl}/${options.key}`
}

export function generateR2Path(brandSlug: string, fileType: 'image' | 'video' | 'document', filename: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const typeFolder = fileType === 'image' ? 'images' : fileType === 'video' ? 'videos' : 'documents'
  
  return `${brandSlug}/${typeFolder}/${year}/${month}/${filename}`
}

