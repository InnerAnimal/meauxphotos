import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ScheduleModule } from "@/components/schedule/ScheduleModule"

export default async function SchedulePage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: brands } = await supabase.from("brands").select("id, name")
  const { data: assets } = await supabase
    .from("assets")
    .select("id, filename, cdn_url, file_type")
    .order("uploaded_at", { ascending: false })
    .limit(100)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Schedule Posts</h1>
        <p className="text-muted-foreground mt-2">
          Create and schedule social media posts across multiple platforms.
        </p>
      </div>
      <ScheduleModule brands={brands || []} assets={assets || []} />
    </div>
  )
}

