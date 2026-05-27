import { useEffect, useState } from "react";
import api from "./../api/axios";

export default function ProfileVerification() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/admin/profile-verification/");
      
      console.log("✅ Full API Response:", res.data);        // Important
      console.log("✅ Profiles Data:", res.data.data || res.data);

      setProfiles(res.data.data || res.data || []);
    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
      setError("Failed to load profiles. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleVerify = async (id) => {
    await api.patch(`/admin/profile-verification/${id}/`, { verification_status: "VERIFIED" });
    fetchProfiles();
  };

  const handleReject = async (id) => {
    if (!confirm("Reject this profile?")) return;
    await api.patch(`/admin/profile-verification/${id}/`, { verification_status: "REJECTED" });
    fetchProfiles();
  };

  if (loading) return <p className="text-center py-20 text-lg">Loading pending profiles...</p>;
  if (error) return <p className="text-red-600 text-center py-10">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Profile Verification</h1>

      {profiles.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg">
          No pending profiles found.<br />
          Make sure users have submitted profile completion.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {profiles.map((p) => (
            <div key={p.reference_id} className="bg-white rounded-3xl shadow p-6">
              <div className="flex gap-4 mb-6">
                <img src={p.profile_picture} alt="" className="w-20 h-20 rounded-full object-cover" />
                <div>
                  <h2 className="font-bold text-xl">{p.user?.username}</h2>
                  <p className="text-gray-500">{p.user?.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-6">
                <p><strong>Citizenship:</strong> {p.citizenship_number}</p>
                <p><strong>DOB:</strong> {p.dob}</p>
                <p><strong>Address:</strong> {p.address}</p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => handleVerify(p.reference_id)} className="flex-1 bg-green-600 text-white py-3 rounded-2xl">
                  Verify
                </button>
                <button onClick={() => handleReject(p.reference_id)} className="flex-1 bg-red-600 text-white py-3 rounded-2xl">
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