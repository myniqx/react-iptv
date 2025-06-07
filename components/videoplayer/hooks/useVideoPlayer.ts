"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useLocalStorage } from "./useLocalStorage"
import type { VideoSettings, VideoProgress, SubtitleSettings } from "../types/video"

const defaultSubtitleSettings: SubtitleSettings = {
  fontSize: 16,
  fontColor: "#ffffff",
  backgroundColor: "#000000",
  backgroundOpacity: 0.8,
  fontFamily: "Arial, sans-serif",
  textShadow: true,
  position: "bottom",
  enabled: true,
}

const defaultVideoSettings: VideoSettings = {
  volume: 1,
  playbackRate: 1,
  autoplay: false,
  subtitleSettings: defaultSubtitleSettings,
  preferredAudioLanguage: "en",
  preferredSubtitleLanguage: "en",
}

export function useVideoPlayer(src: string) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<string>("")
  const [selectedSubtitleTrack, setSelectedSubtitleTrack] = useState<string>("")

  const [videoSettings, setVideoSettings] = useLocalStorage<VideoSettings>("videoPlayerSettings", defaultVideoSettings)
  const [videoProgress, setVideoProgress] = useLocalStorage<VideoProgress>("videoProgress", {})

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && src && currentTime > 0) {
        setVideoProgress((prev) => ({
          ...prev,
          [src]: {
            currentTime,
            duration,
            timestamp: Date.now(),
          },
        }))
      }
    }, 5000) // Save every 5 seconds

    return () => clearInterval(interval)
  }, [src, currentTime, duration, setVideoProgress])

  // Load saved progress
  useEffect(() => {
    if (src && videoProgress[src] && videoRef.current) {
      const savedProgress = videoProgress[src]
      const timeDiff = Date.now() - savedProgress.timestamp
      // Only restore if saved within last 24 hours and not near the end
      if (timeDiff < 24 * 60 * 60 * 1000 && savedProgress.currentTime < savedProgress.duration * 0.9) {
        videoRef.current.currentTime = savedProgress.currentTime
      }
    }
  }, [src, videoProgress])

  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }, [])

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const skipForward = useCallback(() => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + 10, duration)
      seek(newTime)
    }
  }, [duration, seek])

  const skipBackward = useCallback(() => {
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 10, 0)
      seek(newTime)
    }
  }, [seek])

  const changeVolume = useCallback(
    (newVolume: number) => {
      if (videoRef.current) {
        const clampedVolume = Math.max(0, Math.min(1, newVolume))
        videoRef.current.volume = clampedVolume
        setVolume(clampedVolume)
        setVideoSettings((prev) => ({ ...prev, volume: clampedVolume }))
        if (clampedVolume > 0) {
          setIsMuted(false)
        }
      }
    },
    [setVideoSettings],
  )

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }, [isMuted, volume])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const changePlaybackRate = useCallback(
    (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate
        setVideoSettings((prev) => ({ ...prev, playbackRate: rate }))
      }
    },
    [setVideoSettings],
  )

  return {
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
    play,
    pause,
    togglePlay,
    seek,
    skipForward,
    skipBackward,
    changeVolume,
    toggleMute,
    toggleFullscreen,
    changePlaybackRate,
    setSelectedAudioTrack,
    setSelectedSubtitleTrack,
    setVideoSettings,
    setShowControls,
    setCurrentTime,
    setDuration,
    setIsLoading,
  }
}
