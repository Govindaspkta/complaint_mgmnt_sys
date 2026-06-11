import { useEffect, useState, useCallback } from "react";
import {
  getAllComplaints,
  updateComplaint,
  forwardToGovt,
} from "../../api/complaintApi";

const GOVT_ROUTING = {
  "Electricity": "NEA",
  "Water Supply": "Water Authority",
  "Road Damage": "Municipal Engineering",
  "Garbage Management": "Sanitation Department",
  "Transportation": "Transport Office",
  "Public Health": "Health Ministry",
  "Environment": "Environment Department",
  "Others": "General Admin",
  // Add more as needed - extensible
};

export default function ComplaintVerification() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllComplaints();
      console.log("📋 COMPLAINTS RESPONSE:", res.data);

      let data = res.data?.success && res.data?.data?.results 
        ? res.data.data.results 
        : res.data?.data || res.data || [];

      // Filter pending only
      const pending = data.filter(c => 
        c.status?.toUpperCase() === "PENDING" || 
        c.verification_status?.toUpperCase() === "PENDING"
      );
      setComplaints(pending);
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      setError("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Smart Routing Algorithm
  const routeToGovernment = (category, reference_id) => {
    const target = GOVT_ROUTING[category] || GOVT_ROUTING["Others"];
    console.log(`🚀 Routing complaint ${reference_id} (${category}) → ${target}`);
    // You can expand this with API call to backend for actual forwarding
    return target;
  };

  const handleApprove = async (reference_id, category) => {
    if (processingId) return;
    setProcessingId(reference_id);

    try {
      // 1. Update status
      await updateComplaint(reference_id, {
        status: "APPROVED",
        verification_status: "APPROVED",
      });

      // 2. Smart Routing
      const govtBody = routeToGovernment(category, reference_id);
      
      // Optional: Call backend forward endpoint
      // await forwardToGovt(reference_id, category);

      alert(`✅ Complaint Approved & Forwarded to ${govtBody}`);
      await fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Failed to approve complaint");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reference_id) => {
    if (!window.confirm("Reject this complaint?")) return;
    setProcessingId(reference_id);

    try {
      await updateComplaint(reference_id, {
        status: "REJECTED",
        verification_status: "REJECTED",
      });
      alert("❌ Complaint Rejected");
      await fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Failed to reject");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-lg">Loading pending complaints...</div>;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Complaint Verification</h1>
      <p className="text-gray-600 mb-8">
        Approve complaints → Smart routing to government bodies (NEA, etc.)
      </p>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow">
          <p className="text-xl text-gray-600">No pending complaints for verification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {complaints.map((complaint) => {
            const category = complaint.category?.display_name || complaint.category || "Others";
            return (
              <div key={complaint.reference_id} className="bg-white rounded-3xl shadow p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{complaint.title}</h2>
                    <p className="text-gray-500 text-sm">
                      {category} • {complaint.priority || "Normal"}
                    </p>
                  </div>
                  <span className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">PENDING</span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-4">{complaint.description}</p>

                <div className="text-sm space-y-1 mb-6">
                  <p><strong>Location:</strong> {complaint.municipality}, Ward {complaint.ward}</p>
                  <p><strong>Submitted by:</strong> {complaint.user?.username || complaint.user || "Anonymous"}</p>
                </div>

                {complaint.image && (
                  <img
                    src={complaint.image}
                    alt="Evidence"
                    className="w-full h-48 object-cover rounded-2xl mb-6"
                  />
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(complaint.reference_id, category)}
                    disabled={processingId === complaint.reference_id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-medium disabled:opacity-70"
                  >
                    {processingId === complaint.reference_id ? "Processing..." : "✅ Approve & Forward"}
                  </button>
                  <button
                    onClick={() => handleReject(complaint.reference_id)}
                    disabled={processingId === complaint.reference_id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-medium disabled:opacity-70"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}