"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { PhoneIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getAdById } from "@/lib/supabase/database"
import type { Ad } from "@/lib/supabase/database"

export default function AdPage({ params }: { params: { id: string } }) {
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const foundAd = await getAdById(params.id)
        setAd(foundAd)
      } catch (error) {
        console.error("Error fetching ad:", error)
        setAd(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAd()
  }, [params.id])

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (!ad) {
    notFound()
  }

  const createdDate = new Date(ad.created_at)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - createdDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let timeAgo
  if (diffDays === 0) {
    timeAgo = "Today"
  } else if (diffDays === 1) {
    timeAgo = "Yesterday"
  } else {
    timeAgo = `${diffDays} days ago`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8 rounded-lg overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={ad.images[0] || "/placeholder.svg"}
            alt={ad.title}
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 mix-blend-overlay" />
        </div>
        <div className="relative z-10 p-8">
          <h1 className="text-3xl font-bold mb-4 text-primary">{ad.title}</h1>
          <p className="text-2xl font-bold text-primary/90 mb-4">
            {ad.price ? `Rs. ${ad.price.toLocaleString()}` : "Price on request"}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square relative mb-4">
            <Image src={ad.images[0] || "/placeholder.svg"} alt={ad.title} fill className="object-cover rounded-lg" />
          </div>
          {ad.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {ad.images.slice(1).map((image: string, index: number) => (
                <div key={index} className="aspect-square relative">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${ad.title} - Image ${index + 2}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="mb-4">{ad.description}</p>
          <p className="font-semibold mb-2">Category: {ad.category?.name}</p>
          {ad.location && <p className="font-semibold mb-2">Location: {ad.location.name}</p>}
          <div className="flex items-center space-x-2 mb-4">
            <PhoneIcon className="w-5 h-5 text-primary/90" />
            <span className="text-primary/90">
              {ad.contact_phone || ad.profile?.telephone || "Contact via message"}
            </span>
            {/* Note: WhatsApp and Viber flags would need to be added to database schema if needed */}
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4 mr-1" />
            <span>{timeAgo}</span>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => {
              const contactNumber = ad.contact_phone || ad.profile?.telephone
              if (contactNumber) {
                window.location.href = `tel:${contactNumber}`
              } else {
                toast({
                  title: "Error",
                  description: "Contact number not available",
                  variant: "destructive",
                })
              }
            }}
          >
            Contact Advertiser
          </Button>
        </div>
      </div>
      {/* Ad Space */}
      <div className="mt-8 w-full bg-gray-200 p-4 text-center rounded-lg">
        <div className="h-[250px] bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600">Ad Space</span>
        </div>
      </div>
    </div>
  )
}
