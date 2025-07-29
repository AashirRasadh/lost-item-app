"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Item } from "@/lib/data"
import { Calendar, MapPin, MessageCircle, Edit, Trash2, Clock, Tag, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useData } from "@/lib/data"

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const { user } = useAuth()
  const { deleteItem } = useData()
  const isAuthor = user?.id === item.author_id

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteItem(item.id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  const getItemTypeColor = (type: string) => {
    return type === "lost" ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200"
      case "closed":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-blue-50 text-blue-700 border-blue-200"
    }
  }

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getItemTypeColor(item.item_type)}>
                {item.item_type === "lost" ? "🔍 Lost" : "✅ Found"}
              </Badge>
              {item.category && (
                <Badge variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {item.category}
                </Badge>
              )}
              {item.status === "resolved" && (
                <Badge className={getStatusColor(item.status)}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</CardTitle>
          </div>
          {isAuthor && (
            <div className="flex space-x-1 ml-2">
              <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                <Link href={`/edit/${item.id}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-blue-500" />
            <span className="truncate max-w-[150px]">{item.last_seen_location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-purple-500" />
            {formatDate(item.date_lost)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 mb-4 line-clamp-3">{item.description}</p>
        {item.image_url && (
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={item.image_url || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-0">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 truncate max-w-full">
            {item.author_email}
          </Badge>
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {getTimeAgo(item.created_at)}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="hover:bg-blue-50 hover:border-blue-300 bg-transparent flex-shrink-0"
        >
          <Link href={`/item/${item.id}`}>
            <MessageCircle className="h-4 w-4 mr-2" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
