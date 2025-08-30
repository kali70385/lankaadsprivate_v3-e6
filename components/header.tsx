"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, User, Plus, LogOut, MessageSquare, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "./login-modal"
import Image from "next/image"
import { categories } from "@/lib/categories"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    if (isLoginOpen) {
      document.body.classList.add("dialog-open")
    } else {
      document.body.classList.remove("dialog-open")
    }

    return () => {
      document.body.classList.remove("dialog-open")
    }
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 bg-magenta-700 text-white shadow-md">
        <div className="container mx-auto px-2 sm:px-4 relative">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="text-lg sm:text-2xl font-bold text-white flex items-center min-w-0 flex-shrink-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20for%20my%20online%20chatroom%20website%20%2C%20adult%20oriented%20theme%2C%20short%20and%20sweet%20%2C%20title%20_%20LankaFriendsChat_%20.%20add%20a%20heart%20shape%20and%20couple%20for%20logo.jpg-gubG437Qg3lM8920arEeNTCKRXUrRd.jpeg"
                alt="LankaAdsPrivate Logo"
                width={28}
                height={28}
                className="mr-1 sm:mr-2 rounded-sm flex-shrink-0"
              />
              <span className="truncate">LankaAdsPrivate</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 flex-shrink-0">
              <Link href="/chatroom" className="flex items-center text-white hover:text-magenta-100 whitespace-nowrap">
                <MessageSquare className="w-5 h-5 mr-2" />
                Chatroom
              </Link>
              {user ? (
                <>
                  <Link
                    href="/post-ad"
                    className="flex items-center text-magenta-700 bg-white hover:bg-magenta-50 px-4 py-2 rounded-md whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post Ad
                  </Link>
                  <Link
                    href="/profile"
                    className="text-white hover:text-magenta-100 flex items-center whitespace-nowrap"
                  >
                    <User className="w-5 h-5" />
                    <span className="ml-2">My Profile</span>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-white hover:text-magenta-100 whitespace-nowrap"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-white text-magenta-700 hover:bg-magenta-50 whitespace-nowrap"
                >
                  Login / Register
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white p-2 flex-shrink-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 bg-white text-magenta-700 rounded-b-lg shadow-md absolute right-2 left-2 sm:right-0 sm:left-auto sm:w-48 text-xs z-50 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col space-y-1 px-2">
                <Link
                  href="/"
                  className="flex items-center justify-center px-2 py-2 text-magenta-700 hover:bg-magenta-50 border border-magenta-200 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/chatroom"
                  className="flex items-center justify-center px-2 py-2 text-magenta-700 hover:bg-magenta-50 border border-magenta-200 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Chatroom
                </Link>

                {/* Category Links */}
                <div className="py-1 border-t border-b border-magenta-100 my-1">
                  <p className="text-xs text-gray-500 mb-1 text-center">Categories</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className="block py-1 px-2 text-magenta-700 hover:bg-magenta-50 border border-magenta-200 rounded-md text-center text-xs"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {user ? (
                  <>
                    <Link
                      href="/post-ad"
                      className="flex items-center justify-center text-white bg-magenta-700 hover:bg-magenta-600 py-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Post Ad
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center justify-center px-2 py-2 text-magenta-700 hover:bg-magenta-50 border border-magenta-200 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-3 h-3 mr-1" />
                      My Profile
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-center text-magenta-700 hover:bg-magenta-50 h-auto py-2 border-magenta-200 text-xs bg-transparent"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="w-3 h-3 mr-1" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setIsLoginOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="bg-magenta-700 hover:bg-magenta-600 text-white text-xs py-2"
                  >
                    Login / Register
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
