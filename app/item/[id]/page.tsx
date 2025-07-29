"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { useData, type Item, type Comment } from "@/lib/data"
import { Calendar, MapPin, Edit, Trash2, Send, ArrowLeft, MessageCircle, Clock, Tag, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ItemPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { items, deleteItem, addComment, getItemComments, updateItem } = useData()
  const [item, setItem] = useState<Item | null>(null)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    const foundItem = items.find((i) => i.id === params.id)
    setItem(foundItem || null)
  }, [items, params.id])

  useEffect(() => {
    if (item) {
      loadComments()
    }
  }, [item])

  const loadComments = async () => {
    if (!item) return
    setLoadingComments(true)
    const itemComments = await getItemComments(item.id)
    setComments(itemComments)
    setLoadingComments(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteItem(params.id as string)
      router.push("/")
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!item) return
    await updateItem(item.id, { status: newStatus as "active" | "resolved" | "closed" })
    setItem({ ...item, status: newStatus as "active" | "resolved" | "closed" })
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !item || !comment.trim()) return

    setSubmittingComment(true)
    await addComment({
      post_id: item.id,
      content: comment.trim(),
    })

    setComment("")
    await loadComments()
    setSubmittingComment(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const isAuthor = user?.id === item.author_id

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Items
        </Button>

        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getItemTypeColor(item.item_type)}>
                    {item.item_type === "lost" ? "🔍 Lost" : "✅ Found"}
                  </Badge>
                  {item.category && (
                    <Badge variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {item.category}
                    </Badge>
                  )}
                  <Badge className={getStatusColor(item.status)}>
                    {item.status === "resolved" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-4 text-gray-900">{item.title}</CardTitle>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="font-medium">{item.item_type === "lost" ? "Last seen:" : "Found at:"}</span>
                    <span className="ml-1">{item.last_seen_location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                    <span className="font-medium">{item.item_type === "lost" ? "Date lost:" : "Date found:"}</span>
                    <span className="ml-1">{formatDate(item.date_lost)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                {isAuthor && (
                  <>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/edit/${item.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    <Select value={item.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{item.description}</p>
            {item.image_url && (
              <div className="mb-6">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full max-w-md h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                Posted by {item.author_email}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {getTimeAgo(item.created_at)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user && item.status === "active" && (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="space-y-4">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      item.item_type === "lost"
                        ? "Have you seen this item? Share any information that might help..."
                        : "Is this your item? Provide details to verify ownership..."
                    }
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={!comment.trim() || submittingComment}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {!user && (
              <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
                <p className="text-gray-600 mb-4">
                  <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign in
                  </Link>{" "}
                  to post a comment and help reunite this item with its owner
                </p>
              </div>
            )}

            {item.status !== "active" && (
              <div className="text-center py-4 bg-yellow-50 rounded-lg mb-8">
                <p className="text-yellow-700">This item is marked as {item.status}. Comments are disabled.</p>
              </div>
            )}

            <div className="space-y-4">
              {loadingComments ? (
                [...Array(2)].map((_, i) => (
                  <div key={i} className="border-l-4 border-gray-200 pl-4 py-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No comments yet. Be the first to help!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-3 bg-blue-50/30 rounded-r-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-white">
                        {comment.author_email}
                      </Badge>
                      <span className="text-sm text-gray-500">{getTimeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
