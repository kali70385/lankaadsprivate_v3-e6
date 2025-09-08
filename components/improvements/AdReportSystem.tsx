"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Flag, AlertTriangle } from "lucide-react"

interface AdReportSystemProps {
  adId: string
  adTitle: string
}

export function AdReportSystem({ adId, adTitle }: AdReportSystemProps) {
  const [reportType, setReportType] = useState("")
  const [description, setDescription] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const reportTypes = [
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "spam", label: "Spam or Duplicate" },
    { value: "fraud", label: "Fraudulent/Scam" },
    { value: "wrong-category", label: "Wrong Category" },
    { value: "fake-images", label: "Fake/Stolen Images" },
    { value: "overpriced", label: "Extremely Overpriced" },
    { value: "other", label: "Other" },
  ]

  const handleSubmit = () => {
    if (!reportType || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a reason and provide details",
        variant: "destructive",
      })
      return
    }

    const report = {
      adId,
      adTitle,
      reportType,
      description: description.trim(),
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    // Store in localStorage for demo
    const existingReports = JSON.parse(localStorage.getItem("adReports") || "[]")
    existingReports.push(report)
    localStorage.setItem("adReports", JSON.stringify(existingReports))

    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our platform safe. We'll review this report.",
    })

    setIsOpen(false)
    setReportType("")
    setDescription("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
          <Flag className="w-4 h-4 mr-2" />
          Report Ad
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Report This Ad
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Reporting: <span className="font-medium">{adTitle}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reason for reporting</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional details</label>
            <Textarea
              placeholder="Please provide more details about why you're reporting this ad..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700">
              Submit Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
