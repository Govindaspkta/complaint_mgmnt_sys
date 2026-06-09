import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // NORMAL LOGIN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/authx/login/',
        formData,
        { withCredentials: true }
      );

      console.log("NORMAL LOGIN RESPONSE:", res.data);

      const { access, user } = res.data.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("storage"));

      alert("✅ Login Successful!");

      // Consistent navigation
      if (user?.is_staff === true) {
        navigate("/admin/dashboard");
      } else {
        navigate("/my-complaints");   // or "/dashboard" if you prefer
      }
    } catch (err) {
      console.log("NORMAL LOGIN ERROR:", err);
      console.log("ERROR RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Invalid credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError('');

      console.log("GOOGLE RESPONSE:", credentialResponse);

      const res = await axios.post(
        "http://127.0.0.1:8000/authx/google-login/",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      console.log("GOOGLE LOGIN SUCCESS:", res.data);

      const { access, user } = res.data.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("storage"));

      alert("✅ Google Login Successful!");

      // Consistent navigation
      if (user?.is_staff === true) {
        navigate("/admin/dashboard");
      } else {
        navigate("/my-complaints");   // or "/dashboard" if you prefer
      }
    } catch (err) {
      console.log("GOOGLE LOGIN ERROR:", err);
      console.log("GOOGLE ERROR RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Google login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {/* GOOGLE LOGIN */}
        <div className="mb-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log("GOOGLE BUTTON FAILED");
              setError("Google login failed");
            }}
          />
        </div>

        {/* DIVIDER */}
        <div className="text-center text-gray-400 mb-4">OR</div>

        {/* NORMAL LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* USERNAME */}
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
              placeholder="Email or 98xxxxxxxx"
              className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
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

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* REGISTER LINK */}
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