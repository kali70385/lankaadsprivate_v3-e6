"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Type } from "lucide-react"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇱🇰" },
]

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState("en")

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem("preferredLanguage") || "en"
    setCurrentLanguage(savedLang)

    // Apply language to document
    document.documentElement.lang = savedLang
  }, [])

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode)
    localStorage.setItem("preferredLanguage", langCode)
    document.documentElement.lang = langCode

    // In a real app, this would trigger translation updates
    window.location.reload() // Temporary for demo
  }

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-40">
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Enhanced text input with language support
export function MultilingualTextInput({ value, onChange, placeholder, maxLength, className = "", ...props }: any) {
  const [inputLanguage, setInputLanguage] = useState<string>("auto")
  const [characterCount, setCharacterCount] = useState(0)

  useEffect(() => {
    // Proper Unicode character counting
    const count = [...value].length // This handles Unicode properly
    setCharacterCount(count)

    // Detect language (basic detection)
    if (value) {
      if (/[\u0D80-\u0DFF]/.test(value)) {
        setInputLanguage("si") // Sinhala Unicode range
      } else if (/[\u0B80-\u0BFF]/.test(value)) {
        setInputLanguage("ta") // Tamil Unicode range
      } else {
        setInputLanguage("en")
      }
    }
  }, [value])

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          {...props}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
          style={{
            fontFamily:
              inputLanguage === "si"
                ? "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
                : inputLanguage === "ta"
                  ? "'Noto Sans Tamil', 'Latha', sans-serif"
                  : "inherit",
          }}
        />

        {/* Language indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {inputLanguage === "si" ? "සි" : inputLanguage === "ta" ? "த" : "EN"}
          </span>
        </div>
      </div>

      {/* Character count with proper Unicode support */}
      {maxLength && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {inputLanguage !== "en" && (
              <span className="text-blue-600 mr-2">
                <Type className="w-3 h-3 inline mr-1" />
                {inputLanguage === "si" ? "සිංහල" : "தமிழ்"} detected
              </span>
            )}
          </span>
          <span className={characterCount > maxLength ? "text-red-500" : ""}>
            {characterCount}/{maxLength}
          </span>
        </div>
      )}
    </div>
  )
}

// Enhanced textarea with language support
export function MultilingualTextarea({
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 4,
  className = "",
  ...props
}: any) {
  const [inputLanguage, setInputLanguage] = useState<string>("auto")
  const [characterCount, setCharacterCount] = useState(0)

  useEffect(() => {
    const count = [...value].length
    setCharacterCount(count)

    if (value) {
      if (/[\u0D80-\u0DFF]/.test(value)) {
        setInputLanguage("si")
      } else if (/[\u0B80-\u0BFF]/.test(value)) {
        setInputLanguage("ta")
      } else {
        setInputLanguage("en")
      }
    }
  }, [value])

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          {...props}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary resize-vertical ${className}`}
          style={{
            fontFamily:
              inputLanguage === "si"
                ? "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
                : inputLanguage === "ta"
                  ? "'Noto Sans Tamil', 'Latha', sans-serif"
                  : "inherit",
            lineHeight: inputLanguage !== "en" ? "1.8" : "1.5", // Better line height for Sinhala/Tamil
          }}
        />

        <div className="absolute right-3 top-3 flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {inputLanguage === "si" ? "සි" : inputLanguage === "ta" ? "த" : "EN"}
          </span>
        </div>
      </div>

      {maxLength && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {inputLanguage !== "en" && (
              <span className="text-blue-600 mr-2">
                <Type className="w-3 h-3 inline mr-1" />
                {inputLanguage === "si" ? "සිංහල භාෂාව" : "தமிழ் மொழி"} detected
              </span>
            )}
          </span>
          <span className={characterCount > maxLength ? "text-red-500" : ""}>
            {characterCount}/{maxLength}
          </span>
        </div>
      )}
    </div>
  )
}
