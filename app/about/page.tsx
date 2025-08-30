export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">About Us</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-4">
          Welcome to LankaAdsPrivate, Sri Lanka's first AI-powered adult private network. We are dedicated to providing
          a safe, discreet, and innovative platform for adults to connect, explore, and engage in meaningful
          interactions.
        </p>
        <p className="mb-4">
          Our cutting-edge AI technology ensures a seamless and personalized experience for all our users, while
          maintaining the highest standards of privacy and security. Whether you're looking for companionship, services,
          or simply want to be part of a vibrant community, LankaAdsPrivate is your go-to destination.
        </p>
        <p className="mb-4">
          We understand the importance of discretion in adult interactions, which is why we've developed a platform that
          prioritizes user privacy while fostering genuine connections. Our team is committed to continuously improving
          and expanding our services to meet the evolving needs of our community.
        </p>
        <p className="mb-6">Join us today and experience the future of adult networking in Sri Lanka!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-primary/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-primary">Our Mission</h2>
            <p>
              To create a safe, respectful, and inclusive environment where adults can connect, share experiences, and
              build meaningful relationships without judgment or stigma.
            </p>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-primary">Our Vision</h2>
            <p>
              To become the leading platform for adult connections in Sri Lanka, known for our commitment to user
              privacy, innovative features, and fostering a supportive community.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
