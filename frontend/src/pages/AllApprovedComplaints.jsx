import { useState, useEffect } from 'react';
import { Users, Clock, ShieldCheck, Eye, ThumbsUp } from 'lucide-react';
import { getAllComplaints, toggleUpvote } from '../api/complaintApi';

export default function AllApprovedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvotingId, setUpvotingId] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await getAllComplaints();

        let allComplaints = res.data?.data?.results || res.data?.results || res.data || [];

        const approvedComplaints = allComplaints.filter(
          complaint =>
            (complaint.verification_status || complaint.status || "").toUpperCase() === "APPROVED"
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

  const handleToggleUpvote = async (reference_id, index) => {
    if (upvotingId) return;
    setUpvotingId(reference_id);

    // Optimistic update (instant color change)
    setComplaints(prev => {
      const updated = [...prev];
      const current = updated[index];
      updated[index] = {
        ...current,
        has_upvoted: !current.has_upvoted,
        upvotes_count: current.has_upvoted
          ? Math.max((current.upvotes_count || 0) - 1, 0)
          : (current.upvotes_count || 0) + 1
      };
      return updated;
    });

    try {
      const res = await toggleUpvote(reference_id);

      // Sync with real backend data
      const newCount = res.data?.data?.upvotes_count ?? res.data?.upvotes_count;
      const newHasUpvoted = res.data?.data?.has_upvoted ?? res.data?.has_upvoted;

      if (newCount !== undefined) {
        setComplaints(prev => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            upvotes_count: newCount,
            has_upvoted: Boolean(newHasUpvoted)
          };
          return updated;
        });
      }
    } catch (err) {
      // Revert if failed
      setComplaints(prev => {
        const updated = [...prev];
        const current = updated[index];
        updated[index] = {
          ...current,
          has_upvoted: !current.has_upvoted,
          upvotes_count: current.has_upvoted
            ? (current.upvotes_count || 0) + 1
            : Math.max((current.upvotes_count || 0) - 1, 0)
        };
        return updated;
      });
      alert(err.response?.data?.message || "Failed to upvote");
    } finally {
      setUpvotingId(null);
    }
  };

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
          {complaints.map((complaint, index) => (
            <div
              key={complaint.reference_id || index}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition-all duration-300"
            >
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
                  {new Date(complaint.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Upvote Button */}
              <button
                onClick={() => handleToggleUpvote(complaint.reference_id, index)}
                disabled={upvotingId === complaint.reference_id}
                className={`mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all w-full justify-center ${
                  complaint.has_upvoted
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ThumbsUp
                  size={18}
                  className={complaint.has_upvoted ? "fill-current" : ""}
                />
                {complaint.upvotes_count || 0} Upvotes
              </button>

              {complaint.image && (
                <button
                  onClick={() => window.open(complaint.image, '_blank')}
                  className="mt-3 text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 mx-auto"
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