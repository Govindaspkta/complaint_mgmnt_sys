import { useState, useEffect } from 'react';
import { Users, Clock, ShieldCheck, Eye } from 'lucide-react';
import { getAllComplaints } from '../api/complaintApi';

export default function AllApprovedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await getAllComplaints();
        
        console.log("All Complaints Response:", res.data);

        let allComplaints = res.data?.data?.results || res.data?.results || res.data || [];

        // Filter only APPROVED complaints
        const approvedComplaints = allComplaints.filter(
          complaint => complaint.verification_status === "APPROVED" || 
                      complaint.status === "APPROVED"
        );

        setComplaints(approvedComplaints);
      } catch (err) {
        console.error("Failed to load complaints", err);
        setError("Failed to load complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading approved complaints...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck size={32} className="text-green-600" />
          <h1 className="text-4xl font-bold">All Approved Complaints</h1>
        </div>
        <p className="text-gray-500">Total Approved: <strong>{complaints.length}</strong></p>
      </div>

      {complaints.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow">
          <Users size={60} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">No approved complaints yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint.id || complaint.reference_id} 
                 className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-all duration-300">
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg line-clamp-2">{complaint.title}</h3>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  APPROVED
                </span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {complaint.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <div>
                  {complaint.province} • Ward {complaint.ward}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {new Date(complaint.created_at || Date.now()).toLocaleDateString()}
                </div>
              </div>

              {complaint.image && (
                <button 
                  onClick={() => window.open(complaint.image, '_blank')}
                  className="mt-4 text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <Eye size={14} /> View Photo
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}