"use client"

import { useEffect } from "react"

export function FontLoader() {
  useEffect(() => {
    // Load Google Fonts for Sinhala and Tamil
    const loadFonts = () => {
      const link = document.createElement("link")
      link.href =
        "https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@300;400;500;600;700&family=Noto+Sans+Tamil:wght@300;400;500;600;700&display=swap"
      link.rel = "stylesheet"
      document.head.appendChild(link)
    }

    loadFonts()

    // Add CSS for better Unicode support
    const style = document.createElement("style")
    style.textContent = `
      /* Sinhala text styling */
      .sinhala-text {
        font-family: 'Noto Sans Sinhala', 'Iskoola Pota', sans-serif;
        line-height: 1.8;
        letter-spacing: 0.02em;
      }

      /* Tamil text styling */
      .tamil-text {
        font-family: 'Noto Sans Tamil', 'Latha', sans-serif;
        line-height: 1.7;
        letter-spacing: 0.01em;
      }

      /* Auto-detect and apply fonts */
      .multilingual-text {
        font-feature-settings: "liga" 1, "calt" 1;
      }

      /* Ensure proper rendering of complex scripts */
      input, textarea, .message-content {
        unicode-bidi: plaintext;
        text-rendering: optimizeLegibility;
      }

      /* Better support for RTL/LTR mixed content */
      .mixed-content {
        direction: ltr;
        text-align: left;
      }

      /* Improved line breaking for Sinhala/Tamil */
      .sinhala-text, .tamil-text {
        word-break: keep-all;
        overflow-wrap: break-word;
        hyphens: auto;
      }
    `
    document.head.appendChild(style)

    return () => {
      // Cleanup if needed
    }
  }, [])

  return null
}
