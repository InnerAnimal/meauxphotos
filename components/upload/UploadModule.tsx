"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, X, CheckCircle2 } from "lucide-react"
import { uploadAsset } from "@/app/actions/upload"
import { useToast } from "@/components/ui/use-toast"
import { formatFileSize } from "@/lib/utils/format"

interface UploadModuleProps {
  brands: Array<{ id: string; name: string; slug: string }>
}

interface FileWithPreview extends File {
  preview?: string
  progress?: number
  status?: "pending" | "uploading" | "success" | "error"
  error?: string
}

export function UploadModule({ brands }: UploadModuleProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [tags, setTags] = useState<string>("")
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const fileWithPreview: FileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "pending" as const,
      })
      return fileWithPreview
    })
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".heic"],
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
      "application/pdf": [".pdf"],
    },
    maxSize: 500 * 1024 * 1024, // 500MB
  })

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      const file = newFiles[index]
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleUpload = async () => {
    if (!selectedBrand) {
      toast({
        title: "Brand Required",
        description: "Please select a brand before uploading.",
        variant: "destructive",
      })
      return
    }

    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please select files to upload.",
        variant: "destructive",
      })
      return
    }

    const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setFiles((prev) => {
        const updated = [...prev]
        updated[i] = { ...updated[i], status: "uploading", progress: 0 }
        return updated
      })

      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("brandId", selectedBrand)
        formData.append("tags", JSON.stringify(tagArray))

        const result = await uploadAsset(formData)

        if (result.success) {
          setFiles((prev) => {
            const updated = [...prev]
            updated[i] = { ...updated[i], status: "success", progress: 100 }
            return updated
          })
        } else {
          throw new Error(result.error || "Upload failed")
        }
      } catch (error) {
        setFiles((prev) => {
          const updated = [...prev]
          updated[i] = {
            ...updated[i],
            status: "error",
            error: error instanceof Error ? error.message : "Upload failed",
          }
          return updated
        })
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        })
      }
    }

    toast({
      title: "Upload Complete",
      description: "All files have been processed.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger id="brand" className="mt-2">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., hero, website, social-post"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragActive
                ? "Drop files here"
                : "Drag & drop files here, or click to select"}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports images, videos, and PDFs (max 500MB per file)
            </p>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {file.preview && file.type.startsWith("image/") && (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                        {file.status === "uploading" && (
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${file.progress || 0}%` }}
                            />
                          </div>
                        )}
                        {file.status === "success" && (
                          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Uploaded successfully
                          </p>
                        )}
                        {file.status === "error" && (
                          <p className="text-sm text-red-600 mt-1">
                            {file.error || "Upload failed"}
                          </p>
                        )}
                      </div>
                    </div>
                    {file.status !== "uploading" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                onClick={handleUpload}
                disabled={!selectedBrand || files.some((f) => f.status === "uploading")}
                className="w-full"
                variant="glow"
              >
                Upload {files.length} File{files.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

