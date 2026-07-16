import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
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
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setFieldErrors({});

    if (formData.password !== formData.confirm_password) {
      setFieldErrors({
        confirm_password: ['Passwords do not match'],
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        'http://127.0.0.1:8000/authx/register/',
        formData
      );

      alert('✅ Registration Successful!');
      navigate('/login');
    } catch (err) {
      const response = err.response?.data;

      if (response?.error) {
        setFieldErrors(response.error);

        const firstError = Object.values(response.error)
          .flat()
          .join('\n');

        setError(firstError);
      } else {
        setError(
          response?.message ||
            response?.error ||
            'Registration failed'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-10">

        <h2 className="text-4xl font-bold text-center mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Join Hamro Aawaj
        </p>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-red-600 text-sm whitespace-pre-line">
              {error}
            </p>
          </div>
        )}

        {fieldErrors.non_field_errors && (
          <p className="text-red-500 text-sm mb-4">
            {fieldErrors.non_field_errors[0]}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <div className="relative">
                <User
                  className="absolute top-3.5 left-3 text-gray-400"
                  size={18}
                />

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

              {fieldErrors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.first_name[0]}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <User
                  className="absolute top-3.5 left-3 text-gray-400"
                  size={18}
                />

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

              {fieldErrors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.last_name[0]}
                </p>
              )}
            </div>

          </div>

          {/* Mobile */}

          <div>
            <div className="relative">
              <Phone
                className="absolute top-3.5 left-3 text-gray-400"
                size={18}
              />

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

            {fieldErrors.mobile_number && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.mobile_number[0]}
              </p>
            )}
          </div>

          {/* Username */}

          <div>
            <div className="relative">
              <User
                className="absolute top-3.5 left-3 text-gray-400"
                size={18}
              />

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

            {fieldErrors.username && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.username[0]}
              </p>
            )}
          </div>

          {/* Email */}

          <div>
            <div className="relative">
              <Mail
                className="absolute top-3.5 left-3 text-gray-400"
                size={18}
              />

              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Password */}

          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
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
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>
            </div>

            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password[0]}
              </p>
            )}
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
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match
                </p>
              )}

            {fieldErrors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.confirm_password[0]}
              </p>
            )}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg mt-6"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>

        </form>

        <p className="text-center mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-600 font-semibold"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}