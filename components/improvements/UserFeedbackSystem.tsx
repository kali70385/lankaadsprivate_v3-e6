"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Star } from "lucide-react"

interface FeedbackSystemProps {
  type: "ad" | "chat" | "general"
  targetId?: string
}

export function UserFeedbackSystem({ type, targetId }: FeedbackSystemProps) {
  const [feedbackType, setFeedbackType] = useState("")
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = () => {
    // In a real app, this would send to a backend
    const feedback = {
      type: feedbackType,
      message,
      rating,
      targetId,
      timestamp: new Date().toISOString(),
      systemType: type,
    }

    // Store in localStorage for demo
    const existingFeedback = JSON.parse(localStorage.getItem("userFeedback") || "[]")
    existingFeedback.push(feedback)
    localStorage.setItem("userFeedback", JSON.stringify(existingFeedback))

    toast({
      title: "Feedback Submitted",
      description: "Thank you for helping us improve!",
    })

    setIsOpen(false)
    setMessage("")
    setRating(0)
    setFeedbackType("")
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-white hover:bg-primary/90"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Feedback
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border rounded-lg shadow-lg p-4 w-80">
      <h3 className="font-semibold mb-3">Help Us Improve</h3>

      <div className="space-y-3">
        <Select value={feedbackType} onValueChange={setFeedbackType}>
          <SelectTrigger>
            <SelectValue placeholder="What's this about?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bug">🐛 Bug Report</SelectItem>
            <SelectItem value="feature">💡 Feature Request</SelectItem>
            <SelectItem value="improvement">⚡ Improvement Suggestion</SelectItem>
            <SelectItem value="complaint">😞 Complaint</SelectItem>
            <SelectItem value="praise">👏 Praise</SelectItem>
          </SelectContent>
        </Select>

        {feedbackType === "praise" && (
          <div className="flex items-center gap-1">
            <span className="text-sm">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            ))}
          </div>
        )}

        <Textarea placeholder="Tell us more..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />

        <div className="flex gap-2">
          <Button size="sm" onClick={handleSubmit} disabled={!feedbackType || !message}>
            Submit
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
