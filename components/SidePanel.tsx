"use client"

import { useState } from "react"
import { Folder, ChevronRight, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Catalog } from "@/lib/structures/viewable/groups/catalog"
import type { GroupObject } from "@/lib/structures/viewable/groups/group-object"

interface SidePanelProps {
  tree: Catalog | null
  loading: boolean
  onSelectedGroup: (group: GroupObject) => void
}

export function SidePanel({ tree, loading, onSelectedGroup }: SidePanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName)
    } else {
      newExpanded.add(groupName)
    }
    setExpandedGroups(newExpanded)
  }

  const renderGroup = (group: GroupObject, level = 0) => {
    const isExpanded = expandedGroups.has(group.Name)
    const hasChildren = group.groups && group.groups.length > 0

    return (
      <div key={group.Name + level} className="w-full">
        <div
          className="flex items-center py-2 px-3 hover:bg-secondary/50 rounded-md cursor-pointer"
          style={{ paddingLeft: `${level * 12 + 12}px` }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 mr-2"
            onClick={(e) => {
              e.stopPropagation()
              if (hasChildren) {
                toggleGroup(group.Name)
              }
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <Folder className="h-4 w-4" />
            )}
          </Button>

          <span className="truncate flex-1" onClick={() => onSelectedGroup(group)}>
            {group.Name}
          </span>

          {hasChildren && <span className="text-xs text-muted-foreground">({group.groups.length})</span>}
        </div>

        {isExpanded && hasChildren && <div>{group.groups.map((child) => renderGroup(child, level + 1))}</div>}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="iptv-sidebar flex items-center justify-center">
        <div className="text-center p-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Loading content...</p>
        </div>
      </div>
    )
  }

  if (!tree) {
    return (
      <div className="iptv-sidebar">
        <div className="p-4 text-center">
          <p className="text-muted-foreground">No content loaded</p>
        </div>
      </div>
    )
  }

  return (
    <div className="iptv-sidebar">
      <div className="p-4 border-b">
        <h2 className="font-semibold truncate">{tree.Name || "Content"}</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-2">
          {tree.movieList && renderGroup(tree.movieList)}
          {tree.seriesList && renderGroup(tree.seriesList)}
          {tree.liveList && renderGroup(tree.liveList)}
        </div>
      </ScrollArea>
    </div>
  )
}
