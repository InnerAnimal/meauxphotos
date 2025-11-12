"use client"

import { useState, useEffect, useCallback } from "react"
import { createSupabaseClient } from "@/lib/supabase/client"
import { AssetCard } from "./AssetCard"
import { FilterBar } from "./FilterBar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Asset } from "@/lib/supabase/types"

export function AssetLibrary() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadAssets = useCallback(async () => {
    setLoading(true)
    const supabase = createSupabaseClient()

    let query = supabase
      .from("assets")
      .select("*")
      .order("uploaded_at", { ascending: false })
      .range((page - 1) * 20, page * 20 - 1)

    if (selectedBrand !== "all") {
      query = query.eq("brand_id", selectedBrand)
    }

    if (selectedType !== "all") {
      query = query.eq("file_type", selectedType)
    }

    if (searchQuery) {
      query = query.or(`filename.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error loading assets:", error)
    } else {
      if (page === 1) {
        setAssets(data || [])
      } else {
        setAssets((prev) => [...prev, ...(data || [])])
      }
      setHasMore((data || []).length === 20)
    }

    setLoading(false)
  }, [page, selectedBrand, selectedType, searchQuery])

  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by filename or tags..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="pl-10"
          />
        </div>
        <FilterBar
          selectedBrand={selectedBrand}
          selectedType={selectedType}
          onBrandChange={(brand) => {
            setSelectedBrand(brand)
            setPage(1)
          }}
          onTypeChange={(type) => {
            setSelectedType(type)
            setPage(1)
          }}
        />
      </div>

      {loading && assets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Loading assets...</div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No assets found</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center py-4">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="text-primary hover:underline"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

