export default function ResponsiveSlider() {
  return (
    <div className="py-16 bg-gradient-to-r from-blue-50 to-orange-50">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold text-blue-900 mb-8">Features & Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Blockchain Security</h4>
            <p className="text-gray-600">Tamper-proof records with blockchain technology</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Real-time Updates</h4>
            <p className="text-gray-600">Instant notifications and status tracking</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Transparent Process</h4>
            <p className="text-gray-600">Complete visibility for all stakeholders</p>
          </div>
        </div>
      </div>
    </div>
  );
}