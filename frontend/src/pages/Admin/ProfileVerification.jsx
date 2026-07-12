import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ProfileVerification() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/profile-verification/");
      const data = res.data?.data || res.data || [];
      setProfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleVerify = async (reference_id) => {
    try {
      await api.patch(`/admin/profile-verification/${reference_id}/`, {
        verification_status: "APPROVED",
      });
      fetchProfiles();
    } catch (err) {
      alert("Failed to verify");
    }
  };

  const handleReject = async (reference_id) => {
    if (!rejectReason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

    if (!window.confirm("Reject this profile?")) return;

    try {
      await api.patch(`/admin/profile-verification/${reference_id}/`, {
        verification_status: "REJECTED",
        rejection_reason: rejectReason,
      });
      setRejectReason("");
      setSelectedProfile(null);
      fetchProfiles();
    } catch (err) {
      alert("Failed to reject");
    }
  };

  if (loading) return <p className="text-center py-20 text-lg">Loading pending profiles...</p>;
  if (error) return <p className="text-red-600 text-center py-10">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Profile Verification Admin</h1>

      {profiles.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg bg-white rounded-2xl p-10 shadow">
          No pending profiles for verification.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div key={profile.reference_id} className="bg-white rounded-3xl shadow p-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6">
                <img src={profile.profile_picture} alt="" className="w-20 h-20 rounded-full object-cover" />
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
                <p><span className="font-semibold">Status:</span> <span className="font-bold">{profile.verification_status}</span></p>
              </div>

              {/* Documents */}
              <div className="grid grid-cols-2 gap-4">
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
                  className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-medium hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => setSelectedProfile(profile.reference_id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-medium hover:bg-red-700"
                >
                  Reject
                </button>
              </div>

              {/* Rejection Reason Modal */}
              {selectedProfile === profile.reference_id && (
                <div className="mt-6 p-4 border border-red-300 rounded-2xl bg-red-50">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="w-full h-24 p-3 border rounded-xl"
                  />
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => handleReject(profile.reference_id)} className="flex-1 bg-red-600 text-white py-2 rounded-xl">
                      Confirm Reject
                    </button>
                    <button onClick={() => { setSelectedProfile(null); setRejectReason(""); }} className="flex-1 bg-gray-300 py-2 rounded-xl">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}