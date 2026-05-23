import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '' ,
    last_name: '',
    mobile_number: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://127.0.0.1:8000/authx/register/', formData);
      alert("✅ Registration Successful!");
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-11 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-10">
        
        <h2 className="text-4xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-600 mb-8">Join Sewa Nepal</p>

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute top-3.5 left-3 text-gray-400" size={18}/>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="relative">
              <User className="absolute top-3.5 left-3 text-gray-400" size={18}/>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="relative">
            <Phone className="absolute top-3.5 left-3 text-gray-400" size={18}/>
            <input
              type="tel"
              name="mobile_number"
              placeholder="98XXXXXXXX"
              value={formData.mobile_number}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute top-3.5 left-3 text-gray-400" size={18}/>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3.5 left-3 text-gray-400" size={18}/>
            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </span>
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            {formData.confirm_password &&
              formData.password !== formData.confirm_password && (
                <p className="text-sm text-red-500 mt-1">
                  Passwords do not match
                </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg mt-6"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}