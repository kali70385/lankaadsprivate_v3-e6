"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Search } from "lucide-react"
import AdComponent from "@/components/AdComponent"
import { categories } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from "react"
import { locations } from "@/lib/locations"
import { getAds } from "@/lib/supabase/database-client"
import type { Ad } from "@/lib/supabase/database-client"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((cat) => cat.slug === params.slug)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const adsPerPage = 16
  const [locationFilter, setLocationFilter] = useState("")
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  if (!category) {
    notFound()
  }

  useEffect(() => {
    async function fetchCategoryAds() {
      try {
        setLoading(true)
        const categoryAds = await getAds({ category: category.slug })
        setAds(categoryAds)
      } catch (error) {
        console.error("Error fetching category ads:", error)
        setAds([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryAds()
  }, [category.slug])

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  const filteredBySearch = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAds = locationFilter
    ? filteredBySearch.filter((ad) => ad.location?.name === locationFilter)
    : filteredBySearch

  const indexOfLastAd = currentPage * adsPerPage
  const indexOfFirstAd = indexOfLastAd - adsPerPage
  const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm mb-6 border border-rose-100">
        <h2 className="text-2xl font-bold mb-4 text-primary">{category.name}</h2>
        <Link href="/post-ad" className="inline-block mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
          Create New Ad
        </Link>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              type="search"
              placeholder={`Search ${category.name} ads...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-primary/30 focus:ring-primary focus:border-primary"
            />
            <select
              className="border border-primary/30 rounded-md focus:ring-primary focus:border-primary px-2 w-32 text-xs"
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
            <Button className="bg-primary hover:bg-primary/90">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {currentAds.map((ad, index) => (
          <React.Fragment key={ad.id}>
            <AdComponent ad={ad} />
            {(index + 1) % 4 === 0 && index + 1 !== currentAds.length && (
              <div className="bg-white/80 backdrop-blur-sm p-4 text-center rounded-lg shadow-sm border border-rose-100">
                <div className="h-[250px] bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">Ad Space</span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {filteredAds.length === 0 && (
        <div className="text-center text-gray-500 mt-4 p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-rose-100">
          No ads found matching your search.
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="mr-2">
          Previous
        </Button>
        <Button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastAd >= filteredAds.length}>
          Next
        </Button>
      </div>
    </div>
  )
}
