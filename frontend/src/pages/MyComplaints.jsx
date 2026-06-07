import { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2
} from 'lucide-react';
import { getMyComplaints } from '../api/complaintApi'; // Adjust path if needed

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch My Complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMyComplaints();
        
        // Handle different possible response structures
        const data = res.data?.data?.results || 
                    res.data?.results || 
                    res.data || [];
        
        setComplaints(data);
        setFilteredComplaints(data);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
        setError("Failed to load your complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Real-time Search + Filter
  useEffect(() => {
    const filtered = complaints.filter((c) => {
      const matchesSearch = 
        (c.title?.toLowerCase().includes(search.toLowerCase()) ||
         c.description?.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = 
        statusFilter === 'All' || 
        (c.status && c.status.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });

    setFilteredComplaints(filtered);
  }, [search, statusFilter, complaints]);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('pending')) return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    if (s.includes('approved')) return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (s.includes('progress') || s.includes('processing')) return 'bg-orange-100 text-orange-700 border border-orange-200';
    if (s.includes('resolved')) return 'bg-green-100 text-green-700 border border-green-200';
    if (s.includes('rejected')) return 'bg-red-100 text-red-700 border border-red-200';
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('pending')) return <Clock size={18} />;
    if (s.includes('resolved')) return <CheckCircle size={18} />;
    if (s.includes('rejected')) return <XCircle size={18} />;
    if (s.includes('progress') || s.includes('processing')) return <AlertTriangle size={18} />;
    return <Clock size={18} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={50} />
          <p className="text-gray-600 font-medium">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-gray-600 mt-3 text-lg">
            Track all your complaints — Admin approval → Government forwarding (NEA, etc.)
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl shadow p-5 md:p-6 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter size={20} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length > 0 ? (
          <div className="space-y-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.reference_id || complaint.id}
                className="bg-white rounded-3xl shadow hover:shadow-2xl transition-all duration-300 p-6 md:p-8 border border-transparent hover:border-gray-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-2xl font-semibold text-gray-900">{complaint.title}</h2>
                      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-sm font-semibold ${getStatusBadge(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        {complaint.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                      <p><span className="font-medium text-gray-700">Category:</span> {complaint.category || complaint.complaint_type}</p>
                      <p><span className="font-medium text-gray-700">Department:</span> {complaint.department || 'Will be assigned'}</p>
                      <p><span className="font-medium text-gray-700">Priority:</span> <span className="capitalize">{complaint.priority}</span></p>
                      <p><span className="font-medium text-gray-700">Submitted:</span> {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('en-NP') : 'N/A'}</p>
                    </div>

                    {complaint.description && (
                      <p className="mt-4 text-gray-600 line-clamp-3">{complaint.description}</p>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        const id = complaint.reference_id || complaint.id;
                        alert(`Opening details for Complaint ID: ${id}`);
                        // TODO: Navigate to detail page → window.location = `/complaints/${id}` or use react-router
                      }}
                      className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-3xl font-medium transition-all active:scale-95"
                    >
                      <Eye size={20} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow p-20 text-center">
            <p className="text-6xl mb-4">📭</p>
            <h3 className="text-2xl font-semibold text-gray-800">No complaints found</h3>
            <p className="text-gray-500 mt-2">You haven't submitted any complaints yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}