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
    date_of_birth: '',
    gender: '',
    profile_picture: null,
    citizenship_front: null,
    citizenship_back: null,
  });

  const [preview, setPreview] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData({ ...formData, [e.target.name]: file });

      // preview
      setPreview({
        ...preview,
        [e.target.name]: URL.createObjectURL(file)
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
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

      login({ ...user, ...res.data.user }, localStorage.getItem('access_token'));

      alert("✅ Profile Completed!");
      navigate('/submit-complaint');

    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="max-w-3xl w-full bg-white p-10 rounded-3xl shadow-2xl">

        <h2 className="text-3xl font-bold text-center mb-2">Complete Your Profile</h2>
        <p className="text-center text-gray-500 mb-8">KYC Verification Required</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* 👤 Profile Picture */}
          <div>
            <label className="font-semibold">Profile Picture (Optional)</label>
            <div className="mt-2 flex items-center gap-4">
              {preview.profile_picture && (
                <img src={preview.profile_picture} className="w-20 h-20 rounded-full object-cover" />
              )}
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-xl">
                <UploadCloud size={18}/> Upload
                <input type="file" name="profile_picture" hidden onChange={handleChange}/>
              </label>
            </div>
          </div>

          {/* 🪪 Citizenship */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Citizenship Details</h3>

            <input
              type="text"
              name="citizenship_number"
              value={formData.citizenship_number}
              onChange={handleChange}
              required
              placeholder="Citizenship Number"
              className={inputClass}
            />

            <div className="grid grid-cols-2 gap-4">

              {/* Front */}
              <div>
                <label>Front Photo</label>
                <input type="file" name="citizenship_front" onChange={handleChange} className="mt-1"/>
                {preview.citizenship_front && (
                  <img src={preview.citizenship_front} className="mt-2 rounded-xl"/>
                )}
              </div>

              {/* Back */}
              <div>
                <label>Back Photo</label>
                <input type="file" name="citizenship_back" onChange={handleChange} className="mt-1"/>
                {preview.citizenship_back && (
                  <img src={preview.citizenship_back} className="mt-2 rounded-xl"/>
                )}
              </div>

            </div>
          </div>

          {/* 📍 Personal Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Personal Information</h3>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address (Optional)"
              className={`${inputClass} h-24`}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={inputClass}
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Gender (Optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* 🚀 Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg"
          >
            {loading ? "Saving..." : "Complete Profile & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}