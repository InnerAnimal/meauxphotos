"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase/client"

interface FilterBarProps {
  selectedBrand: string
  selectedType: string
  onBrandChange: (brand: string) => void
  onTypeChange: (type: string) => void
}

export function FilterBar({
  selectedBrand,
  selectedType,
  onBrandChange,
  onTypeChange,
}: FilterBarProps) {
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    async function fetchBrands() {
      const supabase = createSupabaseClient()
      const { data } = await supabase.from("brands").select("id, name")
      if (data) {
        setBrands(data)
      }
    }
    fetchBrands()
  }, [])

  return (
    <div className="flex gap-2">
      <Select value={selectedBrand} onValueChange={onBrandChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Brands" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Brands</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="image">Images</SelectItem>
          <SelectItem value="video">Videos</SelectItem>
          <SelectItem value="document">Documents</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

