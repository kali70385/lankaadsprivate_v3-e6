import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Contact Us</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-4">
          We'd love to hear from you! If you have any questions, concerns, or feedback, please don't hesitate to reach
          out to us using the form below or via email.
        </p>
        <p className="mb-6">
          Email:{" "}
          <a href="mailto:lankaadsprivate70385@gmail.com" className="text-primary/90 hover:underline">
            lankaadsprivate70385@gmail.com
          </a>
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
              Name
            </label>
            <Input type="text" id="name" placeholder="Your Name" required />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <Input type="email" id="email" placeholder="Your Email" required />
          </div>
          <div>
            <label htmlFor="subject" className="block mb-1 font-medium text-gray-700">
              Subject
            </label>
            <Input type="text" id="subject" placeholder="Subject" required />
          </div>
          <div>
            <label htmlFor="message" className="block mb-1 font-medium text-gray-700">
              Message
            </label>
            <Textarea id="message" placeholder="Your Message" rows={4} required />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Send Message
          </Button>
        </form>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-primary">Connect with us on social media:</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Facebook:{" "}
              <a
                href="https://www.facebook.com/lankaadsprivate70385"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/90 hover:underline"
              >
                @lankaadsprivate70385
              </a>
            </li>
            <li>
              Twitter:{" "}
              <a
                href="https://www.twitter.com/lankaadsprivate70385"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/90 hover:underline"
              >
                @lankaadsprivate70385
              </a>
            </li>
            <li>
              Instagram:{" "}
              <a
                href="https://www.instagram.com/lankaadsprivate70385"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/90 hover:underline"
              >
                @lankaadsprivate70385
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
