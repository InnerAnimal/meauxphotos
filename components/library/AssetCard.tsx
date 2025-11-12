"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Download, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatFileSize, formatDate } from "@/lib/utils/format"
import type { Asset } from "@/lib/supabase/types"
import { deleteAsset } from "@/app/actions/assets"

interface AssetCardProps {
  asset: Asset
}

export function AssetCard({ asset }: AssetCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(asset.cdn_url)
    toast({
      title: "Copied!",
      description: "CDN URL copied to clipboard",
    })
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this asset?")) {
      const result = await deleteAsset(asset.id)
      if (result.success) {
        toast({
          title: "Deleted",
          description: "Asset deleted successfully",
        })
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete asset",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <>
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsOpen(true)}
      >
        {asset.file_type === "image" ? (
          <div className="aspect-square relative bg-gray-100">
            <Image
              src={asset.cdn_url}
              alt={asset.filename}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />
          </div>
        ) : (
          <div className="aspect-square flex items-center justify-center bg-gray-100">
            <span className="text-4xl">
              {asset.file_type === "video" ? "🎥" : "📄"}
            </span>
          </div>
        )}
        <div className="p-2">
          <p className="text-sm font-medium truncate">{asset.filename}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(asset.file_size)}</p>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{asset.filename}</DialogTitle>
            <DialogDescription>
              Uploaded {formatDate(asset.uploaded_at)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {asset.file_type === "image" && (
              <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={asset.cdn_url}
                  alt={asset.filename}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">File Size</p>
                <p className="text-muted-foreground">{formatFileSize(asset.file_size)}</p>
              </div>
              {asset.dimensions && (
                <div>
                  <p className="font-medium">Dimensions</p>
                  <p className="text-muted-foreground">
                    {asset.dimensions.width} × {asset.dimensions.height}
                  </p>
                </div>
              )}
              <div>
                <p className="font-medium">Type</p>
                <p className="text-muted-foreground capitalize">{asset.file_type}</p>
              </div>
              <div>
                <p className="font-medium">Tags</p>
                <p className="text-muted-foreground">
                  {asset.tags.length > 0 ? asset.tags.join(", ") : "No tags"}
                </p>
              </div>
            </div>
            <div>
              <p className="font-medium mb-2">CDN URL</p>
              <div className="flex gap-2">
                <Input value={asset.cdn_url} readOnly className="font-mono text-xs" />
                <Button size="icon" onClick={handleCopyUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.open(asset.cdn_url, "_blank")}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

