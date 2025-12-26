export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p className="text-xl text-gray-600">
          Your trusted partner in premium cannabis products
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            We are committed to providing the highest quality cannabis products
            to our customers in Nigeria. Our mission is to promote wellness,
            education, and responsible use of cannabis for medical and
            therapeutic purposes.
          </p>
          <p className="text-gray-600">
            Every product in our catalog is carefully selected and tested to
            ensure purity, potency, and safety. We work directly with trusted
            growers and manufacturers who share our commitment to excellence.
          </p>
        </div>
        <div className="bg-primary-50 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-primary-800 mb-4">
            Why Choose Us?
          </h3>
          <ul className="space-y-3 text-primary-700">
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Lab-tested products for quality assurance
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Discreet and secure delivery
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Expert customer support
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Competitive pricing
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Wide variety of products
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Legal Notice
        </h2>
        <p className="text-gray-600 text-center">
          This platform is designed for educational purposes. Please ensure
          compliance with all local laws and regulations regarding cannabis use
          and possession in your area. Users must be of legal age and have
          proper authorization where required.
        </p>
      </div>
    </div>
  );
}
