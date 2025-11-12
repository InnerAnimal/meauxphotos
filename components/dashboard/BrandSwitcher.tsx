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

export function BrandSwitcher() {
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([])
  const [selectedBrand, setSelectedBrand] = useState<string>("all")

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
    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select brand" />
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
  )
}

