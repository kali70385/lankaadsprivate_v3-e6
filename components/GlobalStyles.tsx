"use client"

import { useEffect } from "react"

export function GlobalStyles() {
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      body.dialog-open {
        overflow: hidden;
      }
      body.dialog-open::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 40;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}
