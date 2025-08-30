import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import type React from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { GlobalStyles } from "@/components/GlobalStyles"
import { SlidingAdSpace } from "@/components/SlidingAdSpace"
import { BackgroundDesign } from "@/components/BackgroundDesign"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LankaAdsPrivate - Connections & More",
  description: "Find personal connections and services in Sri Lanka",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen overflow-x-hidden`}>
        <BackgroundDesign />
        <div className="relative min-h-screen">
          <div className="relative z-10">
            <ErrorBoundary>
              <AuthProvider>
                <Header />
                {/* Leaderboard Ad Space */}
                <div className="w-full bg-white/80 backdrop-blur-sm text-center py-2 px-2 sm:px-4 shadow-sm">
                  <div className="max-w-[728px] h-[60px] sm:h-[90px] mx-auto bg-gray-300 flex items-center justify-center rounded">
                    <span className="text-gray-600 text-xs sm:text-sm">Leaderboard Ad Space</span>
                  </div>
                </div>
                <div className="container mx-auto px-2 sm:px-4 py-2">
                  <Link href="/intro" className="text-rose-600 hover:text-rose-700 text-sm">
                    Go to Introduction Page
                  </Link>
                </div>
                <main className="min-h-screen pb-24 px-2 sm:px-0">{children}</main>
                {/* Static Mobile Ad Space */}
                <div className="w-full bg-white/80 backdrop-blur-sm text-center py-4 px-2 sm:px-4 md:hidden">
                  <div className="h-[100px] bg-gray-300 flex items-center justify-center rounded">
                    <span className="text-gray-600 text-xs">Mobile Ad Space</span>
                  </div>
                </div>
                <Footer />
                <Toaster />
                <SlidingAdSpace />
              </AuthProvider>
            </ErrorBoundary>
          </div>
        </div>
        <GlobalStyles />
      </body>
    </html>
  )
}
