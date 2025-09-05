// app/layout.js or layout.tsx
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import { Suspense } from 'react'
import DisableContextMenu from '../components/disableContextMenu'

export const metadata = {
  title: 'MediaVault',
  description: 'Dark, warm, modern gallery with gated downloads',
  generator: 'v0.app',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark antialiased">
        <body className="bg-neutral-900 text-foreground font-sans">
          <DisableContextMenu />
          <Suspense fallback={null}>
            {children}
          </Suspense>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
