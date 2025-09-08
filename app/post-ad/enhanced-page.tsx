"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Upload, X, AlertCircle, Globe } from "lucide-react"
import { categories } from "@/lib/categories"
import { locations } from "@/lib/locations"
import { MultilingualTextInput, MultilingualTextarea } from "@/components/language/MultilingualSupport"
import { FontLoader } from "@/components/language/FontLoader"

const MAX_ADS_PER_USER = 4
const AD_EDIT_LOCK_PERIOD = 14 * 24 * 60 * 60 * 1000
const AD_EXPIRATION_PERIOD = 60 * 24 * 60 * 60 * 1000

interface ValidationErrors {
  title?: string
  description?: string
  category?: string
  district?: string
  price?: string
  contactNumber?: string
  images?: string
}

export default function EnhancedPostAd() {
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

  // Language detection states
  const [titleLanguage, setTitleLanguage] = useState("en")
  const [descriptionLanguage, setDescriptionLanguage] = useState("en")

  useEffect(() => {
    const savedAds = JSON.parse(localStorage.getItem("ads") || "[]")
    if (user) {
      const userAds = savedAds.filter((ad) => ad.user === user.username)
      setUserAdCount(userAds.length)
    }
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

  // Enhanced validation for Unicode text
  const validateUnicodeText = (text: string, minLength: number, maxLength: number): boolean => {
    const length = [...text].length // Proper Unicode length
    return length >= minLength && length <= maxLength
  }

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    let isValid = true

    // Title validation with Unicode support
    if (!title.trim()) {
      errors.title = "Title is required"
      isValid = false
    } else if (!validateUnicodeText(title.trim(), 5, 100)) {
      errors.title = "Title must be between 5-100 characters"
      isValid = false
    }

    // Description validation with Unicode support
    if (!description.trim()) {
      errors.description = "Description is required"
      isValid = false
    } else if (!validateUnicodeText(description.trim(), 20, 1000)) {
      errors.description = "Description must be between 20-1000 characters"
      isValid = false
    }

    // Other validations remain the same
    if (!category) {
      errors.category = "Please select a category"
      isValid = false
    }

    if (!district) {
      errors.district = "Please select a district"
      isValid = false
    }

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

    // Enhanced phone validation for Sri Lankan numbers
    if (!contactNumber.trim()) {
      errors.contactNumber = "Contact number is required"
      isValid = false
    } else if (!/^(\+94|0)([0-9]{9})$/.test(contactNumber)) {
      errors.contactNumber = "Please enter a valid Sri Lankan phone number"
      isValid = false
    }

    if (images.length === 0) {
      errors.images = "Please add at least one image"
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setTouched({
      title: true,
      description: true,
      category: true,
      district: true,
      price: true,
      contactNumber: true,
      images: true,
    })

    if (!user || userAdCount >= MAX_ADS_PER_USER || !validateForm()) {
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
        // Store detected languages for better search
        titleLanguage,
        descriptionLanguage,
      }

      const currentAds = JSON.parse(localStorage.getItem("ads") || "[]")
      const updatedAds = [newAd, ...currentAds]
      localStorage.setItem("ads", JSON.stringify(updatedAds))

      toast({
        title: "Success! / සාර්ථකයි! / வெற்றி!",
        description:
          "Your ad has been posted successfully. / ඔබේ දැන්වීම සාර්ථකව පළ කර ඇත. / உங்கள் விளம்பரம் வெற்றிகரமாக இடுகையிடப்பட்டது.",
      })
      router.push("/")
    } catch (error) {
      console.error("Error posting ad:", error)
      toast({
        title: "Error / දෝෂයක් / பிழை",
        description: "There was an error posting your ad. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getCitiesForDistrict = () => {
    if (!district) return []
    const districtObj = locations.find((loc) => loc.district === district)
    return districtObj ? districtObj.cities : []
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
    <>
      <FontLoader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-primary">Post New Ad</h1>
            <Globe className="w-6 h-6 text-primary" />
            <span className="text-sm text-gray-600">සිංහල / தமிழ் / English supported</span>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4 p-4 bg-primary/10 rounded-lg">
              <h2 className="font-semibold text-primary mb-2">
                Ad Posting Rules / දැන්වීම් පළ කිරීමේ නීති / விளம்பர இடுகை விதிகள்:
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>You can post ads in English, Sinhala, or Tamil / ඉංග්‍රීසි, සිංහල හෝ දමිළ භාෂාවෙන් දැන්වීම් පළ කළ හැක</li>
                <li>
                  Maximum {MAX_ADS_PER_USER} active ads per user / පරිශීලකයෙකුට උපරිම සක්‍රීය දැන්වීම් {MAX_ADS_PER_USER}ක්
                </li>
                <li>Ads expire after 2 months / මාස 2කට පසු දැන්වීම් කල් ඉකුත් වේ</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block mb-2 text-primary font-medium">
                  Title / මාතෘකාව / தலைப்பு <span className="text-red-500">*</span>
                </label>
                <MultilingualTextInput
                  id="title"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="Enter title in any language / ඕනෑම භාෂාවකින් මාතෘකාව ඇතුළත් කරන්න / எந்த மொழியிலும் தலைப்பை உள்ளிடவும்"
                  maxLength={100}
                  className={touched.title && validationErrors.title ? "border-red-500" : ""}
                />
                {renderFieldError("title")}
              </div>

              <div>
                <label htmlFor="description" className="block mb-2 text-primary font-medium">
                  Description / විස්තරය / விளக்கம் <span className="text-red-500">*</span>
                </label>
                <MultilingualTextarea
                  id="description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="Provide detailed description / සවිස්තර විස්තරයක් ලබා දෙන්න / விரிவான விளக்கம் அளிக்கவும්"
                  maxLength={1000}
                  rows={8}
                  className={touched.description && validationErrors.description ? "border-red-500" : ""}
                />
                {renderFieldError("description")}
              </div>

              <div>
                <label htmlFor="category" className="block mb-2 text-primary font-medium">
                  Category / ප්‍රවර්ගය / வகை <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full p-2 border rounded-md focus:ring focus:ring-rose-200 text-sm ${
                    touched.category && validationErrors.category ? "border-red-500" : "border-primary/30"
                  }`}
                >
                  <option value="">Select a category / ප්‍රවර්ගයක් තෝරන්න / ஒரு வகையைத் தேர்ந்தெடுக்கவும்</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {renderFieldError("category")}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="district" className="block mb-2 text-primary font-medium">
                    District / දිස්ත්‍රික්කය / மாவட்டம் <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="district"
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value)
                      setCity("")
                    }}
                    className={`w-full p-2 border rounded-md focus:ring focus:ring-rose-200 text-sm ${
                      touched.district && validationErrors.district ? "border-red-500" : "border-primary/30"
                    }`}
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
                    City / නගරය / நகரம் <span className="text-gray-500">(Optional)</span>
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
              </div>

              <div>
                <label htmlFor="price" className="block mb-2 text-primary font-medium">
                  Price (Rs.) / මිල (රු.) / விலை (ரூ.) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  placeholder="Enter price / මිල ඇතුළත් කරන්න / விலையை உள்ளிடவும்"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    touched.price && validationErrors.price ? "border-red-500" : "border-primary/30"
                  }`}
                  min="1"
                  max="10000000"
                />
                {renderFieldError("price")}
              </div>

              <div>
                <label htmlFor="contactNumber" className="block mb-2 text-primary font-medium">
                  Contact Number / සම්බන්ධතා අංකය / தொடர்பு எண் <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactNumber"
                  type="tel"
                  placeholder="0771234567 or +94771234567"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    touched.contactNumber && validationErrors.contactNumber ? "border-red-500" : "border-primary/30"
                  }`}
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
                    WhatsApp Available / WhatsApp ඇත / WhatsApp கிடைக்கும்
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="isViber"
                    checked={isViber}
                    onCheckedChange={(checked) => setIsViber(checked as boolean)}
                  />
                  <label htmlFor="isViber" className="ml-2 text-primary">
                    Viber Available / Viber ඇත / Viber கிடைக்கும்
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-primary font-medium">
                  Image / රූපය / படம் <span className="text-red-500">*</span>
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
                        onClick={() => setImages([])}
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
                        <p className="text-sm text-primary/80">Add Image / රූපයක් එක් කරන්න / படம் சேர்க்கவும்</p>
                        <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                toast({
                                  title: "File too large",
                                  description: "Please select an image smaller than 5MB",
                                  variant: "destructive",
                                })
                                return
                              }
                              const reader = new FileReader()
                              reader.onloadend = () => setImages([reader.result as string])
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
                {renderFieldError("images")}
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading
                  ? "Posting... / පළ කරමින්... / இடுகையிடுகிறது..."
                  : "Post Ad / දැන්වීම පළ කරන්න / விளம்பரத்தை இடுகையிடவும்"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
