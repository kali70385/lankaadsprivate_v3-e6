import { Shield, AlertTriangle, Eye, UserCheck, CreditCard } from "lucide-react"

export default function SafetyTipsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Safety Tips</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-primary/10 p-4 rounded-lg mb-6 flex items-start">
          <AlertTriangle className="text-primary/90 mr-3 mt-1 flex-shrink-0" />
          <p>
            At LankaAdsPrivate, your safety is our top priority. Please follow these guidelines to ensure a safe and
            positive experience on our platform. Remember that online interactions always carry some risk, and it's
            important to exercise caution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <Shield className="text-primary/90 mr-3" />
              <h2 className="text-xl font-semibold text-primary">Protect Your Personal Information</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Never share your full name, home address, or financial details with other users</li>
              <li>Use the platform's messaging system before moving to external communication</li>
              <li>Consider creating a separate email address for your online activities</li>
              <li>Be cautious about sharing photos that could reveal your identity or location</li>
            </ul>
          </div>

          <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <Eye className="text-primary/90 mr-3" />
              <h2 className="text-xl font-semibold text-primary">Meet in Public Places</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Always arrange first meetings in public, well-lit locations with other people around</li>
              <li>Tell a friend or family member about your plans, including where and when you're meeting</li>
              <li>Consider using your own transportation to and from the meeting</li>
              <li>Trust your instincts - if something feels wrong, leave immediately</li>
            </ul>
          </div>

          <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <UserCheck className="text-primary/90 mr-3" />
              <h2 className="text-xl font-semibold text-primary">Verify User Information</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be cautious of users who seem to have inconsistent information</li>
              <li>Look for verified profiles when available</li>
              <li>Be wary of users who refuse to video chat or meet in person</li>
              <li>Research the person online if possible before meeting</li>
            </ul>
          </div>

          <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <CreditCard className="text-primary/90 mr-3" />
              <h2 className="text-xl font-semibold text-primary">Use Secure Payment Methods</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>For any transactions, use secure and traceable payment methods</li>
              <li>Be wary of requests for unconventional payment types like gift cards</li>
              <li>Never send money to someone you haven't met in person</li>
              <li>Be suspicious of deals that seem too good to be true</li>
            </ul>
          </div>
        </div>

        <div className="bg-primary/20 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3 text-primary">Red Flags to Watch For</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>Requests for financial assistance or money transfers</li>
              <li>Refusal to meet in person or always having excuses</li>
              <li>Inconsistent stories or details that change over time</li>
              <li>Pressuring you to move communication off the platform quickly</li>
            </ul>
            <ul className="list-disc pl-6 space-y-2">
              <li>Overly romantic or intense behavior very early in communication</li>
              <li>Vague or evasive answers to direct questions</li>
              <li>Claims of sudden emergencies requiring your help</li>
              <li>Requesting intimate photos or videos</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">Reporting Concerns</h2>
          <p className="mb-4">
            If you encounter any suspicious or inappropriate behavior, please report it immediately using our reporting
            tools or by contacting our support team. Your reports help us maintain a safe environment for all users.
          </p>
          <p className="font-semibold">
            Remember, your safety is in your hands. Always exercise caution and prioritize your well-being when
            interacting with others online.
          </p>
        </div>
      </div>
    </div>
  )
}
