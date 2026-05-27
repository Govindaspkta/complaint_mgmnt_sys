import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ProfileVerification() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH =================
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/admin/profile-verification/");

      console.log("PROFILE API RESPONSE:", res.data);   // ← Check this

      // Safe data handling (same as CategoryManagement)
      if (Array.isArray(res.data)) {
        setProfiles(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setProfiles(res.data.data);
      } else {
        setProfiles([]);
      }
    } catch (err) {
      console.error("PROFILE FETCH ERROR:", err.response?.data || err.message);
      setError("Failed to load pending profiles. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // ================= VERIFY =================
  const handleVerify = async (reference_id) => {
    try {
      await api.patch(`/admin/profile-verification/${reference_id}/`, {
        verification_status: "VERIFIED",
      });
      fetchProfiles();
    } catch (err) {
      console.error("Verify Error:", err);
      alert("Failed to verify");
    }
  };

  // ================= REJECT =================
  const handleReject = async (reference_id) => {
    if (!window.confirm("Are you sure to reject this profile?")) return;

    try {
      await api.patch(`/admin/profile-verification/${reference_id}/`, {
        verification_status: "REJECTED",
      });
      fetchProfiles();
    } catch (err) {
      console.error("Reject Error:", err);
      alert("Failed to reject");
    }
  };

  if (loading) return <p className="text-center py-20 text-lg">Loading pending profiles...</p>;
  if (error) return <p className="text-red-600 text-center py-10">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile Verification</h1>

      {profiles.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg bg-white rounded-2xl p-10 shadow">
          No pending profiles for verification at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.reference_id}
              className="bg-white rounded-3xl shadow p-6"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={profile.profile_picture}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold">{profile.user?.username}</h2>
                  <p className="text-gray-500">{profile.user?.email}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <p><span className="font-semibold">Citizenship:</span> {profile.citizenship_number}</p>
                <p><span className="font-semibold">DOB:</span> {profile.dob}</p>
                <p><span className="font-semibold">Address:</span> {profile.address}</p>
                <p><span className="font-semibold">Status:</span> {profile.verification_status}</p>
              </div>

              {/* Documents */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="font-medium mb-2">Citizenship Front</p>
                  <img src={profile.citizenship_front} alt="Front" className="rounded-2xl h-48 w-full object-cover" />
                </div>
                <div>
                  <p className="font-medium mb-2">Citizenship Back</p>
                  <img src={profile.citizenship_back} alt="Back" className="rounded-2xl h-48 w-full object-cover" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => handleVerify(profile.reference_id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-medium"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleReject(profile.reference_id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}