"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { PhoneIcon, MessageCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function AdPage({ params }: { params: { id: string } }) {
  const [ad, setAd] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAd = () => {
      const ads = JSON.parse(localStorage.getItem("ads") || "[]")
      const foundAd = ads.find((a: any) => a.id === params.id)
      if (foundAd) {
        setAd(foundAd)
      }
      setLoading(false)
    }

    fetchAd()
  }, [params.id])

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (!ad) {
    notFound()
  }

  const createdDate = new Date(ad.createdAt)
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
          <p className="text-2xl font-bold text-primary/90 mb-4">Rs. {ad.price.toLocaleString()}</p>
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
          <p className="font-semibold mb-2">Category: {ad.category}</p>
          {ad.district && (
            <p className="font-semibold mb-2">Location: {ad.city ? `${ad.city}, ${ad.district}` : ad.district}</p>
          )}
          <div className="flex items-center space-x-2 mb-4">
            <PhoneIcon className="w-5 h-5 text-primary/90" />
            <span className="text-primary/90">{ad.contactNumber}</span>
            {ad.isWhatsApp && <MessageCircle className="w-5 h-5 text-green-500" title="WhatsApp available" />}
            {ad.isViber && (
              <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor" title="Viber available">
                <path d="M11.4.8C5.1.8 0 5.9 0 12.2c0 2.8 1 5.4 2.7 7.4l-.7 3.1 3.2-.7c1.9 1.5 4.3 2.4 6.9 2.4 6.3 0 11.4-5.1 11.4-11.4S17.7.8 11.4.8zm6.8 14.7c-.3.8-1.5 1.5-2.4 1.7-.6.1-1.4.2-4.1-.9-3.4-1.4-5.6-4.8-5.8-5-.2-.2-1.6-2.1-1.6-4.1 0-2 1-2.9 1.4-3.3.3-.3.7-.4 1-.4h.7c.3 0 .6 0 .8.7.3.7 1 2.5 1.1 2.7.1.2.2.4 0 .7-.1.3-.2.4-.4.6-.2.2-.4.4-.5.5-.2.2-.4.4-.2.7.2.4.9 1.6 2 2.6 1.4 1.3 2.6 1.7 3 1.9.3.1.6.1.8-.1.2-.3.9-1.1 1.2-1.5.2-.3.5-.3.8-.2.3.1 2.1 1 2.4 1.2.3.2.6.3.7.5.1.1.1.7-.2 1.5z" />
              </svg>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4 mr-1" />
            <span>{timeAgo}</span>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => {
              if (ad.contactNumber) {
                window.location.href = `tel:${ad.contactNumber}`
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
