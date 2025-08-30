"use client"

import { useState, useEffect } from "react"
import { Users, MessageSquare, ShoppingBag, Clock } from "lucide-react"

export function SiteStatistics() {
  const [stats, setStats] = useState({
    users: 0,
    ads: 0,
    messages: 0,
    online: 0,
  })

  useEffect(() => {
    // In a real app, you'd fetch these from an API
    // For now, we'll generate some random numbers and animate them
    const targetStats = {
      users: 1250 + Math.floor(Math.random() * 200),
      ads: 450 + Math.floor(Math.random() * 100),
      messages: 3200 + Math.floor(Math.random() * 500),
      online: 25 + Math.floor(Math.random() * 15),
    }

    const interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users < targetStats.users ? prev.users + 5 : prev.users,
        ads: prev.ads < targetStats.ads ? prev.ads + 2 : prev.ads,
        messages: prev.messages < targetStats.messages ? prev.messages + 20 : prev.messages,
        online: prev.online < targetStats.online ? prev.online + 1 : prev.online,
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center text-center">
        <Users className="w-8 h-8 text-primary mb-2" />
        <span className="text-2xl font-bold">{stats.users.toLocaleString()}</span>
        <span className="text-sm text-gray-500">Registered Users</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center text-center">
        <ShoppingBag className="w-8 h-8 text-primary mb-2" />
        <span className="text-2xl font-bold">{stats.ads.toLocaleString()}</span>
        <span className="text-sm text-gray-500">Active Ads</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center text-center">
        <MessageSquare className="w-8 h-8 text-primary mb-2" />
        <span className="text-2xl font-bold">{stats.messages.toLocaleString()}</span>
        <span className="text-sm text-gray-500">Messages Sent</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center text-center">
        <Clock className="w-8 h-8 text-primary mb-2" />
        <span className="text-2xl font-bold">{stats.online.toLocaleString()}</span>
        <span className="text-sm text-gray-500">Users Online</span>
      </div>
    </div>
  )
}
