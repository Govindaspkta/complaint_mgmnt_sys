import { useState } from "react";
import api from "../api/axios";

export default function ProfileCompletion() {
  const [formData, setFormData] = useState({
    citizenship_number: "",
    address: "",
    dob: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [citizenshipFront, setCitizenshipFront] = useState(null);
  const [citizenshipBack, setCitizenshipBack] = useState(null);

  const [profilePreview, setProfilePreview] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePicture(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleFront = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCitizenshipFront(file);
    setFrontPreview(URL.createObjectURL(file));
  };

  const handleBack = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCitizenshipBack(file);
    setBackPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.citizenship_number.trim()) {
      newErrors.citizenship_number = "Citizenship number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }

    if (!profilePicture) {
      newErrors.profile_picture = "Profile picture is required";
    }

    if (!citizenshipFront) {
      newErrors.citizenship_front = "Citizenship front image is required";
    }

    if (!citizenshipBack) {
      newErrors.citizenship_back = "Citizenship back image is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setErrors({});

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "citizenship_number",
        formData.citizenship_number
      );
      data.append("address", formData.address);
      data.append("dob", formData.dob);

      data.append("profile_picture", profilePicture);
      data.append("citizenship_front", citizenshipFront);
      data.append("citizenship_back", citizenshipBack);

      const res = await api.post(
        "/authx/profile-completion/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("SUCCESS:", res.data);

      setSuccess(
        "Profile submitted successfully. Please wait for verification."
      );

      setFormData({
        citizenship_number: "",
        address: "",
        dob: "",
      });

      setProfilePicture(null);
      setCitizenshipFront(null);
      setCitizenshipBack(null);

      setProfilePreview(null);
      setFrontPreview(null);
      setBackPreview(null);
    } catch (err) {
      console.error(
        "PROFILE COMPLETION ERROR:",
        err.response?.data || err.message
      );

      setErrors({
        api:
          err.response?.data?.message ||
          "Failed to submit profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <h1 className="text-3xl font-bold">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-blue-100">
            Submit your information for identity verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Success */}
          {success && (
            <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-xl">
              {success}
            </div>
          )}

          {/* API Error */}
          {errors.api && (
            <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl">
              {errors.api}
            </div>
          )}

          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="text-center">
              <img
                src={
                  profilePreview ||
                  "https://ui-avatars.com/api/?name=User&background=e5e7eb&color=6b7280&size=200"
                }
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-slate-200 shadow"
              />

              <label className="mt-4 inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition">
                Upload Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicture}
                  className="hidden"
                />
              </label>

              {errors.profile_picture && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.profile_picture}
                </p>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-5">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block mb-2 font-medium">
                  Citizenship Number
                </label>

                <input
                  type="text"
                  name="citizenship_number"
                  value={formData.citizenship_number}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                {errors.citizenship_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.citizenship_number}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                {errors.dob && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dob}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Citizenship Documents */}
          <div>
            <h2 className="text-xl font-semibold mb-5">
              Citizenship Documents
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Front */}
              <div>
                <label className="block mb-3 font-medium">
                  Citizenship Front
                </label>

                <label className="cursor-pointer block border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden hover:border-blue-500 transition">
                  {frontPreview ? (
                    <img
                      src={frontPreview}
                      alt="Front"
                      className="h-60 w-full object-cover"
                    />
                  ) : (
                    <div className="h-60 flex items-center justify-center text-slate-400">
                      Click to upload front image
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFront}
                    className="hidden"
                  />
                </label>

                {errors.citizenship_front && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.citizenship_front}
                  </p>
                )}
              </div>

              {/* Back */}
              <div>
                <label className="block mb-3 font-medium">
                  Citizenship Back
                </label>

                <label className="cursor-pointer block border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden hover:border-blue-500 transition">
                  {backPreview ? (
                    <img
                      src={backPreview}
                      alt="Back"
                      className="h-60 w-full object-cover"
                    />
                  ) : (
                    <div className="h-60 flex items-center justify-center text-slate-400">
                      Click to upload back image
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBack}
                    className="hidden"
                  />
                </label>

                {errors.citizenship_back && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.citizenship_back}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-4 rounded-xl font-semibold transition"
          >
            {loading
              ? "Submitting Profile..."
              : "Submit Profile"}
          </button>

        </form>
      </div>
    </div>
  );
}