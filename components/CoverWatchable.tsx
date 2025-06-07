"use client"

import { Film, Tv, Radio, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { WatchObject } from "@/lib/structures/viewable/watchable/watch-object"
import { EList } from "@/lib/utils/e-list"

interface CoverWatchableProps {
  watchable: WatchObject
  viewMode: "grid" | "list"
  onSelect: () => void
}

export function CoverWatchable({ watchable, viewMode, onSelect }: CoverWatchableProps) {
  const getIcon = () => {
    if (watchable.PossibleLiveStream) {
      return <Radio className="h-5 w-5 text-red-500" />
    }
    if (watchable.Title?.toLowerCase().includes("tv") || watchable.Title?.toLowerCase().includes("series")) {
      return <Tv className="h-5 w-5 text-green-500" />
    }
    return <Film className="h-5 w-5 text-purple-500" />
  }

  const getListIcon = () => {
    switch (watchable.listed) {
      case EList.WATCH:
        return <Heart className="h-4 w-4 text-red-500" />
      case EList.WATCHED:
        return <Badge variant="secondary">Watched</Badge>
      default:
        return null
    }
  }

  if (viewMode === "list") {
    return (
      <Button variant="ghost" className="w-full justify-start h-auto py-3 px-4 text-left" onClick={onSelect}>
        <div className="flex items-center gap-3 w-full">
          <Avatar className="h-10 w-10 rounded-md">
            {watchable.Logo ? <AvatarImage src={watchable.Logo || "/placeholder.svg"} alt={watchable.Name} /> : null}
            <AvatarFallback className="rounded-md bg-secondary">{getIcon()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{watchable.Name}</h3>
            {watchable.Title && <p className="text-sm text-muted-foreground truncate">{watchable.Title}</p>}
          </div>
          <div className="flex items-center gap-2">
            {getListIcon()}
            {watchable.isHot && <Badge>New</Badge>}
          </div>
        </div>
      </Button>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
      <div className="aspect-[2/3] relative">
        {watchable.Logo ? (
          <img
            src={watchable.Logo || "/placeholder.svg"}
            alt={watchable.Name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none"
              e.currentTarget.nextElementSibling?.classList.remove("hidden")
            }}
          />
        ) : null}
        <div
          className={`w-full h-full bg-secondary flex items-center justify-center ${watchable.Logo ? "hidden" : ""}`}
        >
          {getIcon()}
        </div>

        {watchable.isHot && <Badge className="absolute top-2 right-2">New</Badge>}

        {watchable.listed === EList.WATCH && (
          <div className="absolute top-2 left-2">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium truncate">{watchable.Name}</h3>
        {watchable.Title && <p className="text-sm text-muted-foreground truncate">{watchable.Title}</p>}
        {watchable.DateDiff && <p className="text-xs text-muted-foreground mt-1">{watchable.DateDiff}</p>}
      </CardContent>
    </Card>
  )
}
