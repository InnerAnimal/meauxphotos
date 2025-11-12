import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatRelativeTime } from "@/lib/utils/format"

export async function RecentActivity() {
  const supabase = createServerSupabaseClient()

  const { data: assets } = await supabase
    .from("assets")
    .select("id, filename, uploaded_at, user_id")
    .order("uploaded_at", { ascending: false })
    .limit(10)

  const { data: posts } = await supabase
    .from("scheduled_posts")
    .select("id, content, scheduled_for, status")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest uploads and scheduled posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Recent Uploads</h4>
            <div className="space-y-2">
              {assets && assets.length > 0 ? (
                assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{asset.filename}</span>
                    <span className="text-muted-foreground ml-2">
                      {formatRelativeTime(asset.uploaded_at)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent uploads</p>
              )}
            </div>
          </div>
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">Scheduled Posts</h4>
            <div className="space-y-2">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{post.content.substring(0, 50)}...</span>
                    <span className="text-muted-foreground ml-2">
                      {formatRelativeTime(post.scheduled_for)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No scheduled posts</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

