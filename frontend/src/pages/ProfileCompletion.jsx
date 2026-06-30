import { useState, useEffect } from "react";
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
  const [profile, setProfile] = useState(null); // Current profile from backend
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch existing profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/authx/profile-completion/detail/");
      const data = res.data.data || res.data;
      setProfile(data);

      // Pre-fill form if rejected (for resubmission)
      if (data) {
        setFormData({
          citizenship_number: data.citizenship_number || "",
          address: data.address || "",
          dob: data.dob || "",
        });

        // Set previews if images exist
        if (data.profile_picture) setProfilePreview(data.profile_picture);
        if (data.citizenship_front) setFrontPreview(data.citizenship_front);
        if (data.citizenship_back) setBackPreview(data.citizenship_back);
      }
    } catch (err) {
      console.log("No existing profile found");
    } finally {
      setPageLoading(false);
    }
  };

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
    if (!profilePicture && !profile?.profile_picture) {
      newErrors.profile_picture = "Profile picture is required";
    }
    if (!citizenshipFront && !profile?.citizenship_front) {
      newErrors.citizenship_front = "Citizenship front image is required";
    }
    if (!citizenshipBack && !profile?.citizenship_back) {
      newErrors.citizenship_back = "Citizenship back image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canSubmit = () => {
    if (!profile) return true; // First time submission
    return profile.verification_status === "REJECTED";
  };

  const getStatusMessage = () => {
    if (!profile) return null;
    if (profile.verification_status === "PENDING") {
      return { type: "warning", message: "Your profile is under review. You cannot edit it until the admin makes a decision." };
    }
    if (profile.verification_status === "VERIFIED") {
      return { type: "success", message: "Your profile has been successfully verified." };
    }
    if (profile.verification_status === "REJECTED") {
      return { 
        type: "error", 
        message: "Your previous profile was rejected. " + 
                (profile.rejection_reason ? `Reason: ${profile.rejection_reason}` : "Please resubmit with correct information.") 
      };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    if (!canSubmit()) {
      setErrors({ api: "You cannot update your profile at this time." });
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);
      const data = new FormData();

      data.append("citizenship_number", formData.citizenship_number);
      data.append("address", formData.address);
      data.append("dob", formData.dob);

      if (profilePicture) data.append("profile_picture", profilePicture);
      if (citizenshipFront) data.append("citizenship_front", citizenshipFront);
      if (citizenshipBack) data.append("citizenship_back", citizenshipBack);

      const res = await api.post("/authx/profile-completion/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Profile submitted successfully. Please wait for verification.");
      
      // Refresh profile data
      fetchProfile();

      // Reset file inputs only (keep text data for convenience)
      setProfilePicture(null);
      setCitizenshipFront(null);
      setCitizenshipBack(null);
    } catch (err) {
      console.error("PROFILE COMPLETION ERROR:", err.response?.data || err.message);
      setErrors({
        api: err.response?.data?.message || "Failed to submit profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const status = getStatusMessage();

  if (pageLoading) {
    return <p className="text-center py-20 text-lg">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="mt-2 text-blue-100">Submit your information for identity verification.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Status Banner */}
          {status && (
            <div className={`p-4 rounded-xl border ${
              status.type === "success" ? "bg-green-100 border-green-200 text-green-700" :
              status.type === "warning" ? "bg-yellow-100 border-yellow-200 text-yellow-700" :
              "bg-red-100 border-red-200 text-red-700"
            }`}>
              {status.message}
            </div>
          )}

          {/* Success Message */}
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
                src={profilePreview || "https://ui-avatars.com/api/?name=User&background=e5e7eb&color=6b7280&size=200"}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-slate-200 shadow"
              />
              <label className={`mt-4 inline-block cursor-pointer ${!canSubmit() ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-5 py-2 rounded-xl transition`}>
                Upload Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicture}
                  className="hidden"
                  disabled={!canSubmit()}
                />
              </label>
              {errors.profile_picture && <p className="text-red-500 text-sm mt-2">{errors.profile_picture}</p>}
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-5">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Citizenship Number</label>
                <input
                  type="text"
                  name="citizenship_number"
                  value={formData.citizenship_number}
                  onChange={handleChange}
                  disabled={!canSubmit()}
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                />
                {errors.citizenship_number && <p className="text-red-500 text-sm mt-1">{errors.citizenship_number}</p>}
              </div>

              <div>
                <label className="block mb-2 font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={!canSubmit()}
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                />
                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!canSubmit()}
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Citizenship Documents */}
          <div>
            <h2 className="text-xl font-semibold mb-5">Citizenship Documents</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-3 font-medium">Citizenship Front</label>
                <label className={`cursor-pointer block border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden hover:border-blue-500 transition ${!canSubmit() ? 'opacity-50' : ''}`}>
                  {frontPreview ? (
                    <img src={frontPreview} alt="Front" className="h-60 w-full object-cover" />
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
                    disabled={!canSubmit()}
                  />
                </label>
                {errors.citizenship_front && <p className="text-red-500 text-sm mt-2">{errors.citizenship_front}</p>}
              </div>

              <div>
                <label className="block mb-3 font-medium">Citizenship Back</label>
                <label className={`cursor-pointer block border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden hover:border-blue-500 transition ${!canSubmit() ? 'opacity-50' : ''}`}>
                  {backPreview ? (
                    <img src={backPreview} alt="Back" className="h-60 w-full object-cover" />
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
                    disabled={!canSubmit()}
                  />
                </label>
                {errors.citizenship_back && <p className="text-red-500 text-sm mt-2">{errors.citizenship_back}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !canSubmit()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-4 rounded-xl font-semibold transition"
          >
            {loading ? "Submitting Profile..." : canSubmit() ? "Submit Profile" : "Cannot Submit Now"}
          </button>
        </form>
      </div>
    </div>
  );
}