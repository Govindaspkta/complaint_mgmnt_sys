import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  console.log(formData)


  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setIsLoading(true);
  setError('');

  try {

    const res = await axios.post(
      'http://127.0.0.1:8000/authx/login/',
      formData,
      {
        withCredentials: true
      }
    );

    const { access, user } = res.data.data;

    // 🔥 Store auth data
    localStorage.setItem("access_token", access);
    localStorage.setItem("user", JSON.stringify(user));

    // 🔥 Notify navbar instantly
    window.dispatchEvent(new Event("storage"));

    alert("✅ Login Successful!");

    navigate("/dashboard");

  } catch (err) {

    setError(
      err.response?.data?.message ||
      "Invalid credentials"
    );

  } finally {

    setIsLoading(false);

  }
};

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email / Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email or Phone Number
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Email or 98xxxxxxxx"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Enter password"
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

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}