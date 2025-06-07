"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
  Settings,
  Subtitles,
  Languages,
} from "lucide-react"
import { formatTime } from "../utils/subtitle"

interface VideoControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  onTogglePlay: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  onSkipForward: () => void
  onSkipBackward: () => void
  onToggleFullscreen: () => void
  onOpenSettings: () => void
  onOpenSubtitles: () => void
  onOpenAudioTracks: () => void
  className?: string
}

export function VideoControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onSkipForward,
  onSkipBackward,
  onToggleFullscreen,
  onOpenSettings,
  onOpenSubtitles,
  onOpenAudioTracks,
  className = "",
}: VideoControlsProps) {
  return (
    <div className={`video-controls ${className}`}>
      {/* Progress Bar */}
      <div className="video-progress-container">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={([value]) => onSeek(value)}
          className="video-progress-slider"
        />
        <div className="video-time-display">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="video-controls-buttons">
        <div className="video-controls-left">
          <Button variant="ghost" size="icon" onClick={onTogglePlay}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={onSkipBackward}>
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={onSkipForward}>
            <SkipForward className="h-5 w-5" />
          </Button>

          <div className="video-volume-control">
            <Button variant="ghost" size="icon" onClick={onToggleMute}>
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={([value]) => onVolumeChange(value)}
              className="video-volume-slider"
            />
          </div>
        </div>

        <div className="video-controls-right">
          <Button variant="ghost" size="icon" onClick={onOpenAudioTracks}>
            <Languages className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={onOpenSubtitles}>
            <Subtitles className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={onOpenSettings}>
            <Settings className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
