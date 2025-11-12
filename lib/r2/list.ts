import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { createR2Client } from './client'

export interface ListOptions {
  prefix?: string
  maxKeys?: number
  continuationToken?: string
}

export async function listR2Objects(options: ListOptions = {}) {
  const client = createR2Client()
  const bucket = process.env.R2_BUCKET_NAME!

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: options.prefix,
    MaxKeys: options.maxKeys || 1000,
    ContinuationToken: options.continuationToken,
  })

  const response = await client.send(command)
  return {
    objects: response.Contents || [],
    isTruncated: response.IsTruncated || false,
    nextContinuationToken: response.NextContinuationToken,
  }
}

