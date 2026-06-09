import { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Calendar,
  MapPin
} from 'lucide-react';
import { getMyComplaints } from '../api/complaintApi';

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
    if (s.includes('pending')) return 'bg-amber-100 text-amber-700 border border-amber-200';
    if (s.includes('approved')) return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (s.includes('progress') || s.includes('processing')) return 'bg-orange-100 text-orange-700 border border-orange-200';
    if (s.includes('resolved')) return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={56} />
          <p className="text-gray-600 font-medium text-lg">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle size={64} className="mx-auto text-red-500" />
          <h3 className="text-2xl font-semibold mt-6">{error}</h3>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-gray-600 mt-3 text-lg max-w-md mx-auto md:mx-0">
            Track your complaints from submission to government forwarding
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6 mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-4 text-gray-400" size={22} />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter size={22} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-64 px-6 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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

        {/* Complaints List - Clean One-by-One Cards */}
        {filteredComplaints.length > 0 ? (
          <div className="space-y-8">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.reference_id || complaint.id}
                className="bg-white rounded-3xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-100 group"
              >
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-5">
                        <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
                          {complaint.title}
                        </h2>
                        <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-semibold ${getStatusBadge(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          {complaint.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-gray-600">
                        <div className="flex items-center gap-3">
                          <MapPin size={18} className="text-gray-400" />
                          <span><span className="font-medium">Category:</span> {complaint.category || complaint.complaint_type || 'General'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-gray-400" />
                          <span><span className="font-medium">Submitted:</span> {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">Priority:</span>
                          <span className={`capitalize px-4 py-1 rounded-xl text-sm font-medium ${complaint.priority === 'high' || complaint.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {complaint.priority || 'Medium'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {complaint.department || 'Auto Routed'}
                        </div>
                      </div>

                      {complaint.description && (
                        <div className="mt-6 text-gray-700 leading-relaxed border-l-4 border-gray-200 pl-5">
                          {complaint.description}
                        </div>
                      )}
                    </div>

                    {/* Right Action */}
                    <div className="flex-shrink-0 flex flex-col items-center md:items-end gap-4 pt-2">
                      <button
                        onClick={() => {
                          const id = complaint.reference_id || complaint.id;
                          alert(`Opening details for Complaint ID: ${id}`);
                          // TODO: Use react-router navigate(`/complaints/${id}`)
                        }}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-3xl font-medium transition-all active:scale-[0.97] shadow-sm group-hover:scale-105"
                      >
                        <Eye size={20} />
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow p-20 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl mb-6">
              📭
            </div>
            <h3 className="text-3xl font-semibold text-gray-800">No complaints found</h3>
            <p className="text-gray-500 mt-3 text-lg">You haven't submitted any complaints yet or try changing filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}