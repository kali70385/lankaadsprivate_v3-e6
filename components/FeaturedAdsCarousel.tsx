"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Link from "next/link"

export function FeaturedAdsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [featuredAds, setFeaturedAds] = useState<any[]>([])

  useEffect(() => {
    // Get all ads from localStorage
    const allAds = JSON.parse(localStorage.getItem("ads") || "[]")
    // Select a few random ads to feature
    const randomAds = allAds.sort(() => 0.5 - Math.random()).slice(0, Math.min(5, allAds.length))
    setFeaturedAds(randomAds)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === featuredAds.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? featuredAds.length - 1 : prevIndex - 1))
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [featuredAds.length])

  if (featuredAds.length === 0) return null

  return (
    <div className="relative overflow-hidden rounded-lg shadow-md bg-white mb-12">
      <div className="absolute top-0 left-0 bg-primary text-white px-4 py-1 rounded-br-lg z-10">
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-1 fill-white" />
          <span className="text-sm font-medium">Featured</span>
        </div>
      </div>

      <div className="relative h-64 md:h-80">
        {featuredAds.map((ad, index) => (
          <Link
            href={`/ad/${ad.id}`}
            key={ad.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <Image src={ad.images?.[0] || "/placeholder.svg"} alt={ad.title} fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
              <h3 className="text-xl font-bold mb-1">{ad.title}</h3>
              <p className="text-sm line-clamp-2">{ad.description}</p>
              <p className="text-lg font-bold mt-2">Rs. {ad.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {featuredAds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}
