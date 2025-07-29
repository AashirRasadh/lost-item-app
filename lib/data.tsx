"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "./supabase"
import { useAuth } from "./auth"

export interface Item {
  id: string
  title: string
  description: string
  last_seen_location: string
  date_lost: string
  image_url?: string
  author_id: string
  author_email: string
  created_at: string
  updated_at: string
  item_type: "lost" | "found"
  category?: string
  status: "active" | "resolved" | "closed"
}

export type LostItem = Item

export interface Comment {
  id: string
  post_id: string
  author_id: string
  author_email: string
  content: string
  created_at: string
}

export interface FilterOptions {
  itemType: "all" | "lost" | "found"
  category: string
  status: "all" | "active" | "resolved" | "closed"
  location: string
  dateRange: "all" | "week" | "month" | "year"
}

interface DataContextType {
  items: Item[]
  loading: boolean
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  filteredItems: Item[]
  addItem: (item: Omit<Item, "id" | "created_at" | "updated_at" | "author_id" | "author_email">) => Promise<void>
  updateItem: (id: string, item: Partial<Item>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  addComment: (comment: Omit<Comment, "id" | "created_at" | "author_id" | "author_email">) => Promise<void>
  getItemComments: (itemId: string) => Promise<Comment[]>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Documents",
  "Keys",
  "Bags",
  "Jewelry",
  "Books",
  "Sports Equipment",
  "Other",
]

export { CATEGORIES }

export function DataProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    itemType: "all",
    category: "",
    status: "all",
    location: "",
    dateRange: "all",
  })
  const { user } = useAuth()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter((item) => {
    // Filter by item type
    if (filters.itemType !== "all" && item.item_type !== filters.itemType) {
      return false
    }

    // Filter by category
    if (filters.category && item.category !== filters.category) {
      return false
    }

    // Filter by status
    if (filters.status !== "all" && item.status !== filters.status) {
      return false
    }

    // Filter by location (case insensitive partial match)
    if (filters.location && !item.last_seen_location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const itemDate = new Date(item.date_lost)
      const now = new Date()
      const diffTime = now.getTime() - itemDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (filters.dateRange) {
        case "week":
          if (diffDays > 7) return false
          break
        case "month":
          if (diffDays > 30) return false
          break
        case "year":
          if (diffDays > 365) return false
          break
      }
    }

    return true
  })

  const addItem = async (item: Omit<Item, "id" | "created_at" | "updated_at" | "author_id" | "author_email">) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("items")
        .insert({
          ...item,
          author_id: user.id,
          author_email: user.email!,
        })
        .select()
        .single()

      if (error) throw error
      setItems((prev) => [data, ...prev])
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const updateItem = async (id: string, updatedItem: Partial<Item>) => {
    try {
      const { data, error } = await supabase
        .from("items")
        .update({ ...updatedItem, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      setItems((prev) => prev.map((item) => (item.id === id ? data : item)))
    } catch (error) {
      console.error("Error updating item:", error)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase.from("items").delete().eq("id", id)

      if (error) throw error
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  const addComment = async (comment: Omit<Comment, "id" | "created_at" | "author_id" | "author_email">) => {
    if (!user) return

    try {
      const { error } = await supabase.from("comments").insert({
        ...comment,
        author_id: user.id,
        author_email: user.email!,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const getItemComments = async (itemId: string): Promise<Comment[]> => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", itemId)
        .order("created_at", { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching comments:", error)
      return []
    }
  }

  return (
    <DataContext.Provider
      value={{
        items,
        loading,
        filters,
        setFilters,
        filteredItems,
        addItem,
        updateItem,
        deleteItem,
        addComment,
        getItemComments,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
