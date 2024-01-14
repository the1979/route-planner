import type {Metadata, Viewport} from 'next'
import './globals.scss'
import React from "react";

export const metadata: Metadata = {
  title: 'XC Running Route Builder',
  description: 'Plan your next cross country running route.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  viewportFit: 'cover',
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
    <body className="h-full">
      {children}
    </body>
    </html>
  )
}
