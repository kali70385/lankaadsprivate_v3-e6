"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageCircle, X } from "lucide-react"

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-64 animate-in slide-in-from-right">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Quick Chat</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm mb-3">Join our chatroom to connect with other users in real-time!</p>
          <Link
            href="/chatroom"
            className="block bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90"
          >
            Enter Chatroom
          </Link>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  )
}
