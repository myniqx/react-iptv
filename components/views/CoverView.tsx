"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoverViewProps {
  imageUrl?: string
  title?: string
  subtitle?: string
  icon?: LucideIcon
  aspectRatio?: "square" | "video" | "poster"
  className?: string
  onClick?: () => void
}

export function CoverView({
  imageUrl,
  title,
  subtitle,
  icon: Icon,
  aspectRatio = "poster",
  className,
  onClick,
}: CoverViewProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    poster: "aspect-[2/3]",
  }

  return (
    <Card className={cn("cursor-pointer hover:shadow-lg transition-shadow", className)} onClick={onClick}>
      <CardContent className="p-0">
        <div className={cn("bg-muted rounded-t-lg overflow-hidden", aspectClasses[aspectRatio])}>
          {imageUrl ? (
            <img src={imageUrl || "/placeholder.svg"} alt={title || "Cover"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              {Icon && <Icon className="w-8 h-8" />}
            </div>
          )}
        </div>

        {(title || subtitle) && (
          <div className="p-3 space-y-1">
            {title && <h3 className="font-medium text-sm truncate">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
