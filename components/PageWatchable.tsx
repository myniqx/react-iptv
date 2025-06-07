"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Heart, Info, Film, Tv, Radio, ArrowLeft } from "lucide-react"
import type { WatchObject } from "@/lib/structures/viewable/watchable/watch-object"
import { VideoView } from "./views/VideoView"

interface PageWatchableProps {
  watchable: WatchObject
  onBack: () => void
}

export function PageWatchable({ watchable, onBack }: PageWatchableProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorite, setIsFavorite] = useState(watchable.IsFavorite || false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handleStop = () => {
    setIsPlaying(false)
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Update the watchable object if it has a toggleFavorite method
    if (typeof watchable.toggleFavorite === "function") {
      watchable.toggleFavorite()
    }
  }

  const getTypeIcon = () => {
    if (watchable.PossibleLiveStream) {
      return <Radio className="h-5 w-5 text-red-500" />
    }
    if (watchable.Title?.toLowerCase().includes("tv") || watchable.Title?.toLowerCase().includes("series")) {
      return <Tv className="h-5 w-5 text-green-500" />
    }
    return <Film className="h-5 w-5 text-purple-500" />
  }

  if (isPlaying) {
    return (
      <div className="h-full">
        <VideoView src={watchable.Url} title={watchable.Name} onClose={handleStop} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] bg-secondary rounded-lg overflow-hidden">
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
            <div className={`w-full h-full flex items-center justify-center ${watchable.Logo ? "hidden" : ""}`}>
              {getTypeIcon()}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon()}
              <h1 className="text-3xl font-bold">{watchable.Name}</h1>
            </div>

            {watchable.Title && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">{watchable.Title}</Badge>
                {watchable.isHot && <Badge>New</Badge>}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handlePlay} size="lg">
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>

            <Button variant={isFavorite ? "default" : "outline"} onClick={handleToggleFavorite}>
              <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </Button>
          </div>

          {watchable.Description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-4 w-4" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{watchable.Description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {watchable.Group && (
                <div className="flex justify-between">
                  <span className="font-medium">Group:</span>
                  <span>{watchable.Group}</span>
                </div>
              )}

              {watchable.Duration && (
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>
                    {Math.floor(watchable.Duration / 60)}:{(watchable.Duration % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}

              {watchable.DateDiff && (
                <div className="flex justify-between">
                  <span className="font-medium">Added:</span>
                  <span>{watchable.DateDiff}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="font-medium">URL:</span>
                <span className="text-xs text-muted-foreground truncate max-w-xs">{watchable.Url}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
