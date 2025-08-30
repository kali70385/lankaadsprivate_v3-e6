import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Frequently Asked Questions</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-6">
          Find answers to the most common questions about using LankaAdsPrivate. If you can't find what you're looking
          for, please don't hesitate to{" "}
          <a href="/contact" className="text-rose-600 hover:underline">
            contact us
          </a>
          .
        </p>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-primary hover:text-primary/80">What is LankaAdsPrivate?</AccordionTrigger>
            <AccordionContent>
              LankaAdsPrivate is Sri Lanka's first AI-powered adult private network, providing a platform for adults to
              connect, explore, and engage in meaningful interactions. We offer classified ads for personal connections,
              services, and more, along with a real-time chat system.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-primary hover:text-primary/80">
              Is LankaAdsPrivate free to use?
            </AccordionTrigger>
            <AccordionContent>
              Yes, basic features of LankaAdsPrivate are free to use. You can browse ads, post your own ads (up to 4
              active ads), and use the chatroom without any charge. We may offer premium features in the future for
              enhanced visibility and additional benefits.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-primary hover:text-primary/80">
              How do I create an account?
            </AccordionTrigger>
            <AccordionContent>
              To create an account, click on the "Login / Register" button in the top right corner of the page. Enter
              your desired username, password, and telephone number. Your telephone number is used for verification and
              will not be shared publicly unless you choose to include it in your ads.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-primary hover:text-primary/80">How can I post an ad?</AccordionTrigger>
            <AccordionContent>
              Once you're logged in, click on the "Post Ad" button in the navigation bar. Fill out the required
              information including title, description, category, price, and contact details. You can also upload an
              image to make your ad more attractive. After submitting, your ad will be live immediately.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-primary hover:text-primary/80">How many ads can I post?</AccordionTrigger>
            <AccordionContent>
              You can have up to 4 active ads at any given time. If you reach this limit, you'll need to delete or
              deactivate an existing ad before posting a new one. This limit helps ensure quality content and fair usage
              of our platform.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-primary hover:text-primary/80">
              Is my personal information safe?
            </AccordionTrigger>
            <AccordionContent>
              We take your privacy seriously and implement various security measures to protect your personal
              information. Your password is encrypted, and we only display the information you choose to share in your
              ads. Please review our Privacy Policy for more details on how we handle your data.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-primary hover:text-primary/80">
              How does the chatroom work?
            </AccordionTrigger>
            <AccordionContent>
              Our chatroom feature allows you to communicate with other users in real-time. You can join public chat
              rooms or send private messages to individual users. To access the chatroom, click on the "Chatroom" link
              in the navigation bar. You'll need to be logged in and choose a nickname before entering.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-primary hover:text-primary/80">
              How can I report inappropriate content or behavior?
            </AccordionTrigger>
            <AccordionContent>
              If you encounter any inappropriate content or behavior, please use the report button available on ads and
              user profiles, or contact our support team directly through the Contact page. We take all reports
              seriously and will investigate promptly to maintain a safe environment for all users.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger className="text-primary hover:text-primary/80">
              How long do ads stay active?
            </AccordionTrigger>
            <AccordionContent>
              Ads remain active for 14 days by default. After this period, they will be automatically marked as inactive
              but will remain in your profile. You can republish expired ads from your profile page if you wish to make
              them active again.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger className="text-primary hover:text-primary/80">
              Can I edit or delete my ad after posting?
            </AccordionTrigger>
            <AccordionContent>
              Yes, you can edit or delete your ads at any time from your profile page. Simply navigate to your profile,
              locate the ad you wish to modify, and use the edit or delete buttons provided.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
