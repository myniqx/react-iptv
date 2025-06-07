"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SubtitleSettings as SubtitleSettingsType, SubtitleTrack } from "../types/video"
import { supportedLanguages, translateText } from "../utils/translation"

interface SubtitleSettingsProps {
  isOpen: boolean
  onClose: () => void
  settings: SubtitleSettingsType
  onSettingsChange: (settings: SubtitleSettingsType) => void
  subtitleTracks: SubtitleTrack[]
  selectedTrack: string
  onTrackChange: (trackId: string) => void
  currentSubtitle: string
}

export function SubtitleSettingsComponent({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  subtitleTracks,
  selectedTrack,
  onTrackChange,
  currentSubtitle,
}: SubtitleSettingsProps) {
  const [translationService, setTranslationService] = useState<"google" | "deepl">("google")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async (targetLanguage: string) => {
    if (!currentSubtitle) return

    setIsTranslating(true)
    try {
      const translated = await translateText(currentSubtitle, targetLanguage, translationService)
      setTranslatedText(translated)
    } catch (error) {
      console.error("Translation failed:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const colorOptions = [
    { value: "#ffffff", label: "White" },
    { value: "#000000", label: "Black" },
    { value: "#ffff00", label: "Yellow" },
    { value: "#ff0000", label: "Red" },
    { value: "#00ff00", label: "Green" },
    { value: "#0000ff", label: "Blue" },
  ]

  const fontFamilyOptions = [
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
    { value: "Courier New, monospace", label: "Courier New" },
    { value: "Verdana, sans-serif", label: "Verdana" },
  ]

  const positionOptions = [
    { value: "bottom", label: "Bottom" },
    { value: "top", label: "Top" },
    { value: "center", label: "Center" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Subtitle Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="tracks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="translation">Translation</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-4">
            <div className="space-y-2">
              <Label>Subtitle Track</Label>
              <Select value={selectedTrack} onValueChange={onTrackChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subtitle track" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {subtitleTracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.label} ({track.language})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.enabled}
                onCheckedChange={(enabled) => onSettingsChange({ ...settings, enabled })}
              />
              <Label>Enable Subtitles</Label>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label>Font Size: {settings.fontSize}px</Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([fontSize]) => onSettingsChange({ ...settings, fontSize })}
                min={12}
                max={32}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Font Color</Label>
              <Select
                value={settings.fontColor}
                onValueChange={(fontColor) => onSettingsChange({ ...settings, fontColor })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: color.value }} />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <Select
                value={settings.backgroundColor}
                onValueChange={(backgroundColor) => onSettingsChange({ ...settings, backgroundColor })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: color.value }} />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Background Opacity: {Math.round(settings.backgroundOpacity * 100)}%</Label>
              <Slider
                value={[settings.backgroundOpacity]}
                onValueChange={([backgroundOpacity]) => onSettingsChange({ ...settings, backgroundOpacity })}
                min={0}
                max={1}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(fontFamily) => onSettingsChange({ ...settings, fontFamily })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilyOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Position</Label>
              <Select
                value={settings.position}
                onValueChange={(position: "bottom" | "top" | "center") => onSettingsChange({ ...settings, position })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {positionOptions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.textShadow}
                onCheckedChange={(textShadow) => onSettingsChange({ ...settings, textShadow })}
              />
              <Label>Text Shadow</Label>
            </div>
          </TabsContent>

          <TabsContent value="translation" className="space-y-4">
            <div className="space-y-2">
              <Label>Translation Service</Label>
              <Select
                value={translationService}
                onValueChange={(value: "google" | "deepl") => setTranslationService(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Translate</SelectItem>
                  <SelectItem value="deepl">DeepL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Translate to:</Label>
              <div className="grid grid-cols-2 gap-2">
                {supportedLanguages[translationService].map((lang) => (
                  <Button
                    key={lang.code}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslate(lang.code)}
                    disabled={isTranslating || !currentSubtitle}
                  >
                    {lang.name}
                  </Button>
                ))}
              </div>
            </div>

            {translatedText && (
              <div className="space-y-2">
                <Label>Translated Text:</Label>
                <div className="p-3 bg-muted rounded-md">{translatedText}</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Subtitle File</Label>
              <input
                type="file"
                accept=".vtt,.srt"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // Handle file upload
                    console.log("Subtitle file selected:", file.name)
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
            </div>
            <p className="text-sm text-muted-foreground">Supported formats: .vtt, .srt</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
