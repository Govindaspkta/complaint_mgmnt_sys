import { useEffect, useState } from "react";
// import { getAllComplaints, updateComplaint } from "../../api/complaintApi";

export default function ComplaintVerification() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await getAllComplaints();
      
      console.log("COMPLAINTS API RESPONSE:", res.data);

      const data = res.data.data || res.data || [];
      // Filter only pending complaints
      const pending = data.filter(c => 
        c.status === "PENDING" || c.verification_status === "PENDING"
      );
      
      setComplaints(pending);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleApprove = async (reference_id) => {
    try {
      await updateComplaint(reference_id, { 
        status: "APPROVED",
        verification_status: "APPROVED" 
      });
      alert("Complaint Approved & Forwarded to Government Body");
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Failed to approve");
    }
  };

  const handleReject = async (reference_id) => {
    if (!window.confirm("Reject this complaint?")) return;
    
    try {
      await updateComplaint(reference_id, { 
        status: "REJECTED",
        verification_status: "REJECTED" 
      });
      alert("Complaint Rejected");
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Failed to reject");
    }
  };

  if (loading) return <p className="text-center py-20 text-lg">Loading complaints...</p>;
  if (error) return <p className="text-red-600 text-center py-10">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Complaint Verification</h1>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow">
          <p className="text-xl text-gray-600">No pending complaints for verification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint.reference_id} className="bg-white rounded-3xl shadow p-6">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{complaint.title}</h2>
                  <p className="text-gray-500 text-sm">
                    {complaint.category} • {complaint.priority}
                  </p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  PENDING
                </span>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {complaint.description}
              </p>

              <div className="text-sm space-y-1 mb-5">
                <p><strong>Location:</strong> {complaint.municipality}, Ward {complaint.ward}</p>
                <p><strong>Submitted by:</strong> {complaint.user?.username || "User"}</p>
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
                  onClick={() => handleApprove(complaint.reference_id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-medium hover:bg-green-700"
                >
                  Approve & Forward
                </button>
                <button
                  onClick={() => handleReject(complaint.reference_id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-medium hover:bg-red-700"
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