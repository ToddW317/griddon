import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import { StoreHydration } from './components/providers/StoreHydration'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Griddon",
  description: "An American Football Idle Game",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-primary/95 text-accent/90`}>
        <StoreHydration />
        <Navbar />
        {children}
      </body>
    </html>
  )
} 