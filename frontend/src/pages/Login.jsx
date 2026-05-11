import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Demo purpose only
    setTimeout(() => {
      alert("✅ Login Successful! (Demo)");
      setIsLoading(false);
      // Later we will redirect to dashboard
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-dark">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email or Phone Number</label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Email or Phone (98xxxxxxxx)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
          >
            <LogIn size={24} />
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}