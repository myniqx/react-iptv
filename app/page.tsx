"use client"

import { useState, useEffect } from "react"
import { useIptv } from "@/lib/contexts/iptv-context"
import { SidePanel } from "@/components/SidePanel"
import { PageProfiles } from "@/components/PageProfiles"
import { PageList } from "@/components/PageList"
import { PageWatchable } from "@/components/PageWatchable"
import { Toaster } from "@/components/ui/toaster"
import type { Catalog } from "@/lib/structures/viewable/groups/catalog"
import type { GroupObject } from "@/lib/structures/viewable/groups/group-object"
import type { WatchableObject } from "@/lib/structures/viewable/watchable/watch-object"

export default function Home() {
  const { currentCatalog } = useIptv()
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState<"profiles" | "list" | "watchable">("profiles")
  const [selectedGroup, setSelectedGroup] = useState<GroupObject | null>(null)
  const [selectedWatchable, setSelectedWatchable] = useState<WatchableObject | null>(null)

  useEffect(() => {
    setCatalog(currentCatalog)
  }, [currentCatalog])

  const handleLoadCatalog = (newCatalog: Catalog | null) => {
    setCatalog(newCatalog)
    if (newCatalog) {
      setCurrentPage("list")
      setSelectedGroup(newCatalog)
    } else {
      setLoading(true)
    }
  }

  const handleGroupSelected = (group: GroupObject) => {
    setSelectedGroup(group)
    setCurrentPage("list")
  }

  const handleWatchableSelected = (watchable: WatchableObject) => {
    setSelectedWatchable(watchable)
    setCurrentPage("watchable")
  }

  const handleBackToProfiles = () => {
    setCurrentPage("profiles")
    setSelectedGroup(null)
    setSelectedWatchable(null)
    setCatalog(null)
  }

  const handleBackToList = () => {
    setCurrentPage("list")
    setSelectedWatchable(null)
  }

  return (
    <div className="iptv-container">
      <SidePanel tree={catalog} loading={loading} onSelectedGroup={handleGroupSelected} />

      <main className="iptv-main">
        <div className="iptv-content">
          {currentPage === "profiles" && <PageProfiles onLoad={handleLoadCatalog} />}

          {currentPage === "list" && selectedGroup && (
            <PageList
              groupObject={selectedGroup}
              onGroupSelected={handleGroupSelected}
              onWatchableSelected={handleWatchableSelected}
            />
          )}

          {currentPage === "watchable" && selectedWatchable && (
            <PageWatchable watchable={selectedWatchable} onBack={handleBackToList} />
          )}
        </div>
      </main>

      <Toaster />
    </div>
  )
}
