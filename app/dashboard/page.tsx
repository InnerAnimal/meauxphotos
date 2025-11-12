import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { BrandSwitcher } from "@/components/dashboard/BrandSwitcher"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch dashboard stats
  const { data: assets } = await supabase
    .from("assets")
    .select("id, file_size")
    .limit(1000)

  const { data: posts } = await supabase
    .from("scheduled_posts")
    .select("id, status")
    .limit(1000)

  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("id")
    .limit(1000)

  const totalAssets = assets?.length || 0
  const totalStorage = assets?.reduce((acc, asset) => acc + (asset.file_size || 0), 0) || 0
  const scheduledPosts = posts?.filter((p) => p.status === "scheduled").length || 0
  const totalTeamMembers = teamMembers?.length || 0

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your content.
          </p>
        </div>
        <BrandSwitcher />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Assets"
          value={totalAssets.toLocaleString()}
          description="Images, videos, and documents"
          icon="Image"
        />
        <StatsCard
          title="Storage Used"
          value={`${(totalStorage / 1024 / 1024 / 1024).toFixed(2)} GB`}
          description="Cloudflare R2 storage"
          icon="HardDrive"
        />
        <StatsCard
          title="Scheduled Posts"
          value={scheduledPosts.toString()}
          description="Upcoming social media posts"
          icon="Calendar"
        />
        <StatsCard
          title="Team Members"
          value={totalTeamMembers.toString()}
          description="Active collaborators"
          icon="Users"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}

