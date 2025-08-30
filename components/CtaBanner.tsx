import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/90 to-primary rounded-lg shadow-md p-8 mb-12 text-white text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Connect?</h2>
      <p className="mb-6 max-w-2xl mx-auto">
        Join thousands of Sri Lankans who have found meaningful connections on our platform. Post your ad today and
        start your journey!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/post-ad">
          <Button className="bg-white text-primary hover:bg-white/90 px-6 py-2 rounded-full text-lg font-semibold">
            Post an Ad
          </Button>
        </Link>
        <Link href="/chatroom">
          <Button className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-2 rounded-full text-lg font-semibold">
            Join Chatroom
          </Button>
        </Link>
      </div>
    </div>
  )
}
