"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [telephone, setTelephone] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const validatePhoneNumber = (number: string) => {
    const regex = /^(\+94|0)([0-9]{9})$/
    return regex.test(number)
  }

  const validateForm = () => {
    if (!username.trim()) {
      setError("Username is required")
      return false
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long")
      return false
    }

    if (!password.trim()) {
      setError("Password is required")
      return false
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    if (!isLogin) {
      if (!telephone.trim()) {
        setError("Telephone number is required for registration")
        return false
      }

      if (!validatePhoneNumber(telephone)) {
        setError("Please enter a valid Sri Lankan phone number (e.g., 0771234567 or +94771234567)")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (isLogin) {
        // Login logic
        const savedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const user = savedUsers.find((u: any) => u.username === username.trim() && u.password === password)

        if (user) {
          await login(user.username, user.telephone)
          toast({
            title: "Welcome back!",
            description: "You have been logged in successfully.",
          })
          onClose()
          resetForm()
        } else {
          setError("Invalid username or password")
        }
      } else {
        // Register logic
        const savedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

        // Check if username already exists
        const existingUser = savedUsers.find((u: any) => u.username === username.trim())
        if (existingUser) {
          setError("Username already exists. Please choose a different username.")
          return
        }

        // Check if telephone number already exists
        const existingPhone = savedUsers.find((u: any) => u.telephone === telephone.trim())
        if (existingPhone) {
          setError("This telephone number is already registered.")
          return
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          username: username.trim(),
          password: password,
          telephone: telephone.trim(),
          createdAt: new Date().toISOString(),
        }

        savedUsers.push(newUser)
        localStorage.setItem("registeredUsers", JSON.stringify(savedUsers))

        // Auto-login after registration
        await login(newUser.username, newUser.telephone)

        toast({
          title: "Registration successful!",
          description: "Your account has been created and you are now logged in.",
        })
        onClose()
        resetForm()
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setUsername("")
    setPassword("")
    setTelephone("")
    setError(null)
    setShowPassword(false)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-primary">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            {isLogin ? "Sign in to your account to continue" : "Join LankaAdsPrivate to start posting ads"}
          </p>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border-primary/30 focus:border-primary"
              disabled={isLoading}
            />
          </div>

          {/* Telephone Field (Register only) */}
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="telephone" className="text-sm font-medium text-gray-700">
                Telephone Number
              </label>
              <Input
                id="telephone"
                type="tel"
                placeholder="0771234567 or +94771234567"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
                className="border-primary/30 focus:border-primary"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">Enter your Sri Lankan mobile number</p>
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-primary/30 focus:border-primary pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {!isLogin && <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (isLogin ? "Signing in..." : "Creating account...") : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
          <Button
            type="button"
            variant="link"
            onClick={toggleMode}
            className="text-primary hover:text-primary/80 p-0 h-auto font-semibold"
            disabled={isLoading}
          >
            {isLogin ? "Create one now" : "Sign in instead"}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By {isLogin ? "signing in" : "creating an account"}, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
