import Link from "next/link"
import Image from "next/image"
import { Calendar, User } from "lucide-react"

export function RecentBlogPosts() {
  const posts = [
    {
      id: 1,
      title: "Tips for Creating an Attractive Profile",
      excerpt: "Learn how to create a profile that stands out and attracts the right connections.",
      image: "/placeholder.svg?height=200&width=300",
      date: "March 15, 2023",
      author: "Admin",
    },
    {
      id: 2,
      title: "Safety First: Meeting New People",
      excerpt: "Important safety tips to keep in mind when meeting someone from our platform.",
      image: "/placeholder.svg?height=200&width=300",
      date: "February 28, 2023",
      author: "Safety Team",
    },
    {
      id: 3,
      title: "New Features Coming to LankaAdsPrivate",
      excerpt: "Exciting new features we're working on to improve your experience.",
      image: "/placeholder.svg?height=200&width=300",
      date: "January 20, 2023",
      author: "Development Team",
    },
  ]

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary/90">Latest Articles</h2>
        <Link href="/blog" className="text-primary hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-40">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  <span>{post.author}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
