import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { IptvProvider } from "@/lib/contexts/iptv-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IPTV Manager",
  description: "Manage your IPTV profiles and content",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <IptvProvider>{children}</IptvProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
