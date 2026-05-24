import React, { useState } from 'react';
import { 
  ShieldCheck, XCircle, CheckCircle, Eye, 
  User, Calendar, MapPin, IdCard 
} from 'lucide-react';

export default function ProfileVerification() {
  const [profiles, setProfiles] = useState([
    // Sample data - replace with real API data later
    {
      id: 1,
      user: { full_name: "राम बहादुर थापा", email: "ram.thapa@gmail.com" },
      citizenship_number: "1234567890",
      address: "काठमाडौं महानगरपालिका, वडा नं. १५",
      dob: "1995-03-15",
      profile_picture: "https://via.placeholder.com/150",
      citizenship_front: "https://via.placeholder.com/300x200",
      citizenship_back: "https://via.placeholder.com/300x200",
      is_verified: false,
      created_at: "2026-05-20"
    },
    // Add more sample profiles as needed
  ]);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = (profile) => {
    setSelectedProfile(profile);
    setShowModal(true);
  };

  const handleApprove = (id) => {
    // Call your DRF API here: /admin/profiles/{id}/verify/
    alert(`Profile ID ${id} Approved ✅`);
    setProfiles(profiles.filter(p => p.id !== id));
    setShowModal(false);
  };

  const handleReject = (id) => {
    const reason = prompt("किन रिजेक्ट गर्न चाहनुहुन्छ? (Reason)");
    if (reason) {
      // Call your DRF API here: /admin/profiles/{id}/reject/
      alert(`Profile ID ${id} Rejected`);
      setProfiles(profiles.filter(p => p.id !== id));
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Profile Verification</h2>
          <p className="text-gray-600 mt-1">Verify user identity for government complaint system</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-5 py-2.5 rounded-2xl font-medium">
          {profiles.length} Pending Verifications
        </div>
      </div>

      {/* Profile List */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">User</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Citizenship No.</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Address</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Submitted</th>
                <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img 
                        src={profile.profile_picture} 
                        alt="profile" 
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div>
                        <p className="font-medium">{profile.user.full_name}</p>
                        <p className="text-sm text-gray-500">{profile.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <IdCard size={18} className="text-gray-400" />
                      {profile.citizenship_number}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-gray-400" />
                      {profile.address}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-600">
                    {new Date(profile.created_at).toLocaleDateString('ne-NP')}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => handleView(profile)}
                      className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-2xl hover:bg-primary-700 transition"
                    >
                      <Eye size={18} />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Verify User Profile</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8 overflow-auto max-h-[70vh]">
              {/* Left - Personal Info */}
              <div className="space-y-6">
                <div>
                  <img 
                    src={selectedProfile.profile_picture} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <User size={22} /> Personal Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Full Name</p>
                      <p className="font-medium text-lg">{selectedProfile.user.full_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <p>{selectedProfile.user.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Date of Birth</p>
                      <p>{selectedProfile.dob}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Citizenship Number</p>
                      <p className="font-mono">{selectedProfile.citizenship_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Address</p>
                      <p>{selectedProfile.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Documents */}
              <div>
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <IdCard size={22} /> Citizenship Documents
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Citizenship Front</p>
                    <img 
                      src={selectedProfile.citizenship_front} 
                      alt="Front" 
                      className="rounded-2xl border shadow-sm w-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Citizenship Back</p>
                    <img 
                      src={selectedProfile.citizenship_back} 
                      alt="Back" 
                      className="rounded-2xl border shadow-sm w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t bg-gray-50 flex gap-4 justify-end">
              <button
                onClick={() => handleReject(selectedProfile.id)}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-red-300 text-red-600 hover:bg-red-50 transition"
              >
                <XCircle size={24} />
                Reject
              </button>
              
              <button
                onClick={() => handleApprove(selectedProfile.id)}
                className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition font-medium"
              >
                <CheckCircle size={24} />
                Approve Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}