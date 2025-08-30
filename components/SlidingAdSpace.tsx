"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

export function SlidingAdSpace() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Hide the ad when near the bottom of the page
      if (scrollPosition + windowHeight > documentHeight - 200) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gray-200 border-t border-magenta-200 shadow-lg transition-transform duration-300 ease-in-out z-40 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full rounded-t-lg px-2 sm:px-4 py-1 sm:py-2 flex items-center justify-center shadow-md bg-magenta-700 text-white text-xs sm:text-sm"
      >
        {isVisible ? (
          <>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Hide Ad</span>
            <span className="sm:hidden">Hide</span>
          </>
        ) : (
          <>
            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Show Ad</span>
            <span className="sm:hidden">Show</span>
          </>
        )}
      </button>
      <div className="max-w-[728px] h-[60px] sm:h-[90px] mx-auto bg-gray-300 flex items-center justify-center relative px-2">
        <span className="text-gray-600 text-xs sm:text-sm">Leaderboard Ad Space</span>
      </div>
    </div>
  )
}
