import { useEffect, useState, useCallback } from "react";
import {
  getAllComplaints,
  updateComplaint,
} from "../../api/complaintApi";

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

      // Show only pending complaints
      const pending = data.filter(c => 
        c.status?.toUpperCase() === "PENDING" || 
        c.verification_status?.toUpperCase() === "PENDING"
      );

      setComplaints(pending);
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      setError("Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Approve Complaint
  const handleApprove = async (reference_id, category = "Others") => {
    if (processingId) return;
    setProcessingId(reference_id);

    try {
      await updateComplaint(reference_id, {
        status: "APPROVED",
        verification_status: "APPROVED",
      });

      alert(`✅ Complaint Approved & Routed to Government Body (${category})`);
      await fetchComplaints();   // Refresh list
    } catch (err) {
      console.error("Approve Error:", err);
      alert(err.response?.data?.message || "Failed to approve complaint");
    } finally {
      setProcessingId(null);
    }
  };

  // Reject Complaint
  const handleReject = async (reference_id) => {
    if (!window.confirm("Are you sure you want to reject this complaint?")) return;
    
    setProcessingId(reference_id);

    try {
      await updateComplaint(reference_id, {
        status: "REJECTED",
        verification_status: "REJECTED",
      });

      alert("❌ Complaint Rejected Successfully");
      await fetchComplaints();
    } catch (err) {
      console.error("Reject Error:", err);
      alert(err.response?.data?.message || "Failed to reject complaint");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-lg">Loading pending complaints...</div>;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Complaint Verification</h1>
          <p className="text-gray-600">Approve / Reject & Route to concerned government body</p>
        </div>
        <button 
          onClick={fetchComplaints}
          className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-xl text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow">
          <p className="text-xl text-gray-500">No pending complaints at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {complaints.map((complaint) => {
            const categoryName = complaint.category?.display_name || complaint.category || "Others";

            return (
              <div key={complaint.reference_id} className="bg-white rounded-3xl shadow p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-xl font-bold">{complaint.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {categoryName} • {complaint.priority || "Normal"}
                    </p>
                  </div>
                  <span className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">PENDING</span>
                </div>

                <p className="text-gray-700 mb-5 line-clamp-4">{complaint.description}</p>

                <div className="text-sm space-y-2 mb-6">
                  <p><strong>Location:</strong> {complaint.municipality}, Ward {complaint.ward}</p>
                  <p><strong>Submitted by:</strong> {complaint.user?.username || "User"}</p>
                </div>

                {complaint.image && (
                  <img 
                    src={complaint.image} 
                    alt="Evidence" 
                    className="w-full h-52 object-cover rounded-2xl mb-6"
                  />
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => handleApprove(complaint.reference_id, categoryName)}
                    disabled={processingId === complaint.reference_id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-medium disabled:opacity-70 transition"
                  >
                    {processingId === complaint.reference_id ? "Processing..." : "✅ Approve & Forward"}
                  </button>

                  <button
                    onClick={() => handleReject(complaint.reference_id)}
                    disabled={processingId === complaint.reference_id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-medium disabled:opacity-70 transition"
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