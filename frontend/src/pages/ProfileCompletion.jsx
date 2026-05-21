import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "../api/ProfileApi";
import { UploadCloud } from "lucide-react";

export default function ProfileCompletion() {

  const { user, login } = useContext(AuthContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    citizenship_number: "",
    address: "",
    dob: "",
    profile_picture: null,
    citizenship_front: null,
    citizenship_back: null,
  });

  const [preview, setPreview] = useState({});

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ======================
  // HANDLE INPUT CHANGE
  // ======================
  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (files && files.length > 0) {

      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      setPreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));

    } else {

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

    }
  };

  // ======================
  // SUBMIT PROFILE
  // ======================
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {

        if (value) {
          data.append(key, value);
        }

      });

      // ✅ FIXED
      const res = await updateProfile(data);

      // SAFE LOGIN UPDATE
      login(
        {
          ...user,
          profile: res.data?.data,
        },
        localStorage.getItem("access_token")
      );

      alert("✅ Profile Completed Successfully!");

      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Profile update failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">

      <div className="max-w-3xl w-full bg-white p-10 rounded-3xl shadow-2xl">

        {/* HEADER */}
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

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-center mb-6">
            {error}
          </p>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* PROFILE PICTURE */}
          <div>

            <label className="font-semibold block mb-3">
              Profile Picture *
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
                  required
                />

              </label>

            </div>

          </div>

          {/* CITIZENSHIP SECTION */}
          <div className="space-y-5">

            <h3 className="font-semibold text-xl">
              Citizenship Verification
            </h3>

            {/* CITIZENSHIP NUMBER */}
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
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />

            </div>

            {/* ADDRESS */}
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
                className="w-full px-4 py-3 border rounded-xl h-24 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />

            </div>

            {/* DOB */}
            <div>

              <label className="block mb-2 font-medium">
                Date of Birth *
              </label>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />

            </div>

            {/* CITIZENSHIP IMAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* FRONT */}
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

              {/* BACK */}
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

          {/* SUBMIT */}
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