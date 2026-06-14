import { useEffect, useState, useCallback } from "react";
import { getAllComplaints, updateComplaintAdmin } from "../../api/complaintApi";

export default function ComplaintVerification() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllComplaints();
      
      let data = res.data?.success && res.data?.data?.results 
        ? res.data.data.results 
        : res.data?.data || res.data || [];

      const pending = data.filter(c => c.status?.toLowerCase() === "pending");
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

  const handleApprove = async (reference_id) => {
    setProcessingId(reference_id);
    try {
      await updateComplaintAdmin(reference_id, { status: "approved" });
      alert("✅ Complaint Approved Successfully");
      await fetchComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to approve");
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (reference_id) => {
    setRejectModal(reference_id);
    setRejectReason("");
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

    setProcessingId(rejectModal);
    try {
      await updateComplaintAdmin(rejectModal, {
        status: "rejected",
        rejection_reason: rejectReason
      });
      alert("❌ Complaint Rejected Successfully");
      setRejectModal(null);
      setRejectReason("");
      await fetchComplaints();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to reject");
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
          <p className="text-gray-600">Approve or Reject complaints (Admin Only)</p>
        </div>
        <button onClick={fetchComplaints} className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-xl text-sm font-medium">
          Refresh
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow">No pending complaints at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint.reference_id} className="bg-white rounded-3xl shadow p-6 border">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-xl font-bold">{complaint.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {complaint.category?.display_name || complaint.category} • {complaint.priority || "Normal"}
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
                <img src={complaint.image} alt="Evidence" className="w-full h-52 object-cover rounded-2xl mb-6" />
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleApprove(complaint.reference_id)}
                  disabled={processingId === complaint.reference_id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-medium disabled:opacity-70"
                >
                  {processingId === complaint.reference_id ? "Processing..." : "✅ Approve"}
                </button>

                <button
                  onClick={() => openRejectModal(complaint.reference_id)}
                  disabled={processingId === complaint.reference_id}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-medium disabled:opacity-70"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Reject Complaint</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Write reason for rejection..."
              className="w-full border p-4 rounded-2xl h-32"
            />
            <div className="flex gap-4 mt-6">
              <button onClick={() => {setRejectModal(null); setRejectReason("");}} className="flex-1 py-4 border rounded-2xl">Cancel</button>
              <button onClick={handleReject} className="flex-1 bg-red-600 text-white py-4 rounded-2xl">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}