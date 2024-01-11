import type { Metadata } from 'next'
import './globals.scss'
import Head from 'next/head'

export const metadata: Metadata = {
  title: 'XC Running Route Builder',
  description: 'Plan your next cross country running route.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    </Head>
    <body className="h-full">
      {children}
    </body>
    </html>
  )
}
