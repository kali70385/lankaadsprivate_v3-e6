export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Privacy Policy</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-4">
          At LankaAdsPrivate, we are committed to protecting your privacy and ensuring the security of your personal
          information. This Privacy Policy outlines how we collect, use, and safeguard your data.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">1. Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide directly to us, such as when you create an account, post an ad, or
          communicate with other users. This may include your username, telephone number, and any content you share on
          our platform. We also collect data about your usage of our platform, including your IP address, browser type,
          and pages visited.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use your information to provide and improve our services, communicate with you, and ensure the safety and
          security of our platform. This includes:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Facilitating connections between users</li>
          <li>Displaying your ads to potential interested parties</li>
          <li>Improving our website functionality and user experience</li>
          <li>Sending you important updates about our services</li>
          <li>Preventing fraud and abuse of our platform</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2 text-primary">3. Data Security</h2>
        <p className="mb-4">
          We implement a variety of security measures to maintain the safety of your personal information, including
          encryption, secure servers, and regular security assessments. However, no method of transmission over the
          Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">4. Information Sharing</h2>
        <p className="mb-4">
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties
          except in the following circumstances:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>When we have your consent to do so</li>
          <li>To comply with legal requirements or law enforcement requests</li>
          <li>To protect our rights, property, or safety, or the rights, property, or safety of others</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2 text-primary">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, correct, or delete your personal information. You can update most of your
          information directly through your account settings. For other requests, please contact us using the
          information provided below.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">6. Cookies</h2>
        <p className="mb-4">
          We use cookies to enhance your experience on our site. You can set your browser to refuse all or some browser
          cookies, but this may prevent some parts of our website from functioning properly.
        </p>
        <p className="mt-6 text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
}
