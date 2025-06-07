"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ToggleViewProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}

export function ToggleView({ checked, onCheckedChange, label, description, disabled = false }: ToggleViewProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id={label} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
      {label && (
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor={label}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </Label>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
    </div>
  )
}
