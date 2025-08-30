export default function TermsOfUsePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Terms of Use</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-4">
          Welcome to LankaAdsPrivate. By using our services, you agree to comply with and be bound by the following
          terms and conditions of use.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using LankaAdsPrivate, you agree to be bound by these Terms of Use and all applicable laws and
          regulations. If you do not agree with any part of these terms, you may not use our services.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">2. User Responsibilities</h2>
        <p className="mb-4">
          You are responsible for your use of LankaAdsPrivate and for any content you post. You must be at least 18
          years old to use our services. You agree not to post any content that is illegal, harmful, threatening,
          abusive, harassing, defamatory, or otherwise objectionable.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">3. Privacy</h2>
        <p className="mb-4">
          Your use of LankaAdsPrivate is also governed by our Privacy Policy. Please review our Privacy Policy to
          understand how we collect and use your information.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">4. User Content</h2>
        <p className="mb-4">
          By posting content on LankaAdsPrivate, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and
          fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from,
          distribute, and display such content throughout the world in any media.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">5. Prohibited Activities</h2>
        <p className="mb-4">
          You agree not to use LankaAdsPrivate for any illegal purposes or to conduct any illegal activity, including,
          but not limited to, fraud, human trafficking, exploitation of minors, or any activity that violates the rights
          of others.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">6. Modifications</h2>
        <p className="mb-4">
          We reserve the right to modify these Terms of Use at any time. Your continued use of LankaAdsPrivate after any
          such changes constitutes your acceptance of the new Terms of Use.
        </p>
        <h2 className="text-xl font-semibold mb-2 text-primary">7. Termination</h2>
        <p className="mb-4">
          We reserve the right to terminate your access to LankaAdsPrivate, without cause or notice, which may result in
          the forfeiture and destruction of all information associated with your account.
        </p>
        <p className="mt-6 text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
}
