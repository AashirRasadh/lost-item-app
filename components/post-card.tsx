"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LostItem } from "@/lib/data"
import { Calendar, MapPin, MessageCircle, Edit, Trash2, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useData } from "@/lib/data"

interface PostCardProps {
  post: LostItem
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const { deletePost } = useData()
  const isAuthor = user?.id === post.author_id

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(post.id)
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

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{post.title}</CardTitle>
          {isAuthor && (
            <div className="flex space-x-1 ml-2">
              <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                <Link href={`/edit/${post.id}`}>
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
            <span className="truncate max-w-[150px]">{post.last_seen_location}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-purple-500" />
            {formatDate(post.date_lost)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 mb-4 line-clamp-3">{post.description}</p>
        {post.image_url && (
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={post.image_url || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-0">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            {post.author_email}
          </Badge>
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {getTimeAgo(post.created_at)}
          </div>
        </div>
        <Button variant="outline" size="sm" asChild className="hover:bg-blue-50 hover:border-blue-300 bg-transparent">
          <Link href={`/post/${post.id}`}>
            <MessageCircle className="h-4 w-4 mr-2" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
