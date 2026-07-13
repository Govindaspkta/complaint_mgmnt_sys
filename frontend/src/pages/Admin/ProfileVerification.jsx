// import { useEffect, useState } from "react";
// import api from "../../api/axios";

// export default function ProfileVerification() {
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [rejectReason, setRejectReason] = useState("");
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [filter, setFilter] = useState("PENDING"); // PENDING, APPROVED, REJECTED, ALL

//   const fetchProfiles = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/authx/profile-verification/");
//       const data = res.data?.data || res.data || [];
//       setProfiles(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load profiles");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   const handleVerify = async (reference_id) => {
//     setActionLoading(reference_id);
//     try {
//       await api.patch(`/authx/profile-verification/${reference_id}/`, {
//         verification_status: "APPROVED",
//       });
//       await fetchProfiles();
//     } catch (err) {
//       alert("Failed to approve");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleReject = async (reference_id) => {
//     if (!rejectReason.trim()) {
//       alert("Please enter rejection reason");
//       return;
//     }
//     if (!window.confirm("Reject this profile?")) return;

//     setActionLoading(reference_id);
//     try {
//       await api.patch(`/authx/profile-verification/${reference_id}/`, {
//         verification_status: "REJECTED",
//         rejection_reason: rejectReason,
//       });
//       setRejectReason("");
//       setSelectedProfile(null);
//       await fetchProfiles();
//     } catch (err) {
//       alert("Failed to reject");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Filter profiles based on status
//   const filteredProfiles = profiles.filter(profile => {
//     if (filter === "ALL") return true;
//     return profile.verification_status === filter;
//   });

//   if (loading) return <p className="text-center py-20 text-lg">Loading profiles...</p>;
//   if (error) return <p className="text-red-600 text-center py-10">{error}</p>;

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Profile Verification Admin</h1>
        
//         {/* Filter Buttons */}
//         <div className="flex gap-2">
//           {["PENDING", "APPROVED", "REJECTED", "ALL"].map(status => (
//             <button
//               key={status}
//               onClick={() => setFilter(status)}
//               className={`px-4 py-2 rounded-xl font-medium transition-all ${
//                 filter === status 
//                   ? "bg-blue-600 text-white" 
//                   : "bg-gray-200 hover:bg-gray-300"
//               }`}
//             >
//               {status}
//             </button>
//           ))}
//         </div>
//       </div>

//       {filteredProfiles.length === 0 ? (
//         <div className="text-center py-16 text-gray-500 text-lg bg-white rounded-2xl p-10 shadow">
//           No profiles found for selected filter.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {filteredProfiles.map((profile) => (
//             <div key={profile.reference_id} className="bg-white rounded-3xl shadow p-6">
//               {/* User Info */}
//               <div className="flex items-center gap-4 mb-6">
//                 <img src={profile.profile_picture} alt="" className="w-20 h-20 rounded-full object-cover" />
//                 <div>
//                   <h2 className="text-xl font-bold">{profile.user?.username}</h2>
//                   <p className="text-gray-500">{profile.user?.email}</p>
//                 </div>
//               </div>

//               {/* Details */}
//               <div className="space-y-3 mb-6">
//                 <p><span className="font-semibold">Citizenship:</span> {profile.citizenship_number}</p>
//                 <p><span className="font-semibold">DOB:</span> {profile.dob}</p>
//                 <p><span className="font-semibold">Address:</span> {profile.address}</p>
//                 <p>
//                   <span className="font-semibold">Status:</span>{" "}
//                   <span className={`font-bold ${
//                     profile.verification_status === "APPROVED" ? "text-green-600" :
//                     profile.verification_status === "REJECTED" ? "text-red-600" : "text-orange-600"
//                   }`}>
//                     {profile.verification_status}
//                   </span>
//                 </p>
//                 {profile.rejection_reason && (
//                   <p className="text-red-600 text-sm"><span className="font-semibold">Reason:</span> {profile.rejection_reason}</p>
//                 )}
//               </div>

//               {/* Documents */}
//               <div className="grid grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <p className="font-medium mb-2">Citizenship Front</p>
//                   <img src={profile.citizenship_front} alt="Front" className="rounded-2xl h-48 w-full object-cover" />
//                 </div>
//                 <div>
//                   <p className="font-medium mb-2">Citizenship Back</p>
//                   <img src={profile.citizenship_back} alt="Back" className="rounded-2xl h-48 w-full object-cover" />
//                 </div>
//               </div>

//               {/* Show actions only for PENDING */}
//               {profile.verification_status === "PENDING" && (
//                 <div className="flex gap-4 mt-8">
//                   <button
//                     onClick={() => handleVerify(profile.reference_id)}
//                     disabled={actionLoading === profile.reference_id}
//                     className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-medium hover:bg-green-700 disabled:opacity-70"
//                   >
//                     {actionLoading === profile.reference_id ? "Approving..." : "Approve"}
//                   </button>
//                   <button
//                     onClick={() => setSelectedProfile(profile.reference_id)}
//                     disabled={actionLoading === profile.reference_id}
//                     className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-medium hover:bg-red-700 disabled:opacity-70"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}

//               {/* Rejection Modal */}
//               {selectedProfile === profile.reference_id && (
//                 <div className="mt-6 p-4 border border-red-300 rounded-2xl bg-red-50">
//                   <textarea
//                     value={rejectReason}
//                     onChange={(e) => setRejectReason(e.target.value)}
//                     placeholder="Enter rejection reason..."
//                     className="w-full h-24 p-3 border rounded-xl"
//                   />
//                   <div className="flex gap-3 mt-3">
//                     <button 
//                       onClick={() => handleReject(profile.reference_id)}
//                       className="flex-1 bg-red-600 text-white py-2 rounded-xl"
//                     >
//                       Confirm Reject
//                     </button>
//                     <button 
//                       onClick={() => { setSelectedProfile(null); setRejectReason(""); }}
//                       className="flex-1 bg-gray-300 py-2 rounded-xl"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ProfileVerification() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("PENDING");

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/authx/profile-verification/");
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
    setActionLoading(reference_id);
    try {
      await api.patch(`/authx/profile-verification/${reference_id}/`, {
        verification_status: "APPROVED",
      });
      await fetchProfiles();   // Refresh list
    } catch (err) {
      alert("Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reference_id) => {
    if (!rejectReason.trim()) {
      alert("Please enter rejection reason");
      return;
    }
    if (!window.confirm("Reject this profile?")) return;

    setActionLoading(reference_id);
    try {
      await api.patch(`/authx/profile-verification/${reference_id}/`, {
        verification_status: "REJECTED",
        rejection_reason: rejectReason,
      });
      setRejectReason("");
      setSelectedProfile(null);
      await fetchProfiles();   // Refresh after reject
    } catch (err) {
      alert("Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    if (filter === "ALL") return true;
    return profile.verification_status === filter;
  });

  if (loading) return <p className="text-center py-20 text-lg">Loading profiles...</p>;
  if (error) return <p className="text-red-600 text-center py-10">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile Verification Admin</h1>
        
        <div className="flex gap-2">
          {["PENDING", "REJECTED", "APPROVED", "ALL"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === status 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg bg-white rounded-2xl p-10 shadow">
          No profiles found for selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProfiles.map((profile) => (
            <div key={profile.reference_id} className="bg-white rounded-3xl shadow p-6">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={profile.profile_picture} 
                  alt="" 
                  className="w-20 h-20 rounded-full object-cover" 
                />
                <div>
                  <h2 className="text-xl font-bold">{profile.user?.username || profile.user?.email}</h2>
                  <p className="text-gray-500">{profile.user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p><span className="font-semibold">Citizenship:</span> {profile.citizenship_number}</p>
                <p><span className="font-semibold">DOB:</span> {profile.dob}</p>
                <p><span className="font-semibold">Address:</span> {profile.address}</p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className={`font-bold ${
                    profile.verification_status === "APPROVED" ? "text-green-600" :
                    profile.verification_status === "REJECTED" ? "text-red-600" : "text-orange-600"
                  }`}>
                    {profile.verification_status}
                  </span>
                </p>
                {profile.rejection_reason && (
                  <p className="text-red-600 text-sm">
                    <span className="font-semibold">Reason:</span> {profile.rejection_reason}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-medium mb-2">Front</p>
                  <img src={profile.citizenship_front} alt="Front" className="rounded-2xl h-48 w-full object-cover" />
                </div>
                <div>
                  <p className="font-medium mb-2">Back</p>
                  <img src={profile.citizenship_back} alt="Back" className="rounded-2xl h-48 w-full object-cover" />
                </div>
              </div>

              {profile.verification_status === "PENDING" && (
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => handleVerify(profile.reference_id)}
                    disabled={actionLoading === profile.reference_id}
                    className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-medium hover:bg-green-700"
                  >
                    {actionLoading === profile.reference_id ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => setSelectedProfile(profile.reference_id)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-medium hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}

              {selectedProfile === profile.reference_id && (
                <div className="mt-6 p-4 border border-red-300 rounded-2xl bg-red-50">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="w-full h-24 p-3 border rounded-xl"
                  />
                  <div className="flex gap-3 mt-3">
                    <button 
                      onClick={() => handleReject(profile.reference_id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-xl"
                    >
                      Confirm Reject
                    </button>
                    <button 
                      onClick={() => { setSelectedProfile(null); setRejectReason(""); }}
                      className="flex-1 bg-gray-300 py-2 rounded-xl"
                    >
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