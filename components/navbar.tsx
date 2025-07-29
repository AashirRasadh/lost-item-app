"use client"
import Image from "next/image"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { LogOut, Plus, Search } from "lucide-react"

export function Navbar() {
  const { user, signOut, loading } = useAuth()

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-1 group-hover:scale-105 transition-transform">
                {/* <Search className="h-5 w-5 text-white" /> */}
                <Image
                  src="/logo.svg"           // 👈 Refers to /public/logo.svg
                  alt="FindIt Logo"
                  width={36}
                  height={36}
                  className="rounded"
                />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-[#315838]">
              F!ndit
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user.email}</span>
                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      <Link href="/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Post Item
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
