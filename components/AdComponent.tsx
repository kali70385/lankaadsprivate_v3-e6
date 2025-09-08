import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Clock } from "lucide-react"

interface Ad {
  id: number | string
  title: string
  description: string
  price: number
  images: string[]
  contactNumber: string
  isWhatsApp: boolean
  isViber: boolean
  category: string
  createdAt: string
  district?: string
  city?: string
}

export default function AdComponent({ ad }: { ad: Ad }) {
  const createdDate = new Date(ad.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - createdDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let timeAgo
  if (diffDays === 0) {
    timeAgo = "Today"
  } else if (diffDays === 1) {
    timeAgo = "Yesterday"
  } else {
    timeAgo = `${diffDays} days ago`
  }

  return (
    <Link href={`/ad/${ad.id}`} className="block w-full">
      <div className="w-full h-32 sm:h-36 border border-rose-100 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Fixed rectangular layout - horizontal always */}
        <div className="flex h-full w-full">
          {/* Left side - Image (fixed width) */}
          <div className="w-28 sm:w-32 md:w-36 h-full relative flex-shrink-0">
            <Image
              src={ad.images && ad.images.length > 0 ? ad.images[0] : "/placeholder.svg"}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
            />
          </div>

          {/* Right side - Details (flexible width with clean layout) */}
          <div className="flex-1 p-3 sm:p-4 min-w-0 flex flex-col justify-between overflow-hidden">
            {/* Top section - Main content */}
            <div className="flex-1 min-h-0 space-y-1 sm:space-y-2">
              {/* Title - prominent display */}
              <h3 className="text-sm sm:text-base font-semibold text-primary line-clamp-2 break-words leading-tight">
                {ad.title}
              </h3>

              {/* Description - flexible space */}
              <p className="text-xs sm:text-sm text-primary/80 line-clamp-2 break-words leading-relaxed">
                {ad.description}
              </p>
            </div>

            {/* Bottom section - Fixed info bar */}
            <div className="flex-shrink-0 mt-2">
              {/* Price - most prominent */}
              <div className="mb-2">
                <p className="text-base sm:text-lg md:text-xl font-bold text-primary">
                  Rs. {ad.price.toLocaleString()}
                </p>
              </div>

              {/* Info row - Category, Location, Time, Apps */}
              <div className="flex items-center justify-between text-xs text-gray-600">
                {/* Left side - Category and Location */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {/* Category */}
                  <div className="flex items-center min-w-0">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary/60 mr-1 flex-shrink-0"></span>
                    <span className="font-medium truncate">
                      {ad.category
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </span>
                  </div>

                  {/* Location */}
                  {ad.district && (
                    <div className="flex items-center min-w-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-primary/80 mr-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span className="text-primary/80 truncate max-w-20 sm:max-w-24">
                        {ad.city ? `${ad.city}, ${ad.district}` : ad.district}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right side - Time and Apps */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* Time */}
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-gray-500" />
                    <span className="text-gray-500">{timeAgo}</span>
                  </div>

                  {/* Apps */}
                  <div className="flex items-center space-x-1">
                    {ad.isWhatsApp && (
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" title="WhatsApp available" />
                    )}
                    {ad.isViber && (
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        title="Viber available"
                      >
                        <path d="M11.4.8C5.1.8 0 5.9 0 12.2c0 2.8 1 5.4 2.7 7.4l-.7 3.1 3.2-.7c1.9 1.5 4.3 2.4 6.9 2.4 6.3 0 11.4-5.1 11.4-11.4S17.7.8 11.4.8zm6.8 14.7c-.3.8-1.5 1.5-2.4 1.7-.6.1-1.4.2-4.1-.9-3.4-1.4-5.6-4.8-5.8-5-.2-.2-1.6-2.1-1.6-4.1 0-2 1-2.9 1.4-3.3.3-.3.7-.4 1-.4h.7c.3 0 .6 0 .8.7.3.7 1 2.5 1.1 2.7.1.2.2.4 0 .7-.1.3-.2.4-.4.6-.2.2-.4.4-.5.5-.2.2-.4.4-.2.7.2.4.9 1.6 2 2.6 1.4 1.3 2.6 1.7 3 1.9.3.1.6.1.8-.1.2-.3.9-1.1 1.2-1.5.2-.3.5-.3.8-.2.3.1 2.1 1 2.4 1.2.3.2.6.3.7.5.1.1.1.7-.2 1.5z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
