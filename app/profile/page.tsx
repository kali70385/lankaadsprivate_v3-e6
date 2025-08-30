"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

// Constants for ad limitations
const MAX_ADS_PER_USER = 4
const AD_EDIT_LOCK_PERIOD = 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
const AD_EXPIRATION_PERIOD = 60 * 24 * 60 * 60 * 1000 // 60 days (2 months) in milliseconds

interface Ad {
  id: string
  title: string
  description: string
  price: string | number
  images: string[]
  createdAt: string
  editLockedUntil?: string
  expiresAt?: string
  status: "active" | "inactive"
  user: string
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [userAds, setUserAds] = useState<Ad[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    // Load user's ads from localStorage
    const allAds = JSON.parse(localStorage.getItem("ads") || "[]")

    // Filter user's ads and check expiration
    const now = new Date()
    const userAds = allAds
      .filter((ad) => ad.user === user.username)
      .map((ad) => {
        // Check if ad has expired
        const expiresAt = ad.expiresAt
          ? new Date(ad.expiresAt)
          : new Date(new Date(ad.createdAt).getTime() + AD_EXPIRATION_PERIOD)
        const isExpired = now > expiresAt

        return {
          ...ad,
          status: isExpired ? "inactive" : "active",
          expiresAt: expiresAt.toISOString(),
        }
      })

    setUserAds(userAds)

    // Clean up expired ads from localStorage
    const updatedAllAds = allAds.filter((ad) => {
      if (!ad.expiresAt) return true // Keep ads without expiration date
      return (
        new Date(ad.expiresAt) > now || new Date() < new Date(new Date(ad.createdAt).getTime() + AD_EXPIRATION_PERIOD)
      )
    })

    if (updatedAllAds.length !== allAds.length) {
      localStorage.setItem("ads", JSON.stringify(updatedAllAds))
    }
  }, [user, router])

  const isAdExpired = (ad: Ad) => {
    if (ad.expiresAt) {
      return new Date() > new Date(ad.expiresAt)
    }
    return false
  }

  const isAdEditLocked = (ad: Ad) => {
    if (ad.editLockedUntil) {
      return new Date() < new Date(ad.editLockedUntil)
    }

    // If no explicit lock time, check if it's within 14 days of creation
    const createdAt = new Date(ad.createdAt)
    return new Date().getTime() - createdAt.getTime() < AD_EDIT_LOCK_PERIOD
  }

  const handleDeleteAd = (adId: string) => {
    // Delete from localStorage
    const allAds = JSON.parse(localStorage.getItem("ads") || "[]")
    const updatedAds = allAds.filter((ad) => ad.id !== adId)
    localStorage.setItem("ads", JSON.stringify(updatedAds))

    // Update state
    setUserAds(userAds.filter((ad) => ad.id !== adId))

    toast({
      title: "Ad Deleted",
      description: "Your ad has been successfully deleted.",
    })
  }

  const handleEditAd = (adId: string) => {
    const ad = userAds.find((ad) => ad.id === adId)

    if (ad && isAdEditLocked(ad)) {
      const editLockedUntil = ad.editLockedUntil
        ? new Date(ad.editLockedUntil)
        : new Date(new Date(ad.createdAt).getTime() + AD_EDIT_LOCK_PERIOD)

      toast({
        title: "Edit Locked",
        description: `This ad cannot be edited until ${editLockedUntil.toLocaleDateString()}`,
        variant: "destructive",
      })
      return
    }

    router.push(`/edit-ad/${adId}`)
  }

  const handleRepublishAd = (adId: string) => {
    // Get all ads
    const allAds = JSON.parse(localStorage.getItem("ads") || "[]")

    // Count active ads
    const activeAdsCount = userAds.filter((ad) => ad.status === "active").length

    if (activeAdsCount >= MAX_ADS_PER_USER) {
      toast({
        title: "Maximum Ads Reached",
        description: `You can only have ${MAX_ADS_PER_USER} active ads at a time.`,
        variant: "destructive",
      })
      return
    }

    // Update the ad
    const now = new Date()
    const updatedAllAds = allAds.map((ad) => {
      if (ad.id === adId) {
        return {
          ...ad,
          createdAt: now.toISOString(),
          editLockedUntil: new Date(now.getTime() + AD_EDIT_LOCK_PERIOD).toISOString(),
          expiresAt: new Date(now.getTime() + AD_EXPIRATION_PERIOD).toISOString(),
        }
      }
      return ad
    })

    localStorage.setItem("ads", JSON.stringify(updatedAllAds))

    // Update state
    setUserAds(
      userAds.map((ad) =>
        ad.id === adId
          ? {
              ...ad,
              status: "active",
              createdAt: now.toISOString(),
              editLockedUntil: new Date(now.getTime() + AD_EDIT_LOCK_PERIOD).toISOString(),
              expiresAt: new Date(now.getTime() + AD_EXPIRATION_PERIOD).toISOString(),
            }
          : ad,
      ),
    )

    toast({
      title: "Ad Republished",
      description: "Your ad has been republished and will be active for 2 months.",
    })
  }

  if (!user) return null

  const activeAdsCount = userAds.filter((ad) => ad.status === "active").length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Username:</span> {user.username}
            </p>
            <p>
              <span className="font-semibold">Telephone:</span> {user.telephone}
            </p>
          </div>
          <Button variant="destructive" onClick={logout} className="mt-4">
            Logout
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">My Ads</h2>
          <div className="mb-4 p-4 bg-primary/10 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Ad Rules:</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>You can have a maximum of {MAX_ADS_PER_USER} active ads at a time</li>
              <li>Ads cannot be edited for 14 days after posting</li>
              <li>Ads will automatically expire after 2 months</li>
              <li>
                You currently have {activeAdsCount}/{MAX_ADS_PER_USER} active ads
              </li>
            </ul>
          </div>
          <Link href={activeAdsCount < MAX_ADS_PER_USER ? "/post-ad" : "#"} passHref>
            <Button
              className="mb-4 bg-primary hover:bg-primary/90"
              disabled={activeAdsCount >= MAX_ADS_PER_USER}
              onClick={() => {
                if (activeAdsCount >= MAX_ADS_PER_USER) {
                  toast({
                    title: "Maximum ads reached",
                    description: `You can only have up to ${MAX_ADS_PER_USER} active ads at a time.`,
                    variant: "destructive",
                  })
                }
              }}
            >
              Create New Ad
            </Button>
          </Link>
          <div className="space-y-4">
            {userAds.map((ad) => (
              <div key={ad.id} className="flex gap-4 p-4 border rounded-lg">
                <div className="relative w-24 h-24">
                  <Image
                    src={ad.images?.[0] || "/placeholder.svg"}
                    alt={ad.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                  {ad.status === "inactive" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <span className="text-white text-xs font-bold px-2 py-1 bg-red-500 rounded">EXPIRED</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{ad.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{ad.description}</p>
                  <p className="font-semibold text-primary">
                    Rs. {typeof ad.price === "number" ? ad.price.toLocaleString() : ad.price}
                  </p>
                  <div className="flex items-center mt-2">
                    {isAdEditLocked(ad) && (
                      <div className="flex items-center text-amber-600 text-xs mr-3">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        <span>
                          Edit locked until{" "}
                          {new Date(
                            ad.editLockedUntil || new Date(new Date(ad.createdAt).getTime() + AD_EDIT_LOCK_PERIOD),
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {ad.status === "active" && (
                      <div className="text-xs text-gray-500">
                        Expires:{" "}
                        {new Date(
                          ad.expiresAt || new Date(new Date(ad.createdAt).getTime() + AD_EXPIRATION_PERIOD),
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEditAd(ad.id)}
                    disabled={isAdEditLocked(ad) || ad.status === "inactive"}
                    title={isAdEditLocked(ad) ? "Cannot edit until lock period ends" : "Edit ad"}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDeleteAd(ad.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {ad.status === "inactive" && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleRepublishAd(ad.id)}
                      disabled={activeAdsCount >= MAX_ADS_PER_USER}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Republish
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {userAds.length === 0 && (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">You haven't posted any ads yet.</p>
              </div>
            )}
          </div>
        </div>
        {/* Ad Space */}
        <div className="w-full bg-gray-200 p-4 text-center rounded-lg mt-8">
          <div className="h-[250px] bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600">Ad Space</span>
          </div>
        </div>
      </div>
    </div>
  )
}
