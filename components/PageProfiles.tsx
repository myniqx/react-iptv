"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Upload, Loader2 } from "lucide-react"
import { useIptv } from "@/lib/contexts/iptv-context"
import type { ProfileData } from "@/lib/types"
import type { Catalog } from "@/lib/structures/viewable/groups/catalog"
import { useToast } from "@/hooks/use-toast"

interface PageProfilesProps {
  onLoad: (catalog: Catalog | null) => void
}

export function PageProfiles({ onLoad }: PageProfilesProps) {
  const { profiles, addProfile, updateProfile, deleteProfile, loadCatalog } = useIptv()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<ProfileData | null>(null)
  const [profileName, setProfileName] = useState("")
  const [profileUrl, setProfileUrl] = useState("")
  const [loading, setLoading] = useState<number | null>(null)

  const { toast } = useToast()

  const handleCreateProfile = async () => {
    if (!profileName.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingProfile) {
        const updatedProfile: ProfileData = {
          ...editingProfile,
          name: profileName.trim(),
          url: profileUrl.trim() || "list.m3u",
        }
        await updateProfile(updatedProfile)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        await addProfile({
          name: profileName.trim(),
          url: profileUrl.trim() || "list.m3u",
          updatedDate: 0,
          groupCount: 0,
          totalCount: 0,
          tvShowSeasonCount: 0,
          tvShowEpisodeCount: 0,
          liveStreamCount: 0,
          movieCount: 0,
          tvShowCount: 0,
          createdDate: 0
        })
        toast({
          title: "Success",
          description: "Profile created successfully",
        })
      }

      setIsDialogOpen(false)
      setEditingProfile(null)
      setProfileName("")
      setProfileUrl("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      })
    }
  }

  const handleEditProfile = (profile: ProfileData) => {
    setEditingProfile(profile)
    setProfileName(profile.name)
    setProfileUrl(profile.url)
    setIsDialogOpen(true)
  }

  const handleDeleteProfile = async (profile: ProfileData) => {
    try {
      await deleteProfile(profile.id)
      toast({
        title: "Success",
        description: "Profile deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      })
    }
  }

  const handleLoadProfile = async (profile: ProfileData) => {
    setLoading(profile.id)
    try {
      onLoad(null) // Show loading state
      const catalog = await loadCatalog(profile, true)
      onLoad(catalog)
      toast({
        title: "Success",
        description: `Profile ${profile.name} loaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
      onLoad(null)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">IPTV Profiles</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent aria-description="Create a new profile">
            <DialogHeader>
              <DialogTitle>{editingProfile ? "Edit Profile" : "Create New Profile"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm font-medium">
                  Profile Name
                </label>
                <Input
                  id="profile-name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter profile name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="profile-url" className="text-sm font-medium">
                  M3U URL
                </label>
                <Input
                  id="profile-url"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="Enter M3U URL"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProfile}>{editingProfile ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{profile.name}</span>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditProfile(profile)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProfile(profile)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground truncate mb-4">{profile.url}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleLoadProfile(profile)} disabled={loading === profile.id}>
                {loading === profile.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Load Profile
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-card">
          <div className="p-6">
            <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No profiles found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first IPTV profile</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
