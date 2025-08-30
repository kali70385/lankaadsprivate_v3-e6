import { Search, UserPlus, MessageSquare, Heart } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Account",
      description: "Sign up for free and create your personal profile",
    },
    {
      icon: Search,
      title: "Browse Ads",
      description: "Search for connections or services that interest you",
    },
    {
      icon: MessageSquare,
      title: "Connect",
      description: "Message advertisers directly or join our chatroom",
    },
    {
      icon: Heart,
      title: "Meet Up",
      description: "Arrange to meet and form meaningful connections",
    },
  ]

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-center text-primary/90">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <div className="flex justify-center mb-4">
              <step.icon className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
