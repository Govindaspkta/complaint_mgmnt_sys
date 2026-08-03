import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, ThumbsUp } from 'lucide-react';
import { getComplaintClusters } from '../api/complaintApi';

export default function HotspotComplaints() {
  const [clusters, setClusters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        setLoading(true);
        const res = await getComplaintClusters();
        const data = res.data?.data || res.data || {};
        setClusters(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load hotspots.");
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading hotspots...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  const clusterIds = Object.keys(clusters);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <MapPin size={32} className="text-red-600" />
        <h1 className="text-4xl font-bold">Complaint Hotspots</h1>
      </div>

      {clusterIds.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow">
          <AlertTriangle size={60} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">No hotspots found yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {clusterIds.map((clusterId) => {
            const complaints = clusters[clusterId] || [];
            const first = complaints[0] || {};

            return (
              <div key={clusterId} className="bg-white rounded-3xl shadow p-6">
                {/* Cluster Header */}
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Cluster {Number(clusterId) + 1}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      {first.category || "General"} • {first.district}, {first.municipality}, Ward {first.ward}
                    </p>
                  </div>
                  <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-medium">
                    {complaints.length} Complaints
                  </span>
                </div>

                {/* Complaints inside cluster */}
                <div className="space-y-4">
                  {complaints.map((complaint, index) => (
                    <div
                      key={complaint.reference_id || index}
                      className="border rounded-2xl p-5 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{complaint.title}</h3>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {complaint.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {complaint.province} • {complaint.district} • {complaint.municipality} • Ward {complaint.ward}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            Score: {complaint.priority_score}
                          </span>
                          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1 justify-end">
                            <ThumbsUp size={14} /> {complaint.upvotes_count || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}