import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';

export default function ProfileCompletion() {

  const { user, login } = useContext(AuthContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    citizenship_number: '',
    address: '',
    dob: '',
    profile_picture: null,
    citizenship_front: null,
    citizenship_back: null,
  });

  const [preview, setPreview] = useState({});

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  // 🔥 Handle Input Changes
  const handleChange = (e) => {

    if (e.target.files) {

      const file = e.target.files[0];

      setFormData({
        ...formData,
        [e.target.name]: file
      });

      // Preview image
      setPreview({
        ...preview,
        [e.target.name]: URL.createObjectURL(file)
      });

    } else {

      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });

    }
  };

  // 🔥 Submit Profile
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError('');

    const data = new FormData();

    Object.keys(formData).forEach((key) => {

      if (formData[key]) {
        data.append(key, formData[key]);
      }

    });

    try {

      const res = await axios.patch(
        'http://127.0.0.1:8000/api/auth/profile/complete/',
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // update auth context
      login(
        { ...user, ...res.data.user },
        localStorage.getItem('access_token')
      );

      alert("✅ Profile Completed Successfully!");

      navigate('/submit-complaint');

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {

      setLoading(false);

    }
  };

  const inputClass =
    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500";

  return (

    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">

      <div className="max-w-3xl w-full bg-white p-10 rounded-3xl shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">

          <h2 className="text-3xl font-bold">
            Complete Your Profile
          </h2>

          <p className="text-gray-500 mt-2">
            Citizenship verification is required before lodging complaints.
          </p>

          <p className="text-red-500 text-sm mt-2">
            Fields marked with * are mandatory
          </p>

        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-6">
            {error}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* 👤 Profile Picture */}
          <div>

            <label className="font-semibold block mb-3">
              Profile Picture (Optional)
            </label>

            <div className="flex items-center gap-4">

              {preview.profile_picture && (
                <img
                  src={preview.profile_picture}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              )}

              <label className="cursor-pointer flex items-center gap-2 px-4 py-3 border rounded-xl hover:bg-gray-100 transition">

                <UploadCloud size={18} />

                Upload Picture

                <input
                  type="file"
                  name="profile_picture"
                  hidden
                  accept="image/*"
                  onChange={handleChange}
                />

              </label>

            </div>

          </div>

          {/* 🪪 Citizenship Section */}
          <div className="space-y-5">

            <h3 className="font-semibold text-xl">
              Citizenship Verification
            </h3>

            {/* Citizenship Number */}
            <div>

              <label className="block mb-2 font-medium">
                Citizenship Number *
              </label>

              <input
                type="text"
                name="citizenship_number"
                value={formData.citizenship_number}
                onChange={handleChange}
                required
                placeholder="Enter citizenship number"
                className={inputClass}
              />

            </div>

            {/* Address */}
            <div>

              <label className="block mb-2 font-medium">
                Permanent Address *
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your permanent address"
                className={`${inputClass} h-24`}
              />

            </div>

            {/* DOB */}
            <div>

              <label className="block mb-2 font-medium">
                Date of Birth (Optional)
              </label>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={inputClass}
              />

            </div>

            {/* Citizenship Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Front */}
              <div>

                <label className="block mb-2 font-medium">
                  Citizenship Front *
                </label>

                <input
                  type="file"
                  name="citizenship_front"
                  required
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full"
                />

                {preview.citizenship_front && (
                  <img
                    src={preview.citizenship_front}
                    alt="Citizenship Front"
                    className="mt-3 rounded-xl border"
                  />
                )}

              </div>

              {/* Back */}
              <div>

                <label className="block mb-2 font-medium">
                  Citizenship Back *
                </label>

                <input
                  type="file"
                  name="citizenship_back"
                  required
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full"
                />

                {preview.citizenship_back && (
                  <img
                    src={preview.citizenship_back}
                    alt="Citizenship Back"
                    className="mt-3 rounded-xl border"
                  />
                )}

              </div>

            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg"
          >
            {loading
              ? "Saving Profile..."
              : "Complete Profile & Continue"}
          </button>

        </form>

      </div>

    </div>
  );
}