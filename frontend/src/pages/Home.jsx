import { Link } from 'react-router-dom';
import { PlusCircle, Users, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-dark text-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            तपाईंको समस्या हामी देखाउनेछौं
          </h1>
          <p className="text-2xl md:text-3xl text-accent font-medium mb-4">
            Voice of the People, Question to the Government
          </p>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
            Road damage, water, electricity, and public infrastructure complaints made easy and transparent.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/submit-complaint"
              className="btn-primary flex items-center gap-3 text-lg px-10 py-4"
            >
              <PlusCircle size={28} />
              अहिले उजुरी दर्ता गर्नुहोस्
            </Link>

            <Link
              to="/complaints"
              className="btn-outline border-white text-white hover:bg-white hover:text-dark flex items-center gap-3 text-lg px-8 py-4"
            >
              <Users size={28} />
              सार्वजनिक उजुरीहरू हेर्नुहोस्
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-4 text-dark">कसरी काम गर्छ ?</h2>
        <p className="text-center text-gray-600 mb-16 text-lg">Your voice matters — Hold government accountable</p>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PlusCircle size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. उजुरी दर्ता गर्नुहोस्</h3>
            <p className="text-gray-600">Exact location (Province to Ward) + Photo</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. प्रशासनले हेर्छ</h3>
            <p className="text-gray-600">Admin reviews and takes action</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Status Track गर्नुहोस्</h3>
            <p className="text-gray-600">Real-time updates of your complaint</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">4. सार्वजनिक रूपमा देखिन्छ</h3>
            <p className="text-gray-600">Approved complaints visible to everyone</p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-primary-700 to-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-accent" />
          <h2 className="text-4xl font-bold mb-6">यो सरकारलाई जवाफदेही बनाउने प्लेटफर्म हो</h2>
          <p className="text-xl text-gray-200">
            "तपाईंको समस्या हामी देखाउनेछौं" —<br />
            Transparency र Accountability को लागि डिजिटल नेपालको प्रयास
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-dark text-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">तपाईंको आवाज अब दब्ने छैन !</h2>
        <Link
          to="/submit-complaint"
          className="inline-block bg-accent hover:bg-cyan-300 text-dark font-semibold text-xl px-12 py-5 rounded-2xl transition transform hover:scale-105"
        >
          अहिले उजुरी दर्ता गर्नुहोस् →
        </Link>
      </div>
    </div>
  );
}