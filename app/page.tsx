"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { categories } from "@/lib/categories"
import AdComponent from "@/components/AdComponent"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"
import Image from "next/image"
import React from "react"
import { locations } from "@/lib/locations"
import { getAds } from "@/lib/supabase/database"
import type { Ad } from "@/lib/supabase/database"

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [latestAds, setLatestAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const adsPerPage = 16
  const [locationFilter, setLocationFilter] = useState("")

  useEffect(() => {
    async function fetchAds() {
      try {
        const ads = await getAds({ limit: 100 })
        setLatestAds(ads)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching latest ads:", err)
        setError("Failed to load latest ads. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchAds()
  }, [])

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-600 mt-8">{error}</div>
  }

  const filteredByLocation = locationFilter ? latestAds.filter((ad) => ad.location?.name === locationFilter) : latestAds

  const indexOfLastAd = currentPage * adsPerPage
  const indexOfFirstAd = indexOfLastAd - adsPerPage
  const currentAds = filteredByLocation.slice(indexOfFirstAd, indexOfLastAd)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full overflow-x-hidden">
      {/* Hero Section with Background Image */}
      <div className="relative -mx-2 sm:-mx-4 -mt-4 sm:-mt-8 mb-8 sm:mb-12 rounded-lg overflow-hidden shadow-lg">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixelcut-export.jpg-RBsZHWXkPaSfaBLy6hdGosvvWBIiwr.jpeg"
            alt=""
            fill
            className="object-cover object-center opacity-100"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[1px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4 py-12 sm:py-16">
          <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-white">Free Sri Lankan Classified Ads</h1>
          <p className="text-base sm:text-lg mb-6 text-primary-foreground">
            Discover Private Connections, Special Services & More
          </p>
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
              <Button
                onClick={() => router.push("/chatroom")}
                className="bg-magenta-600 hover:bg-magenta-700 text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-lg font-semibold"
              >
                Join Chatroom
              </Button>
              <Button
                onClick={() => {
                  if (user) {
                    router.push("/post-ad")
                  } else {
                    setIsLoginOpen(true)
                  }
                }}
                className="bg-magenta-600 hover:bg-magenta-700 text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-lg font-semibold"
              >
                Post your ad now
              </Button>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-md">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Input
                  type="search"
                  placeholder="Search ads..."
                  className="flex-1 border-magenta-300 focus:ring-magenta-500 focus:border-magenta-500 bg-white/90 text-sm"
                />
                <select
                  className="border border-magenta-300 rounded-md focus:ring-magenta-500 focus:border-magenta-500 bg-white/90 px-2 py-2 text-xs sm:text-sm min-w-0"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location.district} value={location.district}>
                      {location.district}
                    </option>
                  ))}
                </select>
              </div>
              <Button className="bg-magenta-600 hover:bg-magenta-700 w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8 sm:mb-12 bg-magenta-500 py-6 sm:py-8 -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-white">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-full">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex items-center p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow border border-magenta-100 min-w-0"
            >
              <category.icon className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-magenta-600 group-hover:text-magenta-700 flex-shrink-0" />
              <h3 className="font-semibold group-hover:text-magenta-700 text-sm sm:text-base truncate">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Ads */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-magenta-700">Latest Ads</h2>
        <div className="space-y-4 sm:space-y-6">
          {currentAds.map((ad, index) => (
            <React.Fragment key={ad.id}>
              <AdComponent ad={ad} />
              {(index + 1) % 4 === 0 && index + 1 !== currentAds.length && (
                <div className="bg-white/80 backdrop-blur-sm p-4 text-center rounded-lg shadow-sm">
                  <div className="h-[200px] sm:h-[250px] bg-gray-300 flex items-center justify-center rounded">
                    <span className="text-gray-600 text-sm">Ad Space</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 sm:mt-8 flex justify-center gap-2">
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-magenta-600 hover:bg-magenta-700 text-sm px-3 py-2"
        >
          Previous
        </Button>
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastAd >= filteredByLocation.length}
          className="bg-magenta-600 hover:bg-magenta-700 text-sm px-3 py-2"
        >
          Next
        </Button>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  )
}
