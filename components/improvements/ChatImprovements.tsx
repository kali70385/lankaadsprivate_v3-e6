"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Search, UserX, Shield, Download, Bell, BellOff } from "lucide-react"

interface ChatUser {
  id: string
  nickname: string
  isBlocked?: boolean
}

export function ChatUserManagement() {
  const [blockedUsers, setBlockedUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load blocked users from localStorage
    const blocked = JSON.parse(localStorage.getItem("blockedUsers") || "[]")
    setBlockedUsers(blocked)

    // Load notification preference
    const notifPref = localStorage.getItem("chatNotifications")
    if (notifPref !== null) {
      setNotificationsEnabled(JSON.parse(notifPref))
    }
  }, [])

  const blockUser = (username: string) => {
    const updated = [...blockedUsers, username]
    setBlockedUsers(updated)
    localStorage.setItem("blockedUsers", JSON.stringify(updated))

    toast({
      title: "User Blocked",
      description: `${username} has been blocked and won't be able to message you`,
    })
  }

  const unblockUser = (username: string) => {
    const updated = blockedUsers.filter((u) => u !== username)
    setBlockedUsers(updated)
    localStorage.setItem("blockedUsers", JSON.stringify(updated))

    toast({
      title: "User Unblocked",
      description: `${username} has been unblocked`,
    })
  }

  const exportChatHistory = () => {
    // Get all messages from localStorage
    const messages = JSON.parse(localStorage.getItem("chatMessages") || "[]")
    const privateMessages = JSON.parse(localStorage.getItem("privateMessages") || "{}")

    const exportData = {
      publicMessages: messages,
      privateMessages: privateMessages,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-history-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Chat History Exported",
      description: "Your chat history has been downloaded",
    })
  }

  const toggleNotifications = () => {
    const newState = !notificationsEnabled
    setNotificationsEnabled(newState)
    localStorage.setItem("chatNotifications", JSON.stringify(newState))

    toast({
      title: newState ? "Notifications Enabled" : "Notifications Disabled",
      description: newState ? "You'll receive chat notifications" : "Chat notifications are turned off",
    })
  }

  return (
    <div className="space-y-4">
      {/* Chat Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleNotifications}
          className="flex items-center gap-2 bg-transparent"
        >
          {notificationsEnabled ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          {notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={exportChatHistory}
          className="flex items-center gap-2 bg-transparent"
        >
          <Download className="w-4 h-4" />
          Export History
        </Button>
      </div>

      {/* Blocked Users Management */}
      {blockedUsers.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Blocked Users ({blockedUsers.length})
          </h3>
          <div className="space-y-2">
            {blockedUsers.map((username) => (
              <div key={username} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{username}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => unblockUser(username)}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  Unblock
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Enhanced Message Component with reactions and more features
export function EnhancedMessage({ message, onReact, onBlock, currentUser }: any) {
  const [showActions, setShowActions] = useState(false)
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"]

  return (
    <div
      className="group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Original message content */}
      <div className="message-content">{/* Message content here */}</div>

      {/* Message Actions */}
      {showActions && message.user !== currentUser && (
        <div className="absolute top-0 right-0 flex items-center gap-1 bg-white border rounded-lg shadow-sm p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Quick Reactions */}
          {reactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReact(message.id, emoji)}
              className="hover:bg-gray-100 p-1 rounded text-sm"
            >
              {emoji}
            </button>
          ))}

          {/* Block User */}
          <button
            onClick={() => onBlock(message.user)}
            className="hover:bg-red-100 p-1 rounded text-red-600"
            title="Block User"
          >
            <UserX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
