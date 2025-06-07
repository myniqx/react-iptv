"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { AudioTrack } from "../types/video"

interface AudioTrackSelectorProps {
  isOpen: boolean
  onClose: () => void
  audioTracks: AudioTrack[]
  selectedTrack: string
  onTrackChange: (trackId: string) => void
}

export function AudioTrackSelector({
  isOpen,
  onClose,
  audioTracks,
  selectedTrack,
  onTrackChange,
}: AudioTrackSelectorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Audio Track Selection</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Available Audio Tracks</Label>
            <Select value={selectedTrack} onValueChange={onTrackChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select audio track" />
              </SelectTrigger>
              <SelectContent>
                {audioTracks.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.label} ({track.language})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
