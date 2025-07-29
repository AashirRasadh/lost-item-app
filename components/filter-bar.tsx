"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useData, CATEGORIES, type FilterOptions } from "@/lib/data"
import { Search, Filter, X } from "lucide-react"
import { useState } from "react"

export function FilterBar() {
  const { filters, setFilters } = useData()
  const [showFilters, setShowFilters] = useState(false)

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    setFilters({
      itemType: "all",
      category: "all", // Updated default value to 'all'
      status: "all",
      location: "",
      dateRange: "all",
    })
  }

  const hasActiveFilters =
    filters.itemType !== "all" ||
    filters.category !== "all" || // Updated condition to check for 'all'
    filters.status !== "all" ||
    filters.location !== "" ||
    filters.dateRange !== "all"

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by location..."
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="bg-white/80 backdrop-blur-sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-1">
              {
                [
                  filters.itemType !== "all",
                  filters.category !== "all",
                  filters.status !== "all",
                  filters.dateRange !== "all",
                ].filter(Boolean).length
              }
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Item Type</label>
                <Select value={filters.itemType} onValueChange={(value) => updateFilter("itemType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="lost">🔍 Lost Items</SelectItem>
                    <SelectItem value="found">✅ Found Items</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem> {/* Updated value to 'all' */}
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date Range</label>
                <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
