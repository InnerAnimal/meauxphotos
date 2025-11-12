import { formatDistanceToNow, format } from 'date-fns'

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function generateFilename(originalName: string, extension: string): string {
  const timestamp = Date.now()
  const sanitized = originalName
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()
    .substring(0, 50)
  return `${sanitized}-${timestamp}.${extension}`
}

