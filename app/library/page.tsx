import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AssetLibrary } from "@/components/library/AssetLibrary"

export default async function LibraryPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Asset Library</h1>
        <p className="text-muted-foreground mt-2">
          Browse, search, and manage all your uploaded assets.
        </p>
      </div>
      <AssetLibrary />
    </div>
  )
}

