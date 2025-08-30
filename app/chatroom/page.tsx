"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Smile,
  Send,
  MessageCircle,
  Users,
  ImageIcon,
  ArrowLeft,
  Menu,
  X,
  Volume2,
  VolumeX,
  Settings,
  LogOut,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  isPrivate?: boolean
  recipient?: string
  type: "text" | "image"
  content: string
}

interface ChatUser {
  id: string
  nickname: string
  gender: "female" | "male" | "couple"
  avatar: string
  isOnline?: boolean
  lastActive?: Date
  status: "online" | "away" | "busy" | "offline"
  statusMessage?: string
}

interface ChatRoom {
  id: string
  name: string
  description: string
  memberCount: number
}

// Constants for message limits
const PUBLIC_CHAT_MESSAGE_LIMIT = 500
const PRIVATE_CHAT_MESSAGE_LIMIT = 50
const PRIVATE_CHAT_INACTIVE_TIMEOUT = 6 * 60 * 60 * 1000 // 6 hours in milliseconds

// Status options
const STATUS_OPTIONS = [
  { value: "online", label: "Online", color: "bg-green-500", icon: "🟢" },
  { value: "away", label: "Away", color: "bg-yellow-500", icon: "🟡" },
  { value: "busy", label: "Busy", color: "bg-red-500", icon: "🔴" },
  { value: "offline", label: "Offline", color: "bg-gray-400", icon: "⚫" },
]

export default function ChatroomPage() {
  const [nickname, setNickname] = useState("")
  const [gender, setGender] = useState<"female" | "male" | "couple">("female")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ [key: string]: ChatMessage[] }>({
    public: [],
    boys: [],
    girls: [],
    couple: [],
  })
  const [privateMessages, setPrivateMessages] = useState<{ [key: string]: ChatMessage[] }>({})
  const [privateChatsLastActive, setPrivateChatsLastActive] = useState<{ [key: string]: Date }>({})
  const [privateChatParticipants, setPrivateChatParticipants] = useState<{ [key: string]: string[] }>({})
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([])
  const [activeChat, setActiveChat] = useState("public")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [leaveType, setLeaveType] = useState<"private" | "chatroom" | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // New state for status and notifications
  const [currentUserStatus, setCurrentUserStatus] = useState<"online" | "away" | "busy" | "offline">("online")
  const [statusMessage, setStatusMessage] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showStatusSettings, setShowStatusSettings] = useState(false)
  const [lastMessageCount, setLastMessageCount] = useState(0)

  // Audio refs for notifications
  const messageAudioRef = useRef<HTMLAudioElement | null>(null)
  const joinAudioRef = useRef<HTMLAudioElement | null>(null)

  const { toast } = useToast()

  const chatRooms: ChatRoom[] = [
    { id: "public", name: "Public Chat", description: "General chat room for everyone", memberCount: 24 },
    { id: "boys", name: "Boys Chat", description: "Chat room for boys", memberCount: 12 },
    { id: "girls", name: "Girls Chat", description: "Chat room for girls", memberCount: 8 },
    { id: "couple", name: "Couple Chat", description: "Chat room for couples", memberCount: 4 },
  ]

  const getAvatarUrl = useCallback((gender: "female" | "male" | "couple") => {
    switch (gender) {
      case "female":
        return "https://api.dicebear.com/6.x/avataaars/svg?seed=Lily&hair=long&hairColor=black&skinColor=light&backgroundColor=b6e3f4"
      case "male":
        return "https://api.dicebear.com/6.x/avataaars/svg?seed=Felix&hair=short&hairColor=brown&skinColor=light&backgroundColor=d1d4f9"
      case "couple":
        return "https://api.dicebear.com/6.x/avataaars/svg?seed=Couple&hair=short&hairColor=auburn&skinColor=light&backgroundColor=ffdfbf"
      default:
        return "https://api.dicebear.com/6.x/avataaars/svg?seed=Default&backgroundColor=b6e3f4"
    }
  }, [])

  // Initialize audio elements
  useEffect(() => {
    // Create audio elements for notifications
    messageAudioRef.current = new Audio()
    messageAudioRef.current.preload = "auto"
    // Using a simple beep sound data URL
    messageAudioRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"

    joinAudioRef.current = new Audio()
    joinAudioRef.current.preload = "auto"
    // Different tone for join notifications
    joinAudioRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"

    // Load sound settings from localStorage
    const savedSoundSetting = localStorage.getItem("chatSoundEnabled")
    if (savedSoundSetting !== null) {
      setSoundEnabled(JSON.parse(savedSoundSetting))
    }

    return () => {
      if (messageAudioRef.current) {
        messageAudioRef.current = null
      }
      if (joinAudioRef.current) {
        joinAudioRef.current = null
      }
    }
  }, [])

  // Play notification sound
  const playNotificationSound = useCallback(
    (type: "message" | "join" = "message") => {
      if (!soundEnabled) return

      try {
        const audio = type === "message" ? messageAudioRef.current : joinAudioRef.current
        if (audio) {
          audio.currentTime = 0
          audio.volume = 0.3 // Set volume to 30%
          audio.play().catch((e) => console.log("Audio play failed:", e))
        }
      } catch (error) {
        console.log("Sound notification failed:", error)
      }
    },
    [soundEnabled],
  )

  // Auto-update user status based on activity
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout
    let awayTimer: NodeJS.Timeout

    const resetTimers = () => {
      clearTimeout(inactivityTimer)
      clearTimeout(awayTimer)

      if (currentUserStatus === "away" || currentUserStatus === "offline") {
        setCurrentUserStatus("online")
      }

      // Set to away after 5 minutes of inactivity
      awayTimer = setTimeout(
        () => {
          if (currentUserStatus === "online") {
            setCurrentUserStatus("away")
          }
        },
        5 * 60 * 1000,
      )

      // Set to offline after 15 minutes of inactivity
      inactivityTimer = setTimeout(
        () => {
          setCurrentUserStatus("offline")
        },
        15 * 60 * 1000,
      )
    }

    const handleActivity = () => {
      resetTimers()
    }

    // Listen for user activity
    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keypress", handleActivity)
    window.addEventListener("click", handleActivity)
    window.addEventListener("scroll", handleActivity)

    resetTimers()

    return () => {
      clearTimeout(inactivityTimer)
      clearTimeout(awayTimer)
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keypress", handleActivity)
      window.removeEventListener("click", handleActivity)
      window.removeEventListener("scroll", handleActivity)
    }
  }, [currentUserStatus])

  // Save sound settings to localStorage
  useEffect(() => {
    localStorage.setItem("chatSoundEnabled", JSON.stringify(soundEnabled))
  }, [soundEnabled])

  // Monitor message count for sound notifications
  useEffect(() => {
    const currentMessages = getCurrentMessages()
    const currentCount = currentMessages.length

    if (currentCount > lastMessageCount && lastMessageCount > 0) {
      // New message received, play sound
      const latestMessage = currentMessages[currentCount - 1]
      if (latestMessage && latestMessage.user !== nickname) {
        playNotificationSound("message")
      }
    }

    setLastMessageCount(currentCount)
  }, [messages, privateMessages, activeChat, selectedUser, lastMessageCount, nickname, playNotificationSound])

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("chatUser")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setNickname(user.nickname)
      setGender(user.gender)
      setCurrentUserStatus(user.status || "online")
      setStatusMessage(user.statusMessage || "")
      setIsLoggedIn(true)
    }

    // Initialize users with status
    setOnlineUsers([
      {
        id: "1",
        nickname: "Jake",
        gender: "male",
        avatar: getAvatarUrl("male"),
        isOnline: true,
        status: "online",
      },
      {
        id: "2",
        nickname: "Marco",
        gender: "male",
        avatar: getAvatarUrl("male"),
        isOnline: true,
        status: "busy",
        statusMessage: "In a meeting",
      },
      {
        id: "3",
        nickname: "Sheena",
        gender: "female",
        avatar: getAvatarUrl("female"),
        isOnline: true,
        status: "online",
      },
      {
        id: "4",
        nickname: "Jen",
        gender: "female",
        avatar: getAvatarUrl("female"),
        isOnline: true,
        status: "away",
        statusMessage: "Be back soon",
      },
      {
        id: "5",
        nickname: "Mike",
        gender: "male",
        avatar: getAvatarUrl("male"),
        isOnline: false,
        status: "offline",
      },
      {
        id: "6",
        nickname: "Ashley",
        gender: "female",
        avatar: getAvatarUrl("female"),
        isOnline: true,
        status: "online",
      },
      {
        id: "7",
        nickname: "Myra",
        gender: "female",
        avatar: getAvatarUrl("female"),
        isOnline: true,
        status: "away",
      },
    ])

    // Initialize sample messages
    setMessages({
      public: [
        {
          id: "1",
          user: "Jake",
          message: "Hello everyone!",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          type: "text",
          content: "Hello everyone!",
        },
        {
          id: "2",
          user: "Marco",
          message: "Hey Jake, welcome!",
          timestamp: new Date(Date.now() - 1000 * 60 * 4),
          type: "text",
          content: "Hey Jake, welcome!",
        },
      ],
      boys: [],
      girls: [],
      couple: [],
    })
  }, [getAvatarUrl])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, privateMessages, activeChat, selectedUser])

  // Close mobile sidebar when chat selection changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [activeChat, selectedUser])

  // Message cleanup and limits enforcement
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()

      // Enforce message limits for public chats and remove old messages
      setMessages((prevMessages) => {
        const updatedMessages: typeof prevMessages = {}
        Object.entries(prevMessages).forEach(([roomId, roomMessages]) => {
          // If room exceeds message limit, remove oldest messages
          if (roomMessages.length > PUBLIC_CHAT_MESSAGE_LIMIT) {
            updatedMessages[roomId] = roomMessages.slice(-PUBLIC_CHAT_MESSAGE_LIMIT)
          } else {
            updatedMessages[roomId] = roomMessages
          }
        })
        return updatedMessages
      })

      // Check for inactive private chats and enforce message limits
      setPrivateMessages((prevPrivateMessages) => {
        const updatedPrivateMessages: typeof prevPrivateMessages = {}
        Object.entries(prevPrivateMessages).forEach(([userId, userMessages]) => {
          // Check if this private chat is inactive for more than 6 hours
          const lastActive = privateChatsLastActive[userId] || now
          const timeSinceActive = now.getTime() - lastActive.getTime()

          if (timeSinceActive > PRIVATE_CHAT_INACTIVE_TIMEOUT) {
            // Delete inactive chat completely
            console.log(`Removing inactive private chat with ${userId}`)
            // Don't add this chat to updatedPrivateMessages
          } else {
            // Enforce message limit for active chats
            if (userMessages.length > PRIVATE_CHAT_MESSAGE_LIMIT) {
              updatedPrivateMessages[userId] = userMessages.slice(-PRIVATE_CHAT_MESSAGE_LIMIT)
            } else {
              updatedPrivateMessages[userId] = userMessages
            }
          }
        })
        return updatedPrivateMessages
      })

      // Update the last active timestamps for private chats that were removed
      setPrivateChatsLastActive((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((userId) => {
          if (!privateMessages[userId]) {
            delete updated[userId]
          }
        })
        return updated
      })

      // Clean up private chat participants for deleted chats
      setPrivateChatParticipants((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((userId) => {
          if (!privateMessages[userId]) {
            delete updated[userId]
          }
        })
        return updated
      })
    }, 60 * 1000) // Run every minute

    return () => clearInterval(interval)
  }, [privateMessages, privateChatsLastActive])

  const handleLogin = () => {
    if (nickname) {
      const newUser = {
        id: Date.now().toString(),
        nickname,
        gender,
        avatar: getAvatarUrl(gender),
        isOnline: true,
        status: currentUserStatus,
        statusMessage,
      }
      setIsLoggedIn(true)

      // Add current user to online users list, removing any existing entry first
      setOnlineUsers((prevUsers) => {
        const filteredUsers = prevUsers.filter((user) => user.nickname !== nickname)
        return [newUser, ...filteredUsers]
      })

      // Save user info to localStorage
      localStorage.setItem(
        "chatUser",
        JSON.stringify({
          nickname,
          gender,
          status: currentUserStatus,
          statusMessage,
        }),
      )

      // Play join sound
      playNotificationSound("join")
    }
  }

  const handleStatusChange = (newStatus: "online" | "away" | "busy" | "offline") => {
    setCurrentUserStatus(newStatus)

    // Update user in online users list
    setOnlineUsers((prevUsers) =>
      prevUsers.map((user) => (user.nickname === nickname ? { ...user, status: newStatus, statusMessage } : user)),
    )

    // Update localStorage
    const savedUser = localStorage.getItem("chatUser")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      localStorage.setItem(
        "chatUser",
        JSON.stringify({
          ...user,
          status: newStatus,
          statusMessage,
        }),
      )
    }

    setShowStatusSettings(false)
  }

  const handleStatusMessageChange = (newMessage: string) => {
    setStatusMessage(newMessage)

    // Update user in online users list
    setOnlineUsers((prevUsers) =>
      prevUsers.map((user) => (user.nickname === nickname ? { ...user, statusMessage: newMessage } : user)),
    )

    // Update localStorage
    const savedUser = localStorage.getItem("chatUser")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      localStorage.setItem(
        "chatUser",
        JSON.stringify({
          ...user,
          statusMessage: newMessage,
        }),
      )
    }
  }

  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find((option) => option.value === status) || STATUS_OPTIONS[0]
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: nickname,
        message: message.trim(),
        timestamp: new Date(),
        type: "text",
        content: message.trim(),
      }

      if (selectedUser) {
        // Update private messages
        setPrivateMessages((prev) => {
          const currentMessages = prev[selectedUser] || []
          // If we're at the limit, remove the oldest message
          const updatedMessages =
            currentMessages.length >= PRIVATE_CHAT_MESSAGE_LIMIT
              ? [...currentMessages.slice(1), newMessage]
              : [...currentMessages, newMessage]

          return {
            ...prev,
            [selectedUser]: updatedMessages,
          }
        })

        // Update last active timestamp for this private chat
        setPrivateChatsLastActive((prev) => ({
          ...prev,
          [selectedUser]: new Date(),
        }))

        // Track participants in this private chat
        setPrivateChatParticipants((prev) => ({
          ...prev,
          [selectedUser]: [nickname, selectedUser],
        }))
      } else {
        // Update public room messages
        setMessages((prev) => {
          const currentRoomMessages = prev[activeChat] || []
          // If we're at the limit, remove the oldest message
          const updatedRoomMessages =
            currentRoomMessages.length >= PUBLIC_CHAT_MESSAGE_LIMIT
              ? [...currentRoomMessages.slice(1), newMessage]
              : [...currentRoomMessages, newMessage]

          return {
            ...prev,
            [activeChat]: updatedRoomMessages,
          }
        })
      }
      setMessage("")
      setShowEmojiPicker(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native)
    setShowEmojiPicker(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("Image selected:", file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          user: nickname,
          message: "Sent an image",
          timestamp: new Date(),
          type: "image",
          content: reader.result as string,
        }

        if (selectedUser) {
          // Update private messages with image
          setPrivateMessages((prev) => {
            const currentMessages = prev[selectedUser] || []
            // If we're at the limit, remove the oldest message
            const updatedMessages =
              currentMessages.length >= PRIVATE_CHAT_MESSAGE_LIMIT
                ? [...currentMessages.slice(1), newMessage]
                : [...currentMessages, newMessage]

            return {
              ...prev,
              [selectedUser]: updatedMessages,
            }
          })

          // Update last active timestamp for this private chat
          setPrivateChatsLastActive((prev) => ({
            ...prev,
            [selectedUser]: new Date(),
          }))

          // Track participants in this private chat
          setPrivateChatParticipants((prev) => ({
            ...prev,
            [selectedUser]: [nickname, selectedUser],
          }))
        } else {
          // Update public room messages with image
          setMessages((prev) => {
            const currentRoomMessages = prev[activeChat] || []
            // If we're at the limit, remove the oldest message
            const updatedRoomMessages =
              currentRoomMessages.length >= PUBLIC_CHAT_MESSAGE_LIMIT
                ? [...currentRoomMessages.slice(1), newMessage]
                : [...currentRoomMessages, newMessage]

            return {
              ...prev,
              [activeChat]: updatedRoomMessages,
            }
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLeavePrivateChat = () => {
    if (!selectedUser) return

    // Add a system message to the private chat with different styling
    const leaveMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "System",
      message: `${nickname} left the chat`,
      timestamp: new Date(),
      type: "text",
      content: `${nickname} left the chat`,
    }

    setPrivateMessages((prev) => {
      const currentMessages = prev[selectedUser] || []
      const updatedMessages =
        currentMessages.length >= PRIVATE_CHAT_MESSAGE_LIMIT
          ? [...currentMessages.slice(1), leaveMessage]
          : [...currentMessages, leaveMessage]

      return {
        ...prev,
        [selectedUser]: updatedMessages,
      }
    })

    // Remove current user from participants
    setPrivateChatParticipants((prev) => {
      const participants = prev[selectedUser] || []
      const updatedParticipants = participants.filter((p) => p !== nickname)

      // If no participants left, delete the chat entirely
      if (updatedParticipants.length === 0) {
        // Delete the private chat completely
        setPrivateMessages((prevMessages) => {
          const updated = { ...prevMessages }
          delete updated[selectedUser]
          return updated
        })

        setPrivateChatsLastActive((prevActive) => {
          const updated = { ...prevActive }
          delete updated[selectedUser]
          return updated
        })

        // Don't update participants, just return previous state without this chat
        const updated = { ...prev }
        delete updated[selectedUser]
        return updated
      }

      return {
        ...prev,
        [selectedUser]: updatedParticipants,
      }
    })

    // Clear the private chat selection
    setSelectedUser(null)
    setActiveChat("public")
    setShowLeaveConfirm(false)
    setLeaveType(null)

    toast({
      title: "Left Private Chat",
      description: `You have left the private chat with ${selectedUser}`,
    })
  }

  const handleLeaveChatroom = () => {
    // Clear all user data and return to login
    localStorage.removeItem("chatUser")
    setIsLoggedIn(false)
    setNickname("")
    setGender("female")
    setCurrentUserStatus("online")
    setStatusMessage("")
    setActiveChat("public")
    setSelectedUser(null)
    setShowLeaveConfirm(false)
    setLeaveType(null)

    // Remove user from online users list
    setOnlineUsers((prevUsers) => prevUsers.filter((user) => user.nickname !== nickname))

    toast({
      title: "Left Chatroom",
      description: "You have been logged out of the chatroom",
    })
  }

  const confirmLeave = () => {
    if (leaveType === "private") {
      handleLeavePrivateChat()
    } else if (leaveType === "chatroom") {
      handleLeaveChatroom()
    }
  }

  const getCurrentMessages = () => {
    if (selectedUser) {
      return privateMessages[selectedUser] || []
    }
    return messages[activeChat] || []
  }

  // Update last active timestamp when switching to a private chat
  useEffect(() => {
    if (selectedUser) {
      setPrivateChatsLastActive((prev) => ({
        ...prev,
        [selectedUser]: new Date(),
      }))

      // Track participants in this private chat
      setPrivateChatParticipants((prev) => ({
        ...prev,
        [selectedUser]: [nickname, selectedUser],
      }))
    }
  }, [selectedUser, nickname])

  // Add current user to online list when logging in from saved data
  useEffect(() => {
    if (isLoggedIn && nickname) {
      const currentUser = {
        id: `current-${Date.now()}`,
        nickname,
        gender,
        avatar: getAvatarUrl(gender),
        isOnline: true,
        status: currentUserStatus,
        statusMessage,
      }

      setOnlineUsers((prevUsers) => {
        // Check if current user is already in the list
        const userExists = prevUsers.some((user) => user.nickname === nickname)
        if (!userExists) {
          return [currentUser, ...prevUsers]
        }
        return prevUsers.map((user) =>
          user.nickname === nickname ? { ...user, status: currentUserStatus, statusMessage } : user,
        )
      })
    }
  }, [isLoggedIn, nickname, gender, getAvatarUrl, currentUserStatus, statusMessage])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 to-red-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold text-rose-800 mb-6 text-center">Join Chat</h2>
          <Input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mb-4"
          />
          <Select value={gender} onValueChange={(value: "female" | "male" | "couple") => setGender(value)}>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="couple">Couple</SelectItem>
            </SelectContent>
          </Select>

          {/* Initial Status Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Initial Status</label>
            <Select
              value={currentUserStatus}
              onValueChange={(value: "online" | "away" | "busy" | "offline") => setCurrentUserStatus(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${status.color}`}></span>
                      <span>{status.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            type="text"
            placeholder="Status message (optional)"
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            className="mb-4"
          />

          <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">
            Enter Chat
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-rose-50 to-rose-100 overflow-hidden relative">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between relative z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Go back to main site (homepage/ad system)
            window.location.href = "/"
          }}
          className="text-primary hover:text-primary/90 p-2"
          title="Back to Homepage"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold truncate mx-4">
          {selectedUser ? `Chat with ${selectedUser}` : chatRooms.find((r) => r.id === activeChat)?.name || "Chat"}
        </h1>
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2"
            title={soundEnabled ? "Disable sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Desktop Back Button */}
      <Button
        variant="ghost"
        onClick={() => {
          // Go back to main site (homepage/ad system)
          window.location.href = "/"
        }}
        className="hidden md:block absolute top-4 left-4 text-primary hover:text-primary/90 z-10 p-2"
        title="Back to Homepage"
      >
        <ArrowLeft className="w-6 h-6" />
        <span className="sr-only">Back to main site</span>
      </Button>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsMobileSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div
          className={`
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
          fixed md:relative 
          left-0 top-0 
          w-80 md:w-64 
          h-full md:h-auto
          bg-white 
          border-r 
          flex-shrink-0 
          flex flex-col 
          transition-transform duration-300 ease-in-out
          z-40 md:z-auto
          pt-16 md:pt-0
        `}
        >
          {/* User Status Section */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={getAvatarUrl(gender) || "/placeholder.svg"} />
                  <AvatarFallback>{nickname[0]}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${getStatusInfo(currentUserStatus).color}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{nickname}</div>
                <div className="text-xs text-gray-500 truncate">
                  {statusMessage || getStatusInfo(currentUserStatus).label}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStatusSettings(!showStatusSettings)}
                className="p-1"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {/* Status Settings */}
            {showStatusSettings && (
              <div className="space-y-3 p-3 bg-white rounded-lg border">
                <div>
                  <label className="block text-xs font-medium mb-1">Status</label>
                  <div className="grid grid-cols-2 gap-1">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusChange(status.value as any)}
                        className={`flex items-center gap-2 p-2 rounded text-xs ${
                          currentUserStatus === status.value
                            ? "bg-primary/10 border border-primary"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                        <span>{status.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Status Message</label>
                  <Input
                    type="text"
                    placeholder="What's on your mind?"
                    value={statusMessage}
                    onChange={(e) => handleStatusMessageChange(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Sound Notifications</label>
                  <Button variant="ghost" size="sm" onClick={() => setSoundEnabled(!soundEnabled)} className="p-1">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Tabs defaultValue="rooms" className="h-full flex flex-col">
            <TabsList className="h-auto w-full justify-start rounded-none border-b p-0 bg-white">
              <TabsTrigger value="rooms" className="flex items-center gap-2 px-4 py-3 text-sm">
                <MessageCircle className="w-4 h-4" />
                Rooms
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 px-4 py-3 text-sm">
                <Users className="w-4 h-4" />
                Users ({onlineUsers.filter((u) => u.status !== "offline").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rooms" className="flex-grow overflow-auto h-full m-0">
              <ScrollArea className="h-full">
                {chatRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveChat(room.id)
                      setSelectedUser(null)
                    }}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-primary/5 border-b ${
                      activeChat === room.id && !selectedUser ? "bg-primary/10" : ""
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium truncate">{room.name}</div>
                      <div className="text-xs text-gray-500">{room.memberCount} members</div>
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="users" className="flex-grow overflow-auto h-full m-0">
              <ScrollArea className="h-full">
                {onlineUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      if (user.nickname !== nickname) {
                        setSelectedUser(user.nickname)
                        setActiveChat("")
                      }
                    }}
                    disabled={user.nickname === nickname}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-primary/5 border-b ${
                      selectedUser === user.nickname ? "bg-primary/10" : ""
                    } ${user.nickname === nickname ? "opacity-75 cursor-default bg-primary/5" : ""}`}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusInfo(user.status).color}`}
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium truncate">
                        {user.nickname}
                        {user.nickname === nickname && (
                          <span className="text-xs text-primary ml-2 font-normal">(me)</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 capitalize truncate">
                        {user.statusMessage || getStatusInfo(user.status).label} • {user.gender}
                      </div>
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Chat Area */}
        <div className="flex-grow flex flex-col bg-white overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:flex border-b p-4 items-center justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold truncate">
                {selectedUser ? `Chat with ${selectedUser}` : chatRooms.find((r) => r.id === activeChat)?.name}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {selectedUser
                  ? `Private chats are limited to ${PRIVATE_CHAT_MESSAGE_LIMIT} messages and will be deleted after 6 hours of inactivity`
                  : `Public chat rooms are limited to ${PUBLIC_CHAT_MESSAGE_LIMIT} messages`}
              </p>
            </div>

            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              {/* Sound Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2"
                title={soundEnabled ? "Disable sounds" : "Enable sounds"}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>

              {/* Leave Private Chat Button (only for private chats) */}
              {selectedUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLeaveType("private")
                    setShowLeaveConfirm(true)
                  }}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  Leave Private Chat
                </Button>
              )}

              {/* Leave Chatroom Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLeaveType("chatroom")
                  setShowLeaveConfirm(true)
                }}
                className="text-red-600 border-red-200 hover:bg-red-50"
                title="Leave chatroom and logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Chatroom
              </Button>
            </div>
          </div>

          {/* Mobile Leave Button */}
          <div className="md:hidden bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
            <p className="text-xs text-gray-500 flex-1 mr-2">
              {selectedUser
                ? `Private chat • ${PRIVATE_CHAT_MESSAGE_LIMIT} msg limit`
                : `Public room • ${PUBLIC_CHAT_MESSAGE_LIMIT} msg limit`}
            </p>
            <div className="flex items-center gap-2">
              {/* Leave Private Chat (mobile) */}
              {selectedUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLeaveType("private")
                    setShowLeaveConfirm(true)
                  }}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs px-2 py-1 h-auto"
                >
                  Leave Chat
                </Button>
              )}

              {/* Leave Chatroom (mobile) */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLeaveType("chatroom")
                  setShowLeaveConfirm(true)
                }}
                className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-2 py-1 h-auto"
                title="Leave chatroom"
              >
                <LogOut className="w-3 h-3 mr-1" />
                Leave
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-grow p-3 md:p-4">
            <div className="space-y-3 md:space-y-4">
              {getCurrentMessages().map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 md:gap-3 ${
                    msg.user === "System" ? "justify-center" : msg.user === nickname ? "flex-row-reverse" : ""
                  }`}
                >
                  {msg.user !== "System" && (
                    <div className="relative">
                      <Avatar className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0">
                        <AvatarImage
                          src={onlineUsers.find((u) => u.nickname === msg.user)?.avatar || getAvatarUrl("male")}
                        />
                        <AvatarFallback className="text-xs">{msg.user[0]}</AvatarFallback>
                      </Avatar>
                      {/* Status indicator on avatar */}
                      {onlineUsers.find((u) => u.nickname === msg.user) && (
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 rounded-full border border-white ${
                            getStatusInfo(onlineUsers.find((u) => u.nickname === msg.user)?.status || "offline").color
                          }`}
                        />
                      )}
                    </div>
                  )}
                  <div
                    className={`flex flex-col ${
                      msg.user === "System" ? "items-center" : msg.user === nickname ? "items-end" : "items-start"
                    } max-w-[85%] md:max-w-[70%] min-w-0`}
                  >
                    {msg.user !== "System" && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs md:text-sm truncate">{msg.user}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    )}
                    {msg.user === "System" && (
                      <div
                        className={`rounded-lg p-2 md:p-3 max-w-full ${
                          msg.message.includes("left the chat")
                            ? "bg-red-100 text-red-700 text-xs md:text-sm italic border border-red-200"
                            : msg.message.includes("joined") || msg.message.includes("entered")
                              ? "bg-green-100 text-green-700 text-xs md:text-sm italic border border-green-200"
                              : "bg-gray-200 text-gray-600 text-xs md:text-sm italic"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm md:text-base break-words">{msg.content}</p>
                      </div>
                    )}
                    {msg.user === "System" && (
                      <span className="text-xs text-gray-400 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    {msg.user !== "System" && (
                      <div
                        className={`rounded-lg p-2 md:p-3 max-w-full ${
                          msg.user === nickname
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {msg.type === "image" ? (
                          <img
                            src={msg.content || "/placeholder.svg"}
                            alt="Shared image"
                            className="max-w-full h-auto rounded-lg"
                            style={{ maxHeight: "200px" }}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap text-sm md:text-base break-words">{msg.content}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-3 md:p-4 bg-white relative">
            {showEmojiPicker && (
              <div className="absolute bottom-full right-4 mb-2 z-10">
                <div className="bg-white border rounded-lg p-3 shadow-lg">
                  <div className="grid grid-cols-6 md:grid-cols-8 gap-1">
                    {["😀", "😂", "😍", "🥰", "😊", "😎", "🙄", "😴", "❤️", "👍", "👎", "🔥"].map((emoji) => (
                      <button
                        key={emoji}
                        className="text-lg md:text-2xl hover:bg-gray-100 p-1 rounded"
                        onClick={() => handleEmojiSelect({ native: emoji })}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/90 p-2 flex-shrink-0"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/90 p-2 flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 text-sm md:text-base"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-primary hover:bg-primary/90 p-2 md:px-4 flex-shrink-0"
                size="sm"
              >
                <Send className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>
      </div>

      {/* Leave Confirmation Dialog */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {leaveType === "private" ? "Leave Private Chat?" : "Leave Chatroom?"}
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              {leaveType === "private"
                ? `Are you sure you want to leave the private chat with ${selectedUser}? The other user will be notified and if both users leave, the chat will be deleted.`
                : "Are you sure you want to leave the chatroom? You will be logged out and need to sign in again."}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowLeaveConfirm(false)
                  setLeaveType(null)
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={confirmLeave}>
                {leaveType === "private" ? "Leave Chat" : "Leave Chatroom"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
