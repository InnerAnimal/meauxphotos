"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils/cn"
import { schedulePost } from "@/app/actions/posts"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

interface PostComposerProps {
  brands: Array<{ id: string; name: string }>
  assets: Array<{ id: string; filename: string; cdn_url: string; file_type: string }>
}

const platforms = [
  { id: "instagram", name: "Instagram", icon: "📷" },
  { id: "facebook", name: "Facebook", icon: "👥" },
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "linkedin", name: "LinkedIn", icon: "💼" },
  { id: "youtube", name: "YouTube", icon: "▶️" },
  { id: "snapchat", name: "Snapchat", icon: "👻" },
]

export function PostComposer({ brands, assets }: PostComposerProps) {
  const [selectedBrand, setSelectedBrand] = useState("")
  const [content, setContent] = useState("")
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState("")
  const [isDraft, setIsDraft] = useState(false)
  const { toast } = useToast()

  const toggleAsset = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    )
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handleSubmit = async () => {
    if (!selectedBrand) {
      toast({
        title: "Brand Required",
        description: "Please select a brand",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter post content",
        variant: "destructive",
      })
      return
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform Required",
        description: "Please select at least one platform",
        variant: "destructive",
      })
      return
    }

    let scheduledFor = new Date().toISOString()
    if (!isDraft && scheduledDate) {
      const [hours, minutes] = scheduledTime.split(":").map(Number)
      const date = new Date(scheduledDate)
      date.setHours(hours || 0, minutes || 0, 0, 0)
      scheduledFor = date.toISOString()
    }

    const result = await schedulePost({
      brandId: selectedBrand,
      content,
      platforms: selectedPlatforms as any[],
      assets: selectedAssets,
      scheduledFor,
      status: isDraft ? "draft" : "scheduled",
    })

    if (result.success) {
      toast({
        title: "Success",
        description: isDraft ? "Post saved as draft" : "Post scheduled successfully",
      })
      // Reset form
      setContent("")
      setSelectedAssets([])
      setSelectedPlatforms([])
      setScheduledDate(undefined)
      setScheduledTime("")
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to schedule post",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="content">Caption</Label>
              <Textarea
                id="content"
                placeholder="Write your post caption..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-2 min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {content.length} characters
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
                    selectedAssets.includes(asset.id)
                      ? "border-primary"
                      : "border-transparent"
                  )}
                  onClick={() => toggleAsset(asset.id)}
                >
                  {asset.file_type === "image" ? (
                    <Image
                      src={asset.cdn_url}
                      alt={asset.filename}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-2xl">
                        {asset.file_type === "video" ? "🎥" : "📄"}
                      </span>
                    </div>
                  )}
                  {selectedAssets.includes(asset.id) && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Platforms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox
                  id={platform.id}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => togglePlatform(platform.id)}
                />
                <Label htmlFor={platform.id} className="cursor-pointer flex-1">
                  <span className="mr-2">{platform.icon}</span>
                  {platform.name}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="draft"
                checked={isDraft}
                onCheckedChange={(checked) => setIsDraft(checked === true)}
              />
              <Label htmlFor="draft" className="cursor-pointer">
                Save as draft
              </Label>
            </div>
            {!isDraft && (
              <>
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-2",
                          !scheduledDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Button onClick={handleSubmit} className="w-full" variant="glow" size="lg">
          {isDraft ? "Save Draft" : "Schedule Post"}
        </Button>
      </div>
    </div>
  )
}

