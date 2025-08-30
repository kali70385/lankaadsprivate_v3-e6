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
import { Upload, X, AlertCircle } from "lucide-react"
import { categories } from "@/lib/categories"
import { locations } from "@/lib/locations"

// Constants for ad limitations
const MAX_ADS_PER_USER = 4
const AD_EDIT_LOCK_PERIOD = 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
const AD_EXPIRATION_PERIOD = 60 * 24 * 60 * 60 * 1000 // 60 days (2 months) in milliseconds

interface ValidationErrors {
  title?: string
  description?: string
  category?: string
  district?: string
  price?: string
  contactNumber?: string
  images?: string
}

export default function PostAd() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [contactNumber, setContactNumber] = useState("")
  const [isWhatsApp, setIsWhatsApp] = useState(false)
  const [isViber, setIsViber] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [userAdCount, setUserAdCount] = useState(0)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  // Form field states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")
  const [price, setPrice] = useState("")

  useEffect(() => {
    // Load ads from localStorage on component mount
    const savedAds = JSON.parse(localStorage.getItem("ads") || "[]")

    // Count user's active ads
    if (user) {
      const userAds = savedAds.filter((ad) => ad.user === user.username)
      setUserAdCount(userAds.length)
    }

    console.log("Loaded ads:", savedAds)
  }, [user])

  useEffect(() => {
    if (!user) {
      router.push("/")
      toast({
        title: "Access Denied",
        description: "Please login to post an ad",
        variant: "destructive",
      })
    } else if (userAdCount >= MAX_ADS_PER_USER) {
      toast({
        title: "Maximum Ads Reached",
        description: `You can only have ${MAX_ADS_PER_USER} active ads at a time.`,
        variant: "destructive",
      })
      router.push("/profile")
    }
  }, [user, router, toast, userAdCount])

  const validatePhoneNumber = (number: string) => {
    const regex = /^(\+94|0)([0-9]{9})$/
    return regex.test(number)
  }

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    let isValid = true

    // Title validation
    if (!title.trim()) {
      errors.title = "Title is required"
      isValid = false
    } else if (title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters long"
      isValid = false
    } else if (title.trim().length > 100) {
      errors.title = "Title must be less than 100 characters"
      isValid = false
    }

    // Description validation
    if (!description.trim()) {
      errors.description = "Description is required"
      isValid = false
    } else if (description.trim().length < 20) {
      errors.description = "Description must be at least 20 characters long"
      isValid = false
    } else if (description.trim().length > 1000) {
      errors.description = "Description must be less than 1000 characters"
      isValid = false
    }

    // Category validation
    if (!category) {
      errors.category = "Please select a category"
      isValid = false
    }

    // District validation
    if (!district) {
      errors.district = "Please select a district"
      isValid = false
    }

    // Price validation
    if (!price.trim()) {
      errors.price = "Price is required"
      isValid = false
    } else {
      const priceNum = Number.parseFloat(price)
      if (isNaN(priceNum) || priceNum <= 0) {
        errors.price = "Please enter a valid price greater than 0"
        isValid = false
      } else if (priceNum > 10000000) {
        errors.price = "Price cannot exceed Rs. 10,000,000"
        isValid = false
      }
    }

    // Contact number validation
    if (!contactNumber.trim()) {
      errors.contactNumber = "Contact number is required"
      isValid = false
    } else if (!validatePhoneNumber(contactNumber)) {
      errors.contactNumber = "Please enter a valid Sri Lankan phone number (e.g., 0771234567 or +94771234567)"
      isValid = false
    }

    // Image validation (optional but if provided should be valid)
    if (images.length === 0) {
      errors.images = "Please add at least one image to make your ad more attractive"
      // Note: This is a warning, not blocking validation
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleFieldBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }))
    validateForm()
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    // Clear error for this field when user starts typing
    if (validationErrors[fieldName as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [fieldName]: undefined }))
    }

    // Update field value
    switch (fieldName) {
      case "title":
        setTitle(value)
        break
      case "description":
        setDescription(value)
        break
      case "category":
        setCategory(value)
        break
      case "district":
        setDistrict(value)
        setSelectedDistrict(value)
        setCity("") // Reset city when district changes
        break
      case "city":
        setCity(value)
        break
      case "price":
        setPrice(value)
        break
      case "contactNumber":
        setContactNumber(value)
        break
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImages([reader.result as string])
        // Clear image validation error
        if (validationErrors.images) {
          setValidationErrors((prev) => ({ ...prev, images: undefined }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      category: true,
      district: true,
      price: true,
      contactNumber: true,
      images: true,
    })

    if (!user) {
      toast({
        title: "Error",
        description: "Please login to post an ad",
        variant: "destructive",
      })
      return
    }

    if (userAdCount >= MAX_ADS_PER_USER) {
      toast({
        title: "Maximum Ads Reached",
        description: `You can only have ${MAX_ADS_PER_USER} active ads at a time.`,
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the highlighted fields and correct the errors before submitting.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const now = new Date()

      // Create a new ad object
      const newAd = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        price: Number.parseFloat(price),
        category,
        contactNumber: contactNumber.trim(),
        isWhatsApp,
        isViber,
        images,
        createdAt: now.toISOString(),
        editLockedUntil: new Date(now.getTime() + AD_EDIT_LOCK_PERIOD).toISOString(),
        expiresAt: new Date(now.getTime() + AD_EXPIRATION_PERIOD).toISOString(),
        user: user.username,
        district,
        city: city || undefined,
      }

      // Update the ads list
      const currentAds = JSON.parse(localStorage.getItem("ads") || "[]")
      const updatedAds = [newAd, ...currentAds]
      localStorage.setItem("ads", JSON.stringify(updatedAds))

      toast({
        title: "Success!",
        description: "Your ad has been posted. It will be active for 2 months and can be edited after 14 days.",
      })
      router.push("/")
    } catch (error) {
      console.error("Error posting ad:", error)
      toast({
        title: "Error",
        description: "There was an error posting your ad. Please try again.",
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

  const getFieldClassName = (fieldName: string, baseClassName: string) => {
    const hasError = touched[fieldName] && validationErrors[fieldName as keyof ValidationErrors]
    return `${baseClassName} ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50"
        : "border-primary/30 focus:border-primary"
    }`
  }

  const renderFieldError = (fieldName: string) => {
    const error = validationErrors[fieldName as keyof ValidationErrors]
    if (touched[fieldName] && error) {
      return (
        <div className="flex items-center mt-1 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )
    }
    return null
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-primary">Post New Ad</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4 p-4 bg-primary/10 rounded-lg">
            <h2 className="font-semibold text-primary mb-2">Ad Posting Rules:</h2>
            <ul className="list-disc pl-5 text-sm">
              <li>You can have a maximum of {MAX_ADS_PER_USER} active ads at a time</li>
              <li>Ads cannot be edited for 14 days after posting</li>
              <li>Ads will automatically expire after 2 months</li>
              <li>All required fields must be completed</li>
              <li>Phone number must be in Sri Lankan format</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block mb-2 text-primary font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter a descriptive title for your ad"
                value={title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                onBlur={() => handleFieldBlur("title")}
                className={getFieldClassName("title", "")}
                maxLength={100}
              />
              <div className="flex justify-between items-center mt-1">
                <div>{renderFieldError("title")}</div>
                <span className="text-xs text-gray-500">{title.length}/100</span>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block mb-2 text-primary font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of your ad"
                value={description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                onBlur={() => handleFieldBlur("description")}
                className={getFieldClassName("description", "min-h-[250px]")}
                rows={10}
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-1">
                <div>{renderFieldError("description")}</div>
                <span className="text-xs text-gray-500">{description.length}/1000</span>
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block mb-2 text-primary font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => handleFieldChange("category", e.target.value)}
                onBlur={() => handleFieldBlur("category")}
                className={getFieldClassName(
                  "category",
                  "w-full p-2 border rounded-md focus:ring focus:ring-rose-200 text-sm",
                )}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {renderFieldError("category")}
            </div>

            <div>
              <label htmlFor="district" className="block mb-2 text-primary font-medium">
                District <span className="text-red-500">*</span>
              </label>
              <select
                id="district"
                value={district}
                onChange={(e) => handleFieldChange("district", e.target.value)}
                onBlur={() => handleFieldBlur("district")}
                className={getFieldClassName(
                  "district",
                  "w-full p-2 border rounded-md focus:ring focus:ring-rose-200 text-sm",
                )}
              >
                <option value="">Select District</option>
                {locations.map((location) => (
                  <option key={location.district} value={location.district}>
                    {location.district}
                  </option>
                ))}
              </select>
              {renderFieldError("district")}
            </div>

            <div>
              <label htmlFor="city" className="block mb-2 text-primary font-medium">
                City <span className="text-gray-500">(Optional)</span>
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => handleFieldChange("city", e.target.value)}
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
              <label htmlFor="price" className="block mb-2 text-primary font-medium">
                Price (Rs.) <span className="text-red-500">*</span>
              </label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price in Sri Lankan Rupees"
                value={price}
                onChange={(e) => handleFieldChange("price", e.target.value)}
                onBlur={() => handleFieldBlur("price")}
                className={getFieldClassName("price", "")}
                min="1"
                max="10000000"
              />
              {renderFieldError("price")}
            </div>

            <div>
              <label htmlFor="contactNumber" className="block mb-2 text-primary font-medium">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="0771234567 or +94771234567"
                value={contactNumber}
                onChange={(e) => handleFieldChange("contactNumber", e.target.value)}
                onBlur={() => handleFieldBlur("contactNumber")}
                className={getFieldClassName("contactNumber", "")}
              />
              {renderFieldError("contactNumber")}
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center">
                <Checkbox
                  id="isWhatsApp"
                  checked={isWhatsApp}
                  onCheckedChange={(checked) => setIsWhatsApp(checked as boolean)}
                />
                <label htmlFor="isWhatsApp" className="ml-2 text-primary">
                  WhatsApp Available
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="isViber"
                  checked={isViber}
                  onCheckedChange={(checked) => setIsViber(checked as boolean)}
                />
                <label htmlFor="isViber" className="ml-2 text-primary">
                  Viber Available
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-primary font-medium">
                Image <span className="text-red-500">*</span>
              </label>
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
                      onClick={() => {
                        removeImage(0)
                        setTouched((prev) => ({ ...prev, images: true }))
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-square relative">
                    <label
                      className={`absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/10 transition-colors ${
                        touched.images && validationErrors.images ? "border-red-500 bg-red-50" : "border-primary/30"
                      }`}
                    >
                      <Upload className="h-8 w-8 text-primary/80 mb-2" />
                      <p className="text-sm text-primary/80">Add Image</p>
                      <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        onClick={() => setTouched((prev) => ({ ...prev, images: true }))}
                      />
                    </label>
                  </div>
                )}
              </div>
              {renderFieldError("images")}
              <p className="text-sm text-primary/80">
                Adding an image makes your ad more attractive and increases visibility.
              </p>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Posting..." : "Post Ad"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
