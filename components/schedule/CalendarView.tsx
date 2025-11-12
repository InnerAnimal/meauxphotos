"use client"

import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { ScheduledPost } from "@/lib/supabase/types"

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [posts, setPosts] = useState<ScheduledPost[]>([])

  useEffect(() => {
    async function loadPosts() {
      const supabase = createSupabaseClient()
      const { data } = await supabase
        .from("scheduled_posts")
        .select("*")
        .order("scheduled_for", { ascending: true })

      if (data) {
        setPosts(data)
      }
    }
    loadPosts()
  }, [])

  const getPostsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return posts.filter((post) => {
      const postDate = format(new Date(post.scheduled_for), "yyyy-MM-dd")
      return postDate === dateStr
    })
  }

  const selectedPosts = selectedDate ? getPostsForDate(selectedDate) : []

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
            </h3>
            <div className="space-y-2">
              {selectedPosts.length > 0 ? (
                selectedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="text-sm font-medium truncate">{post.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(post.scheduled_for), "h:mm a")} • {post.platforms.join(", ")}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        post.status === "posted"
                          ? "bg-green-100 text-green-800"
                          : post.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No posts scheduled</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

