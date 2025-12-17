import type React from "react"
import type { Metadata } from "next"
import { Geist as V0_Font_Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Geist_Mono as V0_Font_Geist_Mono } from "next/font/google"

const geistSans = V0_Font_Geist({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = V0_Font_Geist_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Daily Journal & Reflection",
  description: "Your personal daily journal for productivity, gratitude, and self-reflection",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
