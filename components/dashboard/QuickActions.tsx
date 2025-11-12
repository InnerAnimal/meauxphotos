"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Calendar, Image } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href="/upload">
          <Button variant="glow" className="w-full justify-start" size="lg">
            <Upload className="mr-2 h-4 w-4" />
            Upload Assets
          </Button>
        </Link>
        <Link href="/schedule">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Post
          </Button>
        </Link>
        <Link href="/library">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Image className="mr-2 h-4 w-4" />
            Browse Library
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

