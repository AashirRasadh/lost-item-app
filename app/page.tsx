"use client"

import Image from "next/image"

import { ItemCard } from "@/components/item-card"
import { FilterBar } from "@/components/filter-bar"
import { useData } from "@/lib/data"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Plus, Search } from "lucide-react"

function ItemSkeleton() {
  return (
    <div className="w-full p-6 bg-white/50 backdrop-blur-sm rounded-lg border shadow-md">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div className="flex space-x-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { filteredItems, loading } = useData()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-1 group-hover:scale-105 transition-transform">
              {/* <Search className="h-8 w-8 text-white" /> */}
              <Image
                  src="/logo.svg"           // 👈 Refers to /public/logo.svg
                  alt="FindIt Logo"
                  width={48}
                  height={48}
                  className="rounded"
                />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-4">
          F!ndit
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Post lost items you're looking for or found items you want to return. Help reunite the community with their
            belongings.
          </p>
          {user && (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Link href="/create">
                <Plus className="h-5 w-5 mr-2" />
                Post an Item
              </Link>
            </Button>
          )}
        </div>

        <div className="mb-8">
          <FilterBar />
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <ItemSkeleton key={i} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or be the first to post an item.</p>
            {user && (
              <Button
                asChild
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Link href="/create">Post an item</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
