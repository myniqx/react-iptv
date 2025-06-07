"use client"

import type React from "react"

import { useRef, useEffect, useState, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Volume2, VolumeX, Maximize, X, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoViewProps {
  src: string
  title?: string
  autoPlay?: boolean
  onClose?: () => void
  className?: string
}

export const VideoView = forwardRef<HTMLVideoElement, VideoViewProps>(
  ({ src, title, autoPlay = true, onClose, className }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(1)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Use the forwarded ref or the internal ref
    const resolvedRef = (ref as React.RefObject<HTMLVideoElement>) || videoRef

    useEffect(() => {
      const video = resolvedRef.current
      if (!video) return

      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)
      const handleTimeUpdate = () => setCurrentTime(video.currentTime)
      const handleDurationChange = () => setDuration(video.duration || 0)
      const handleVolumeChange = () => {
        setIsMuted(video.muted)
        setVolume(video.volume)
      }
      const handleError = () => {
        setError("Failed to load video stream")
      }
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement)
      }

      video.addEventListener("play", handlePlay)
      video.addEventListener("pause", handlePause)
      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("durationchange", handleDurationChange)
      video.addEventListener("volumechange", handleVolumeChange)
      video.addEventListener("error", handleError)
      document.addEventListener("fullscreenchange", handleFullscreenChange)

      if (autoPlay) {
        video.play().catch(() => {
          // Autoplay was prevented, show play button
          setIsPlaying(false)
        })
      }

      return () => {
        video.removeEventListener("play", handlePlay)
        video.removeEventListener("pause", handlePause)
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("durationchange", handleDurationChange)
        video.removeEventListener("volumechange", handleVolumeChange)
        video.removeEventListener("error", handleError)
        document.removeEventListener("fullscreenchange", handleFullscreenChange)
      }
    }, [autoPlay, resolvedRef])

    useEffect(() => {
      let timeout: NodeJS.Timeout

      const resetTimeout = () => {
        clearTimeout(timeout)
        setShowControls(true)

        if (isPlaying) {
          timeout = setTimeout(() => {
            setShowControls(false)
          }, 3000)
        }
      }

      resetTimeout()

      return () => clearTimeout(timeout)
    }, [isPlaying])

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    const togglePlay = () => {
      const video = resolvedRef.current
      if (!video) return

      if (isPlaying) {
        video.pause()
      } else {
        video.play().catch((err) => {
          setError(`Failed to play video: ${err.message}`)
        })
      }
    }

    const toggleMute = () => {
      const video = resolvedRef.current
      if (!video) return

      video.muted = !video.muted
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const video = resolvedRef.current
      if (!video) return

      const newVolume = Number.parseFloat(e.target.value)
      video.volume = newVolume
      video.muted = newVolume === 0
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const video = resolvedRef.current
      if (!video) return

      const newTime = Number.parseFloat(e.target.value)
      video.currentTime = newTime
    }

    const toggleFullscreen = () => {
      if (!containerRef.current) return

      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }

    const handleRetry = () => {
      const video = resolvedRef.current
      if (!video) return

      setError(null)
      video.load()
      video.play().catch((err) => {
        setError(`Failed to play video: ${err.message}`)
      })
    }

    if (error) {
      return (
        <div className="iptv-video-container flex items-center justify-center bg-black">
          <div className="bg-card p-6 rounded-lg max-w-md">
            <div className="text-center space-y-4">
              <div className="text-destructive text-lg font-medium">Playback Error</div>
              <p className="text-sm text-muted-foreground">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleRetry}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                {onClose && (
                  <Button variant="outline" onClick={onClose}>
                    <X className="w-4 h-4 mr-2" />
                    Close
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={containerRef}
        className={cn("iptv-video-container", className)}
        onMouseMove={() => setShowControls(true)}
      >
        <video
          ref={resolvedRef}
          src={src}
          className="w-full h-full object-contain"
          autoPlay={autoPlay}
          controls={false}
        />

        {/* Video Controls */}
        <div className={cn("iptv-video-controls", showControls ? "opacity-100" : "opacity-0 pointer-events-none")}>
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
            {title && <h2 className="text-white text-lg font-medium truncate">{title}</h2>}
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-black/30 hover:bg-black/50 text-white"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <span className="text-white text-xs">{formatTime(currentTime)}</span>
              <div className="relative flex-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Progress value={(currentTime / (duration || 1)) * 100} className="h-1" />
              </div>
              <span className="text-white text-xs">{formatTime(duration)}</span>
            </div>

            {/* Control buttons */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 accent-white"
                  />
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

VideoView.displayName = "VideoView"
