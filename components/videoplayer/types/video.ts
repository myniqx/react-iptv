export interface VideoPlayerProps {
  src: string
  title?: string
  poster?: string
  subtitles?: SubtitleTrack[]
  audioTracks?: AudioTrack[]
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onEnded?: () => void
  className?: string
}

export interface SubtitleTrack {
  id: string
  label: string
  language: string
  src: string
  default?: boolean
}

export interface AudioTrack {
  id: string
  label: string
  language: string
  default?: boolean
}

export interface SubtitleSettings {
  fontSize: number
  fontColor: string
  backgroundColor: string
  backgroundOpacity: number
  fontFamily: string
  textShadow: boolean
  position: "bottom" | "top" | "center"
  enabled: boolean
}

export interface VideoSettings {
  volume: number
  playbackRate: number
  autoplay: boolean
  subtitleSettings: SubtitleSettings
  preferredAudioLanguage: string
  preferredSubtitleLanguage: string
}

export interface VideoProgress {
  [url: string]: {
    currentTime: number
    duration: number
    timestamp: number
  }
}

export interface TranslationService {
  name: "google" | "deepl"
  apiKey?: string
}
