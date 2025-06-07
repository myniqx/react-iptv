export interface SubtitleCue {
  start: number
  end: number
  text: string
}

export function parseVTT(vttContent: string): SubtitleCue[] {
  const lines = vttContent.split("\n")
  const cues: SubtitleCue[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    // Skip WEBVTT header and empty lines
    if (line === "WEBVTT" || line === "" || line.startsWith("NOTE")) {
      i++
      continue
    }

    // Check if this line contains timing
    if (line.includes("-->")) {
      const [startTime, endTime] = line.split("-->").map((t) => t.trim())
      const start = parseTimeToSeconds(startTime)
      const end = parseTimeToSeconds(endTime)

      i++
      let text = ""

      // Collect subtitle text until empty line or end
      while (i < lines.length && lines[i].trim() !== "") {
        text += (text ? "\n" : "") + lines[i].trim()
        i++
      }

      if (text) {
        cues.push({ start, end, text })
      }
    } else {
      i++
    }
  }

  return cues
}

export function parseSRT(srtContent: string): SubtitleCue[] {
  const blocks = srtContent.split(/\n\s*\n/)
  const cues: SubtitleCue[] = []

  for (const block of blocks) {
    const lines = block.trim().split("\n")
    if (lines.length < 3) continue

    const timeLine = lines[1]
    if (!timeLine.includes("-->")) continue

    const [startTime, endTime] = timeLine.split("-->").map((t) => t.trim())
    const start = parseTimeToSeconds(startTime.replace(",", "."))
    const end = parseTimeToSeconds(endTime.replace(",", "."))
    const text = lines.slice(2).join("\n")

    cues.push({ start, end, text })
  }

  return cues
}

function parseTimeToSeconds(timeString: string): number {
  const parts = timeString.split(":")
  if (parts.length === 3) {
    const hours = Number.parseInt(parts[0])
    const minutes = Number.parseInt(parts[1])
    const seconds = Number.parseFloat(parts[2])
    return hours * 3600 + minutes * 60 + seconds
  }
  return 0
}

export function getCurrentSubtitle(cues: SubtitleCue[], currentTime: number): string {
  const currentCue = cues.find((cue) => currentTime >= cue.start && currentTime <= cue.end)
  return currentCue ? currentCue.text : ""
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}
