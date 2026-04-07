import './globals.css'

export const metadata = {
  title: 'heydaytime blog',
  description: 'A minimal blog',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
