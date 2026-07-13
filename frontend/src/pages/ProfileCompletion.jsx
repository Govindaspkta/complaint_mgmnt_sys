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
  const [profile, setProfile] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/authx/profile-completion/details/");
      const data = res.data?.data || res.data;
      
      setProfile(data);

      if (data) {
        setFormData({
          citizenship_number: data.citizenship_number || "",
          address: data.address || "",
          dob: data.dob || "",
        });

        if (data.profile_picture) setProfilePreview(data.profile_picture);
        if (data.citizenship_front) setFrontPreview(data.citizenship_front);
        if (data.citizenship_back) setBackPreview(data.citizenship_back);
      }
      return data;
    } catch (err) {
      console.log("No profile found yet");
      setProfile(null);
      return null;
    } finally {
      setPageLoading(false);
    }
  };

  // Only allow submission if NOT APPROVED and NOT PENDING
  const canSubmit = () => {
    if (!profile) return true; // First time
    return profile.verification_status === "REJECTED";
  };

  const getStatus = () => {
    if (!profile) 
      return { color: "bg-blue-100 text-blue-800", text: "Not Submitted Yet" };

    const st = profile.verification_status;
    if (st === "PENDING") 
      return { color: "bg-yellow-100 text-yellow-800", text: "PENDING - Under Review" };
    if (st === "APPROVED") 
      return { color: "bg-green-100 text-green-800", text: "APPROVED - Verified" };
    if (st === "REJECTED") 
      return { 
        color: "bg-red-100 text-red-800", 
        text: "REJECTED - You can resubmit below" 
      };
    
    return { color: "bg-gray-100", text: st };
  };

  const status = getStatus();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    if (!canSubmit()) {
      setErrors({ api: "You cannot update your profile right now." });
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("citizenship_number", formData.citizenship_number);
      data.append("address", formData.address);
      data.append("dob", formData.dob);

      if (profilePicture) data.append("profile_picture", profilePicture);
      if (citizenshipFront) data.append("citizenship_front", citizenshipFront);
      if (citizenshipBack) data.append("citizenship_back", citizenshipBack);

      // Use POST (your backend handles both create and update)
      await api.post("/authx/profile-completion/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh profile from server + force PENDING
      const freshProfile = await fetchProfile();
      
      if (freshProfile) {
        setProfile({
          ...freshProfile,
          verification_status: "PENDING"
        });
      } else {
        setProfile(prev => ({
          ...(prev || {}),
          verification_status: "PENDING"
        }));
      }

      setSuccess("Profile submitted successfully. Now under review (PENDING).");

      // Clear uploaded files
      setProfilePicture(null);
      setCitizenshipFront(null);
      setCitizenshipBack(null);

    } catch (err) {
      console.error(err);
      setErrors({ 
        api: err.response?.data?.message || 
             err.response?.data?.error || 
             "Failed to submit profile." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <p className="text-center py-20 text-lg">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Status Header */}
        <div className={`p-6 text-center text-xl font-bold ${status.color}`}>
          Current Status: {status.text}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="mt-2 text-blue-100">Submit your information for identity verification.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-xl">
              {success}
            </div>
          )}
          {errors.api && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-xl">
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
              <label 
                className={`mt-4 inline-block cursor-pointer ${!canSubmit() ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2.5 rounded-xl transition`}
              >
                Upload Profile Picture
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfilePicture} 
                  className="hidden" 
                  disabled={!canSubmit()} 
                />
              </label>
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
                  className="w-full border border-slate-300 rounded-xl p-3 disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={!canSubmit()}
                  className="w-full border border-slate-300 rounded-xl p-3 disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!canSubmit()}
                  className="w-full border border-slate-300 rounded-xl p-3 disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Citizenship Documents */}
          <div>
            <h2 className="text-xl font-semibold mb-5">Citizenship Documents</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-3 font-medium">Citizenship Front</label>
                <label className={`cursor-pointer block border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden h-60 ${!canSubmit() ? 'opacity-50' : 'hover:border-blue-500 transition'}`}>
                  {frontPreview ? (
                    <img src={frontPreview} alt="Front" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">Click to upload front image</div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFront} 
                    className="hidden" 
                    disabled={!canSubmit()} 
                  />
                </label>
              </div>

              <div>
                <label className="block mb-3 font-medium">Citizenship Back</label>
                <label className={`cursor-pointer block border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden h-60 ${!canSubmit() ? 'opacity-50' : 'hover:border-blue-500 transition'}`}>
                  {backPreview ? (
                    <img src={backPreview} alt="Back" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">Click to upload back image</div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleBack} 
                    className="hidden" 
                    disabled={!canSubmit()} 
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !canSubmit()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-4 rounded-xl font-semibold text-lg transition"
          >
            {loading 
              ? "Submitting..." 
              : canSubmit() 
              ? "Submit / Resubmit Profile" 
              : profile?.verification_status === "PENDING" 
              ? "Pending Admin Review - Cannot Modify" 
              : "Profile Approved - Cannot Modify"
            }
          </button>
        </form>
      </div>
    </div>
  );
}