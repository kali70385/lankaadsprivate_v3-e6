"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { locations } from "@/lib/locations"

export function LocationBrowser() {
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null)

  const popularDistricts = ["Colombo", "Gampaha", "Kandy", "Galle", "Kurunegala", "Jaffna"]

  const toggleDistrict = (district: string) => {
    if (expandedDistrict === district) {
      setExpandedDistrict(null)
    } else {
      setExpandedDistrict(district)
    }
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-center text-primary/90">Browse by Location</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {popularDistricts.map((district) => (
          <Link
            key={district}
            href={`/?locationFilter=${district}`}
            className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow"
          >
            <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
            <span className="font-medium">{district}</span>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <div key={location.district} className="border-b pb-2 last:border-b-0">
              <button
                onClick={() => toggleDistrict(location.district)}
                className="flex items-center justify-between w-full text-left font-medium py-2"
              >
                <span>{location.district}</span>
                <span>{expandedDistrict === location.district ? "−" : "+"}</span>
              </button>

              {expandedDistrict === location.district && (
                <div className="grid grid-cols-2 gap-2 pl-4 pb-2">
                  {location.cities.slice(0, 6).map((city) => (
                    <Link
                      key={city}
                      href={`/?locationFilter=${location.district}&city=${city}`}
                      className="text-sm text-gray-600 hover:text-primary"
                    >
                      {city}
                    </Link>
                  ))}
                  {location.cities.length > 6 && (
                    <Link href={`/?locationFilter=${location.district}`} className="text-sm text-primary font-medium">
                      View all...
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
