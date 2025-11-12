import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UploadModule } from "@/components/upload/UploadModule"

export default async function UploadPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: brands } = await supabase.from("brands").select("id, name, slug")

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Assets</h1>
        <p className="text-muted-foreground mt-2">
          Upload and optimize images, videos, and documents for your brands.
        </p>
      </div>
      <UploadModule brands={brands || []} />
    </div>
  )
}

