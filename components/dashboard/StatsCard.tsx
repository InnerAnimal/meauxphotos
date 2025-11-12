import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Image,
  HardDrive,
  Calendar,
  Users,
  Upload,
  BarChart3,
} from "lucide-react"

const iconMap: Record<string, typeof Image> = {
  Image,
  HardDrive,
  Calendar,
  Users,
  Upload,
  BarChart3,
}

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: string
}

export function StatsCard({ title, value, description, icon }: StatsCardProps) {
  const Icon = iconMap[icon] || Image

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

