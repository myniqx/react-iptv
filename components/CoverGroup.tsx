"use client"

import { Folder } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GroupObject } from "@/lib/structures/viewable/groups/group-object"

interface CoverGroupProps {
  group: GroupObject
  viewMode: "grid" | "list"
  onSelect: () => void
}

export function CoverGroup({ group, viewMode, onSelect }: CoverGroupProps) {
  if (viewMode === "list") {
    return (
      <Button variant="ghost" className="w-full justify-start h-auto py-3 px-4 text-left" onClick={onSelect}>
        <div className="flex items-center gap-3 w-full">
          <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
            <Folder className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{group.Name}</h3>
            <p className="text-sm text-muted-foreground">{group.groups.length + group.watchables.length} items</p>
          </div>
        </div>
      </Button>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
      <div className="aspect-square bg-primary/10 flex items-center justify-center">
        <Folder className="h-12 w-12 text-primary" />
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium truncate">{group.Name}</h3>
        <p className="text-sm text-muted-foreground">{group.groups.length + group.watchables.length} items</p>
      </CardContent>
    </Card>
  )
}
