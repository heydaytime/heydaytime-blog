import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'heydaytime blog',
  description: 'A minimal blog',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
