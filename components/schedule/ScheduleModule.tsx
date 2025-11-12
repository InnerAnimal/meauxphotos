"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostComposer } from "./PostComposer"
import { CalendarView } from "./CalendarView"

interface ScheduleModuleProps {
  brands: Array<{ id: string; name: string }>
  assets: Array<{ id: string; filename: string; cdn_url: string; file_type: string }>
}

export function ScheduleModule({ brands, assets }: ScheduleModuleProps) {
  return (
    <Tabs defaultValue="compose" className="space-y-6">
      <TabsList>
        <TabsTrigger value="compose">Compose</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
      </TabsList>
      <TabsContent value="compose">
        <PostComposer brands={brands} assets={assets} />
      </TabsContent>
      <TabsContent value="calendar">
        <CalendarView />
      </TabsContent>
    </Tabs>
  )
}

