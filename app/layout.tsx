import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"
import { DataProvider } from "@/lib/data"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lost & Found App",
  description: "A simple app to post and find lost items",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">{children}</main>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
