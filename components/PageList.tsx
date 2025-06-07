"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Grid, List, Search } from "lucide-react"
import { CoverGroup } from "./CoverGroup"
import { CoverWatchable } from "./CoverWatchable"
import type { GroupObject } from "@/lib/structures/viewable/groups/group-object"
import type { WatchObject } from "@/lib/structures/viewable/watchable/watch-object"

interface PageListProps {
  groupObject: GroupObject
  onGroupSelected: (group: GroupObject) => void
  onWatchableSelected: (watchable: WatchObject) => void
}

export function PageList({ groupObject, onGroupSelected, onWatchableSelected }: PageListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredGroups = groupObject.groups.filter((group) =>
    group.Name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredWatchables = groupObject.watchables.filter((watchable) =>
    watchable.Name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">{groupObject.Name}</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredGroups.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Groups</h3>
          <div className={viewMode === "grid" ? "iptv-grid" : "iptv-list"}>
            {filteredGroups.map((group) => (
              <CoverGroup key={group.Name} group={group} viewMode={viewMode} onSelect={() => onGroupSelected(group)} />
            ))}
          </div>
        </div>
      )}

      {filteredWatchables.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content</h3>
          <div className={viewMode === "grid" ? "iptv-grid" : "iptv-list"}>
            {filteredWatchables.map((watchable) => (
              <CoverWatchable
                key={watchable.Name}
                watchable={watchable}
                viewMode={viewMode}
                onSelect={() => onWatchableSelected(watchable)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredGroups.length === 0 && filteredWatchables.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-card">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No content found</h3>
          {searchTerm ? (
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          ) : (
            <p className="text-muted-foreground">This group appears to be empty</p>
          )}
        </div>
      )}
    </div>
  )
}
