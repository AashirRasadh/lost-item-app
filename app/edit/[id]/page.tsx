"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/lib/auth"
import { useData, CATEGORIES, type Item } from "@/lib/data"
import { MapPin, Calendar, ImageIcon, FileText, ArrowLeft, Tag } from "lucide-react"

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { items, updateItem } = useData()
  const [item, setItem] = useState<Item | null>(null)
  const [itemType, setItemType] = useState<"lost" | "found">("lost")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [lastSeenLocation, setLastSeenLocation] = useState("")
  const [dateLost, setDateLost] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [category, setCategory] = useState("Other") // Updated default value to "Other"
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const foundItem = items.find((i) => i.id === params.id)
    if (foundItem) {
      setItem(foundItem)
      setItemType(foundItem.item_type)
      setTitle(foundItem.title)
      setDescription(foundItem.description)
      setLastSeenLocation(foundItem.last_seen_location)
      setDateLost(foundItem.date_lost)
      setImageUrl(foundItem.image_url || "")
      setCategory(foundItem.category || "Other") // Updated default value to "Other"
    }
  }, [items, params.id])

  useEffect(() => {
    if (!user || (item && user.id !== item.author_id)) {
      router.push("/")
    }
  }, [user, item, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return

    setLoading(true)

    await updateItem(item.id, {
      item_type: itemType,
      title,
      description,
      last_seen_location: lastSeenLocation,
      date_lost: dateLost,
      image_url: imageUrl || undefined,
      category: category || undefined,
    })

    router.push(`/item/${item.id}`)
  }

  if (!item || !user || user.id !== item.author_id) {
    return null
  }

  const getLocationLabel = () => {
    return itemType === "lost" ? "Last Seen Location" : "Found Location"
  }

  const getDateLabel = () => {
    return itemType === "lost" ? "Date Lost" : "Date Found"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Your Item
          </h1>
          <p className="text-gray-600 mt-2">Update the details of your item</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Item Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Item Type</Label>
                <RadioGroup value={itemType} onValueChange={(value: "lost" | "found") => setItemType(value)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                    <RadioGroupItem value="lost" id="lost" />
                    <Label htmlFor="lost" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">🔍</span>
                        <div>
                          <div className="font-medium">Lost Item</div>
                          <div className="text-sm text-gray-500">I lost something and I'm looking for it</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-green-50 transition-colors">
                    <RadioGroupItem value="found" id="found" />
                    <Label htmlFor="found" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">✅</span>
                        <div>
                          <div className="font-medium">Found Item</div>
                          <div className="text-sm text-gray-500">I found something and want to return it</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Item Title *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center">
                  <Tag className="h-4 w-4 mr-1 text-blue-500" />
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Other">No category</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                    {getLocationLabel()} *
                  </Label>
                  <Input
                    id="location"
                    value={lastSeenLocation}
                    onChange={(e) => setLastSeenLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateLost" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                    {getDateLabel()} *
                  </Label>
                  <Input
                    id="dateLost"
                    type="date"
                    value={dateLost}
                    onChange={(e) => setDateLost(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-1 text-green-500" />
                  Image URL (optional)
                </Label>
                <Input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Item"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push(`/item/${item.id}`)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
