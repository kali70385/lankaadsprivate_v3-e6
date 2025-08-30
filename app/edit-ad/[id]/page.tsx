"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { categories } from "@/lib/categories"
import { locations } from "@/lib/locations"

// Constants for ad limitations
const AD_EDIT_LOCK_PERIOD = 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
const AD_EXPIRATION_PERIOD = 60 * 24 * 60 * 60 * 1000 // 60 days (2 months) in milliseconds

export default function EditAd({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [ad, setAd] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [isWhatsApp, setIsWhatsApp] = useState(false)
  const [isViber, setIsViber] = useState(false)
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")
  const [isEditLocked, setIsEditLocked] = useState(false)
  const [editLockedUntil, setEditLockedUntil] = useState<Date | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/")
      toast({
        title: "Access Denied",
        description: "Please login to edit an ad",
        variant: "destructive",
      })
    } else {
      // Load the ad data
      const ads = JSON.parse(localStorage.getItem("ads") || "[]")
      const currentAd = ads.find((a: any) => a.id === params.id)

      if (currentAd) {
        // Check if ad is locked for editing
        const now = new Date()
        let isLocked = false
        let lockedUntil = null

        if (currentAd.editLockedUntil) {
          lockedUntil = new Date(currentAd.editLockedUntil)
          isLocked = now < lockedUntil
        } else {
          // If no explicit lock time, check if it's within 14 days of creation
          const createdAt = new Date(currentAd.createdAt)
          lockedUntil = new Date(createdAt.getTime() + AD_EDIT_LOCK_PERIOD)
          isLocked = now.getTime() - createdAt.getTime() < AD_EDIT_LOCK_PERIOD
        }

        if (isLocked) {
          toast({
            title: "Edit Locked",
            description: `This ad cannot be edited until ${lockedUntil?.toLocaleDateString()}`,
            variant: "destructive",
          })
          router.push("/profile")
          return
        }

        setAd(currentAd)
        setTitle(currentAd.title)
        setDescription(currentAd.description)
        setPrice(currentAd.price.toString())
        setCategory(currentAd.category)
        setContactNumber(currentAd.contactNumber)
        setIsWhatsApp(currentAd.isWhatsApp)
        setIsViber(currentAd.isViber)
        setImages(currentAd.images || [])
        setDistrict(currentAd.district || "")
        setCity(currentAd.city || "")
        setIsEditLocked(isLocked)
        setEditLockedUntil(lockedUntil)
      } else {
        toast({
          title: "Error",
          description: "Ad not found",
          variant: "destructive",
        })
        router.push("/profile")
      }
    }
  }, [user, router, toast, params.id])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages([reader.result as string])
      }
      reader.readAsDataURL(file)
    }
  }

  const validatePhoneNumber = (number: string) => {
    const regex = /^(\+94|0)([0-9]{9})$/
    return regex.test(number)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to edit an ad",
        variant: "destructive",
      })
      return
    }

    if (isEditLocked) {
      toast({
        title: "Edit Locked",
        description: `This ad cannot be edited until ${editLockedUntil?.toLocaleDateString()}`,
        variant: "destructive",
      })
      return
    }

    if (!validatePhoneNumber(contactNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Update the ad object
      const updatedAd = {
        ...ad,
        title,
        description,
        price: Number.parseFloat(price),
        category,
        contactNumber,
        isWhatsApp,
        isViber,
        images,
        district,
        city,
        // Keep original creation date and expiration
        // Don't reset the edit lock period
      }

      // Update the ads list
      const currentAds = JSON.parse(localStorage.getItem("ads") || "[]")
      const updatedAds = currentAds.map((a: any) => (a.id === updatedAd.id ? updatedAd : a))
      localStorage.setItem("ads", JSON.stringify(updatedAds))

      toast({
        title: "Success!",
        description: "Your ad has been updated.",
      })
      router.push("/profile")
    } catch (error) {
      console.error("Error updating ad:", error)
      toast({
        title: "Error",
        description: "There was an error updating your ad. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Get cities for the selected district
  const getCitiesForDistrict = () => {
    if (!district) return []
    const districtObj = locations.find((loc) => loc.district === district)
    return districtObj ? districtObj.cities : []
  }

  if (!ad || isEditLocked) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-primary">Edit Ad</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block mb-2 text-primary">
                Title
              </label>
              <Input
                id="title"
                required
                placeholder="Ad title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="description" className="block mb-2 text-primary">
                Description
              </label>
              <Textarea
                id="description"
                required
                placeholder="Describe your ad"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-primary/30 focus:border-primary min-h-[250px]"
                rows={10}
              />
            </div>

            <div>
              <label htmlFor="category" className="block mb-2 text-primary">
                Category
              </label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-md border-primary/30 focus:border-primary focus:ring focus:ring-rose-200 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="district" className="block mb-2 text-primary">
                District
              </label>
              <select
                id="district"
                required
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value)
                  setCity("")
                }}
                className="w-full p-2 border rounded-md border-primary/30 focus:border-primary focus:ring focus:ring-rose-200 text-sm"
              >
                <option value="">Select District</option>
                {locations.map((location) => (
                  <option key={location.district} value={location.district}>
                    {location.district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block mb-2 text-primary">
                City
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border rounded-md border-primary/30 focus:border-primary focus:ring focus:ring-rose-200 text-sm"
                disabled={!district}
              >
                <option value="">Select City (Optional)</option>
                {getCitiesForDistrict().map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block mb-2 text-primary">
                Price (Rs.)
              </label>
              <Input
                id="price"
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="block mb-2 text-primary">
                Contact Number
              </label>
              <Input
                id="contactNumber"
                required
                type="tel"
                placeholder="Your contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center">
                <Checkbox
                  id="isWhatsApp"
                  checked={isWhatsApp}
                  onCheckedChange={(checked) => setIsWhatsApp(!!checked)}
                />
                <label htmlFor="isWhatsApp" className="ml-2 text-primary">
                  WhatsApp
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox id="isViber" checked={isViber} onCheckedChange={(checked) => setIsViber(!!checked)} />
                <label htmlFor="isViber" className="ml-2 text-primary">
                  Viber
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-primary">Image</label>
              <div className="grid grid-cols-1 gap-4 mb-4">
                {images.length > 0 ? (
                  <div className="relative aspect-square group">
                    <Image
                      src={images[0] || "/placeholder.svg"}
                      alt="Upload"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImages([])}
                      className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-square relative">
                    <label className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/10 border-primary/30">
                      <Upload className="h-8 w-8 text-primary/80 mb-2" />
                      <p className="text-sm text-primary/80">Add Image</p>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                )}
              </div>
              <p className="text-sm text-primary/80">You can upload 1 image.</p>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Updating..." : "Update Ad"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
