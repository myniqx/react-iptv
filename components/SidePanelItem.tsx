"use client"

import type { ReactNode } from "react"

interface SidePanelItemProps {
  text: string
  icon?: ReactNode
  onClick: () => void
  active?: boolean
}

export function SidePanelItem({ text, icon, onClick, active = false }: SidePanelItemProps) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full ${
          active ? "bg-gray-100 dark:bg-gray-700" : ""
        }`}
      >
        {icon && <span className="mr-3">{icon}</span>}
        <span className="truncate">{text}</span>
      </button>
    </li>
  )
}
