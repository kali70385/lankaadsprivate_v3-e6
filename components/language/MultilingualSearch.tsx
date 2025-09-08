"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Languages } from "lucide-react"

interface MultilingualSearchProps {
  onSearch: (query: string, language: string) => void
  placeholder?: string
}

export function MultilingualSearch({ onSearch, placeholder }: MultilingualSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [detectedLanguage, setDetectedLanguage] = useState("en")
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Language detection function
  const detectLanguage = (text: string): string => {
    if (!text) return "en"

    // Sinhala Unicode range: U+0D80–U+0DFF
    if (/[\u0D80-\u0DFF]/.test(text)) return "si"

    // Tamil Unicode range: U+0B80–U+0BFF
    if (/[\u0B80-\u0BFF]/.test(text)) return "ta"

    return "en"
  }

  // Enhanced search that works with Unicode
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD") // Normalize Unicode
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .trim()
  }

  useEffect(() => {
    const language = detectLanguage(searchQuery)
    setDetectedLanguage(language)

    // Generate search suggestions based on language
    if (searchQuery.length > 1) {
      generateSuggestions(searchQuery, language)
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  const generateSuggestions = (query: string, language: string) => {
    // In a real app, this would call an API
    const commonTerms = {
      en: ["mobile", "laptop", "car", "house", "job", "massage", "room"],
      si: ["ජංගම", "ලැප්ටොප්", "මෝටර් රථ", "නිවස", "රැකියා", "සම්බාහන", "කාමර"],
      ta: ["மொபைல்", "லேப்டாப்", "கார்", "வீடு", "வேலை", "மசாஜ்", "அறை"],
    }

    const terms = commonTerms[language as keyof typeof commonTerms] || commonTerms.en
    const filtered = terms.filter((term) => normalizeText(term).includes(normalizeText(query)))

    setSuggestions(filtered.slice(0, 5))
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim(), detectedLanguage)
      setSuggestions([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion)
    onSearch(suggestion, detectedLanguage)
    setSuggestions([])
  }

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder || "Search in English, සිංහල, or தமிழ்..."}
            className="pl-10 pr-16"
            style={{
              fontFamily:
                detectedLanguage === "si"
                  ? "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
                  : detectedLanguage === "ta"
                    ? "'Noto Sans Tamil', 'Latha', sans-serif"
                    : "inherit",
            }}
          />

          {/* Language indicator */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
              <Languages className="w-3 h-3" />
              {detectedLanguage === "si" ? "සි" : detectedLanguage === "ta" ? "த" : "EN"}
            </span>
          </div>
        </div>

        <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
              style={{
                fontFamily:
                  detectedLanguage === "si"
                    ? "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
                    : detectedLanguage === "ta"
                      ? "'Noto Sans Tamil', 'Latha', sans-serif"
                      : "inherit",
              }}
            >
              <Search className="w-3 h-3 inline mr-2 text-gray-400" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
