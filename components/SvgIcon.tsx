"use client"

import { cn } from "@/lib/utils"

interface SvgIconProps {
  icon: string
  className?: string
}

export function SvgIcon({ icon, className }: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="256"
      height="256"
      viewBox="0 0 24 24"
      className={cn("w-6 h-6", className)}
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  )
}
