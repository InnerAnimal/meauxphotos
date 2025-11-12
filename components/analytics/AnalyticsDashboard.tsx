"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    postedPosts: 0,
    scheduledPosts: 0,
    totalStorage: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const supabase = createSupabaseClient()

      const { data: posts } = await supabase.from("scheduled_posts").select("status")
      const { data: assets } = await supabase.from("assets").select("file_size")

      if (posts) {
        setStats({
          totalPosts: posts.length,
          postedPosts: posts.filter((p) => p.status === "posted").length,
          scheduledPosts: posts.filter((p) => p.status === "scheduled").length,
          totalStorage: assets?.reduce((acc, a) => acc + (a.file_size || 0), 0) || 0,
        })
      }
    }
    loadStats()
  }, [])

  const chartData = [
    { name: "Posted", value: stats.postedPosts },
    { name: "Scheduled", value: stats.scheduledPosts },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.postedPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduledPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.totalStorage / 1024 / 1024 / 1024).toFixed(2)} GB
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Status Overview</CardTitle>
          <CardDescription>Distribution of posted vs scheduled posts</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1F97A9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

