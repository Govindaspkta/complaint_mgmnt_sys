import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Upload, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    citizenshipNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [documents, setDocuments] = useState({
    citizenshipFront: null,
    citizenshipBack: null,
    photo: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocuments({ ...documents, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }
    if (!documents.citizenshipFront || !documents.photo) {
      alert("Please upload required documents!");
      return;
    }

    setIsSubmitting(true);

    console.log("Registration Data:", formData, documents);
    
    setTimeout(() => {
      alert("✅ Registration Successful!\nYour account is under verification by Admin.");
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-dark">Create New Account</h2>
          <p className="text-gray-600 mt-2">Join Sewa Nepal - Verified Nepali Citizens Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name / पुरा नाम *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ram Bahadur Thapa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="98XXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Citizenship Number / नागरिकता नम्बर *</label>
            <input
              type="text"
              name="citizenshipNumber"
              value={formData.citizenshipNumber}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="123456789012"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Create password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-500">
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Confirm password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-4 text-gray-500">
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Upload size={20} /> Upload Verification Documents
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Citizenship Front *</label>
                <input
                  type="file"
                  name="citizenshipFront"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full border border-gray-300 rounded-2xl p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Citizenship Back</label>
                <input
                  type="file"
                  name="citizenshipBack"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-2xl p-3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Passport Size Photo *</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full border border-gray-300 rounded-2xl p-3"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 mt-8"
          >
            <UserPlus size={26} />
            {isSubmitting ? "Registering..." : "Register Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">Login Here</Link>
        </p>
      </div>
    </div>
  );
}