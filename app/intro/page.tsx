import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function IntroductionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-100 to-rose-50 p-4">
      <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixelcut-export.jpg-RBsZHWXkPaSfaBLy6hdGosvvWBIiwr.jpeg"
            alt=""
            fill
            className="object-cover object-center opacity-100"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[1px]" />
        </div>
        <div className="relative z-10 text-center px-4 py-16">
          <h1 className="text-4xl font-bold text-white mb-4">LankaAdsPrivate</h1>
          <h2 className="text-2xl font-semibold text-primary-foreground mb-6">
            Sri Lanka's First AI-Powered Private Platform
          </h2>
          <div className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto space-y-4">
            <p>
              Discover a world of connections, services, and products. Join our vibrant community for real-time
              discussions and exciting opportunities.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xs mx-auto sm:max-w-none">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full text-lg font-semibold">
                Lanka Ads
              </Button>
            </Link>
            <Link href="/chatroom" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full text-lg font-semibold">
                Join Chatroom
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
