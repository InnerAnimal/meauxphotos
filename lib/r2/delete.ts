import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { createR2Client } from './client'

export async function deleteFromR2(key: string, bucket?: string): Promise<void> {
  const client = createR2Client()
  const bucketName = bucket || process.env.R2_BUCKET_NAME!

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  )
}

