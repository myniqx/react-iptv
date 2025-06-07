"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useVideoPlayer } from "./hooks/useVideoPlayer"
import { VideoControls } from "./components/VideoControls"
import { SubtitleSettings } from "./components/SubtitleSettings"
import { AudioTrackSelector } from "./components/AudioTrackSelector"
import { parseVTT, parseSRT, getCurrentSubtitle, type SubtitleCue } from "./utils/subtitle"
import type { VideoPlayerProps } from "./types/video"
import { cn } from "@/lib/utils"

export function VideoPlayer({
  src,
  title,
  poster,
  subtitles = [],
  audioTracks = [],
  onTimeUpdate,
  onEnded,
  className,
}: VideoPlayerProps) {
  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    showControls,
    isLoading,
    selectedAudioTrack,
    selectedSubtitleTrack,
    videoSettings,
    togglePlay,
    seek,
    skipForward,
    skipBackward,
    changeVolume,
    toggleMute,
    toggleFullscreen,
    setSelectedAudioTrack,
    setSelectedSubtitleTrack,
    setVideoSettings,
    setShowControls,
    setCurrentTime,
    setDuration,
    setIsLoading,
  } = useVideoPlayer(src)

  const [showSubtitleSettings, setShowSubtitleSettings] = useState(false)
  const [showAudioTrackSelector, setShowAudioTrackSelector] = useState(false)
  const [showVideoSettings, setShowVideoSettings] = useState(false)
  const [subtitleCues, setSubtitleCues] = useState<SubtitleCue[]>([])
  const [currentSubtitle, setCurrentSubtitle] = useState("")
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Load subtitle file
  useEffect(() => {
    if (selectedSubtitleTrack) {
      const track = subtitles.find((t) => t.id === selectedSubtitleTrack)
      if (track) {
        fetch(track.src)
          .then((response) => response.text())
          .then((content) => {
            const cues = track.src.endsWith(".vtt") ? parseVTT(content) : parseSRT(content)
            setSubtitleCues(cues)
          })
          .catch((error) => console.error("Failed to load subtitle:", error))
      }
    } else {
      setSubtitleCues([])
    }
  }, [selectedSubtitleTrack, subtitles])

  // Update current subtitle
  useEffect(() => {
    if (subtitleCues.length > 0 && videoSettings.subtitleSettings.enabled) {
      const subtitle = getCurrentSubtitle(subtitleCues, currentTime)
      setCurrentSubtitle(subtitle)
    } else {
      setCurrentSubtitle("")
    }
  }, [currentTime, subtitleCues, videoSettings.subtitleSettings.enabled])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      onTimeUpdate?.(video.currentTime, video.duration)
    }

    const handleEnded = () => {
      onEnded?.()
    }

    const handleLoadStart = () => {
      setIsLoading(true)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("loadstart", handleLoadStart)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("loadstart", handleLoadStart)
    }
  }, [videoRef, onTimeUpdate, onEnded, setCurrentTime, setDuration, setIsLoading])

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, isPlaying, setShowControls])

  const handleMouseMove = () => {
    setShowControls(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case " ":
        e.preventDefault()
        togglePlay()
        break
      case "ArrowLeft":
        e.preventDefault()
        skipBackward()
        break
      case "ArrowRight":
        e.preventDefault()
        skipForward()
        break
      case "ArrowUp":
        e.preventDefault()
        changeVolume(Math.min(volume + 0.1, 1))
        break
      case "ArrowDown":
        e.preventDefault()
        changeVolume(Math.max(volume - 0.1, 0))
        break
      case "f":
        e.preventDefault()
        toggleFullscreen()
        break
      case "m":
        e.preventDefault()
        toggleMute()
        break
    }
  }

  return (
    <div
      className={cn("video-player-container", className)}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="video-player-wrapper">
        <video ref={videoRef} src={src} poster={poster} className="video-player-video" onClick={togglePlay} />

        {isLoading && (
          <div className="video-player-loading">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {currentSubtitle && videoSettings.subtitleSettings.enabled && (
          <div
            className="video-player-subtitle"
            style={{
              fontSize: `${videoSettings.subtitleSettings.fontSize}px`,
              color: videoSettings.subtitleSettings.fontColor,
              backgroundColor: `${videoSettings.subtitleSettings.backgroundColor}${Math.round(
                videoSettings.subtitleSettings.backgroundOpacity * 255,
              )
                .toString(16)
                .padStart(2, "0")}`,
              fontFamily: videoSettings.subtitleSettings.fontFamily,
              textShadow: videoSettings.subtitleSettings.textShadow ? "2px 2px 4px rgba(0,0,0,0.8)" : "none",
              bottom: videoSettings.subtitleSettings.position === "bottom" ? "80px" : "auto",
              top: videoSettings.subtitleSettings.position === "top" ? "20px" : "auto",
              transform: videoSettings.subtitleSettings.position === "center" ? "translateY(-50%)" : "none",
            }}
          >
            {currentSubtitle}
          </div>
        )}

        {showControls && (
          <VideoControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            onTogglePlay={togglePlay}
            onSeek={seek}
            onVolumeChange={changeVolume}
            onToggleMute={toggleMute}
            onSkipForward={skipForward}
            onSkipBackward={skipBackward}
            onToggleFullscreen={toggleFullscreen}
            onOpenSettings={() => setShowVideoSettings(true)}
            onOpenSubtitles={() => setShowSubtitleSettings(true)}
            onOpenAudioTracks={() => setShowAudioTrackSelector(true)}
          />
        )}
      </div>

      <SubtitleSettings
        isOpen={showSubtitleSettings}
        onClose={() => setShowSubtitleSettings(false)}
        settings={videoSettings.subtitleSettings}
        onSettingsChange={(subtitleSettings) => setVideoSettings({ ...videoSettings, subtitleSettings })}
        subtitleTracks={subtitles}
        selectedTrack={selectedSubtitleTrack}
        onTrackChange={setSelectedSubtitleTrack}
        currentSubtitle={currentSubtitle}
      />

      <AudioTrackSelector
        isOpen={showAudioTrackSelector}
        onClose={() => setShowAudioTrackSelector(false)}
        audioTracks={audioTracks}
        selectedTrack={selectedAudioTrack}
        onTrackChange={setSelectedAudioTrack}
      />
    </div>
  )
}
