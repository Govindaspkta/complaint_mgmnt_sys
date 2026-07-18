// import { useState, useEffect } from 'react';
// import {
//   Search,
//   Eye,
//   Filter,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
//   XCircle,
//   Loader2,
//   Calendar,
//   MapPin,
//   ArrowRight,
//   FileText
// } from 'lucide-react';
// import { getMyComplaints } from '../api/complaintApi';

// export default function MyComplaints() {
//   const [complaints, setComplaints] = useState([]);
//   const [filteredComplaints, setFilteredComplaints] = useState([]);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch My Complaints
//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const res = await getMyComplaints();
        
//         const data = res.data?.data?.results || 
//                     res.data?.results || 
//                     res.data || [];
        
//         setComplaints(data);
//         setFilteredComplaints(data);
//       } catch (err) {
//         console.error("Failed to fetch complaints", err);
//         setError("Failed to load your complaints. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComplaints();
//   }, []);

//   // Real-time Search + Filter
//   useEffect(() => {
//     const filtered = complaints.filter((c) => {
//       const searchTerm = search.toLowerCase();
      
//       const matchesSearch = 
//         (c.title?.toLowerCase().includes(searchTerm) ||
//          c.description?.toLowerCase().includes(searchTerm) ||
//          (c.reference_id?.toLowerCase().includes(searchTerm)) ||
//          (c.category?.name?.toLowerCase().includes(searchTerm)));

//       const matchesStatus = 
//         statusFilter === 'All' || 
//         (c.status && c.status.toLowerCase() === statusFilter.toLowerCase()) ||
//         (c.complaint_status && c.complaint_status.toLowerCase() === statusFilter.toLowerCase());

//       return matchesSearch && matchesStatus;
//     });

//     setFilteredComplaints(filtered);
//   }, [search, statusFilter, complaints]);

//   const getStatusBadge = (status) => {
//     const s = (status || '').toLowerCase();
//     if (s.includes('pending')) return 'bg-amber-100 text-amber-700 border border-amber-200';
//     if (s.includes('approved')) return 'bg-blue-100 text-blue-700 border border-blue-200';
//     if (s.includes('progress') || s.includes('processing')) return 'bg-orange-100 text-orange-700 border border-orange-200';
//     if (s.includes('resolved')) return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
//     if (s.includes('rejected')) return 'bg-red-100 text-red-700 border border-red-200';
//     return 'bg-gray-100 text-gray-700 border border-gray-200';
//   };

//   const getStatusIcon = (status) => {
//     const s = (status || '').toLowerCase();
//     if (s.includes('pending')) return <Clock size={18} />;
//     if (s.includes('resolved')) return <CheckCircle size={18} />;
//     if (s.includes('rejected')) return <XCircle size={18} />;
//     if (s.includes('progress') || s.includes('processing')) return <AlertTriangle size={18} />;
//     return <Clock size={18} />;
//   };

//   const getPriorityColor = (priority) => {
//     if (priority === 'high' || priority === 'urgent') return 'bg-red-100 text-red-700';
//     if (priority === 'low') return 'bg-green-100 text-green-700';
//     return 'bg-amber-100 text-amber-700';
//   };

//   const getComplaintStats = () => {
//     const total = complaints.length;
//     const pending = complaints.filter(c => (c.status || c.complaint_status || '').toLowerCase().includes('pending')).length;
//     const resolved = complaints.filter(c => (c.status || c.complaint_status || '').toLowerCase().includes('resolved')).length;
//     return { total, pending, resolved };
//   };

//   const stats = getComplaintStats();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="animate-spin" size={56} style={{ color: 'var(--primary-600)' }} />
//           <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>Loading your complaints...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
//         <div className="text-center max-w-md">
//           <AlertTriangle size={64} className="mx-auto mb-6" style={{ color: 'var(--error-600)' }} />
//           <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{error}</h3>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="px-8 py-3 rounded-xl font-medium transition-all active:scale-[0.97] shadow-sm"
//             style={{ backgroundColor: 'var(--primary-600)', color: 'white' }}
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
//       <div className="max-w-[1440px] mx-auto">        
//         {/* Header Section */}
//         <div className="mb-8 sm:mb-10 lg:mb-12">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
//             <div>
//               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-h)' }}>
//                 My Complaints
//               </h1>
//               <p className="text-base sm:text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
//                 Track your complaints from submission to resolution. Monitor status updates in real-time.
//               </p>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-8">
//             <div className="p-5 sm:p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Total Complaints</p>
//                   <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
//                 </div>
//                 <FileText size={32} style={{ color: 'var(--primary-600)' }} className="opacity-80" />
//               </div>
//             </div>

//             <div className="p-5 sm:p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Pending</p>
//                   <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--warning-600)' }}>{stats.pending}</p>
//                 </div>
//                 <Clock size={32} style={{ color: 'var(--warning-600)' }} className="opacity-80" />
//               </div>
//             </div>

//             <div className="p-5 sm:p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Resolved</p>
//                   <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--success-600)' }}>{stats.resolved}</p>
//                 </div>
//                 <CheckCircle size={32} style={{ color: 'var(--success-600)' }} className="opacity-80" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search & Filter */}
//         <div className="mb-8 sm:mb-10 rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-8" 
//              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
//             <div className="lg:col-span-2 relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--text-tertiary)' }} />
//               <input
//                 type="text"
//                 placeholder="Search by title, description, or reference ID..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-50 border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 transition-all text-base"
//                 style={{ borderColor: 'var(--border)', '--tw-ring-color': 'var(--primary-600)' }}
//               />
//             </div>

//             <div className="flex items-center gap-2 sm:gap-3">
//               <Filter size={20} style={{ color: 'var(--text-tertiary)' }} className="hidden sm:block" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full px-4 py-3 sm:py-4 bg-gray-50 border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 transition-all text-base font-medium"
//                 style={{ borderColor: 'var(--border)', '--tw-ring-color': 'var(--primary-600)' }}
//               >
//                 <option value="All">All Status</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Approved">Approved</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Resolved">Resolved</option>
//                 <option value="Rejected">Rejected</option>
//               </select>
//             </div>
//           </div>

//           {filteredComplaints.length > 0 && (
//             <p className="text-sm mt-4" style={{ color: 'var(--text-tertiary)' }}>
//               Showing <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{filteredComplaints.length}</span> complaint{filteredComplaints.length !== 1 ? 's' : ''}
//             </p>
//           )}
//         </div>

//         {/* Complaints List */}
//         {filteredComplaints.length > 0 ? (
//           <div className="space-y-4 sm:space-y-6 lg:space-y-8">
//             {filteredComplaints.map((complaint) => (
//               <div
//                 key={complaint.reference_id || complaint.id}
//                 className="rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden hover:shadow-lg group cursor-pointer"
//                 style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
//               >
//                 <div className="p-5 sm:p-7 lg:p-10">
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
//                     <div className="lg:col-span-3">
//                       <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-6">
//                         <h2 className="text-xl sm:text-2xl lg:text-2xl font-semibold flex-1" style={{ color: 'var(--text-h)' }}>
//                           {complaint.title}
//                         </h2>
//                         <span className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusBadge(complaint.status || complaint.complaint_status)}`}>
//                           {getStatusIcon(complaint.status || complaint.complaint_status)}
//                           <span>{complaint.status || complaint.complaint_status || 'Pending'}</span>
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 text-sm sm:text-base">
//                         <div className="flex items-center gap-3">
//                           <FileText size={18} style={{ color: 'var(--text-tertiary)' }} className="flex-shrink-0" />
//                           <div>
//                             <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Reference ID</p>
//                             <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
//                               {complaint.reference_id || 'N/A'}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                           <MapPin size={18} style={{ color: 'var(--text-tertiary)' }} className="flex-shrink-0" />
//                           <div>
//                             <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Category</p>
//                             <p className="font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
//                               {complaint.category?.name || complaint.category || 'General'}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                           <Calendar size={18} style={{ color: 'var(--text-tertiary)' }} className="flex-shrink-0" />
//                           <div>
//                             <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Submitted</p>
//                             <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
//                               {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : 'N/A'}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                           <AlertTriangle size={18} style={{ color: 'var(--text-tertiary)' }} className="flex-shrink-0" />
//                           <div>
//                             <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Priority</p>
//                             <p className={`capitalize px-3 py-1 rounded-lg text-xs font-semibold w-fit ${getPriorityColor(complaint.priority)}`}>
//                               {complaint.priority || 'Medium'}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {complaint.description && (
//                         <div className="text-sm sm:text-base leading-relaxed p-4 rounded-xl" 
//                              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderLeft: '4px solid var(--primary-600)' }}>
//                           {complaint.description.substring(0, 200)}{complaint.description.length > 200 ? '...' : ''}
//                         </div>
//                       )}
//                     </div>

//                     <div className="lg:col-span-1 flex flex-col items-stretch lg:items-end justify-center pt-4 lg:pt-0">
//                       <button
//                         // onClick={() => alert(`Opening details for: ${complaint.title}`)}
//                           onClick={() => navigate(`/complaints/${complaint.reference_id}`)} //complaint details
//                         className="flex items-center justify-center lg:justify-end gap-2 px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-all active:scale-95 text-sm sm:text-base"
//                         style={{ backgroundColor: 'var(--primary-600)', color: 'white' }}
//                       >
//                         <Eye size={18} />
//                         View Details
//                         <ArrowRight size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="rounded-2xl sm:rounded-3xl border p-8 sm:p-12 lg:p-16 text-center" 
//                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
//             <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-4xl sm:text-5xl mb-6" 
//                  style={{ backgroundColor: 'var(--bg-secondary)' }}>
//               📭
//             </div>
//             <h3 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: 'var(--text-h)' }}>
//               No complaints found
//             </h3>
//             <p className="text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
//               {search || statusFilter !== 'All' 
//                 ? 'Try adjusting your search filters.' 
//                 : "You haven't submitted any complaints yet."}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MapPin,
  ArrowRight,
  FileText
} from 'lucide-react';
import { getMyComplaints } from '../api/complaintApi';

export default function MyComplaints() {
  const navigate = useNavigate();
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
      const searchTerm = search.toLowerCase();
      
      const matchesSearch = 
        (c.title?.toLowerCase().includes(searchTerm) ||
         c.description?.toLowerCase().includes(searchTerm) ||
         (c.reference_id?.toLowerCase().includes(searchTerm)) ||
         (c.category?.name?.toLowerCase().includes(searchTerm)));

      const currentStatus = getNormalizedStatus(c);

      const matchesStatus = 
        statusFilter === 'All' || 
        currentStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    setFilteredComplaints(filtered);
  }, [search, statusFilter, complaints]);

  // Dynamic Status Helper
  const getNormalizedStatus = (complaint) => {
    if (!complaint) return 'Pending';
    return (complaint.status || complaint.complaint_status || 'Pending').trim();
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s.includes('pending')) return 'bg-amber-100 text-amber-700 border border-amber-200';
    if (s.includes('approved')) return 'bg-blue-100 text-blue-700 border border-blue-200';
    if (s.includes('progress') || s.includes('processing')) return 'bg-orange-100 text-orange-700 border border-orange-200';
    if (s.includes('resolved')) return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    if (s.includes('rejected')) return 'bg-red-100 text-red-700 border border-red-200';
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  const getStatusIcon = (status) => {
    const s = status.toLowerCase();
    if (s.includes('pending')) return <Clock size={18} />;
    if (s.includes('resolved')) return <CheckCircle size={18} />;
    if (s.includes('rejected')) return <XCircle size={18} />;
    if (s.includes('progress') || s.includes('processing')) return <AlertTriangle size={18} />;
    return <Clock size={18} />;
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high' || priority === 'urgent') return 'bg-red-100 text-red-700';
    if (priority === 'low') return 'bg-green-100 text-green-700';
    return 'bg-amber-100 text-amber-700';
  };

  const getComplaintStats = () => {
    const total = complaints.length;
    const pending = complaints.filter(c => getNormalizedStatus(c).toLowerCase().includes('pending')).length;
    const resolved = complaints.filter(c => getNormalizedStatus(c).toLowerCase().includes('resolved')).length;
    return { total, pending, resolved };
  };

  const stats = getComplaintStats();

  const handleViewDetails = (complaint) => {
    const status = getNormalizedStatus(complaint).toLowerCase();
    if (status === 'rejected') {
      navigate(`/complaints/${complaint.reference_id}`);
    } else {
      alert("You can only edit complaints that are REJECTED by admin.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin" size={56} style={{ color: 'var(--primary-600)' }} />
          <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>Loading your complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="text-center max-w-md">
          <AlertTriangle size={64} className="mx-auto mb-6" style={{ color: 'var(--error-600)' }} />
          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{error}</h3>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 rounded-xl font-medium transition-all active:scale-[0.97] shadow-sm"
            style={{ backgroundColor: 'var(--primary-600)', color: 'white' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-[1440px] mx-auto">        
        {/* Header + Stats */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-h)' }}>
                My Complaints
              </h1>
              <p className="text-base sm:text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                Track your complaints from submission to resolution.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-8">
            <div className="p-5 sm:p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Total Complaints</p>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
                </div>
                <FileText size={32} style={{ color: 'var(--primary-600)' }} className="opacity-80" />
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--warning-600)' }}>{stats.pending}</p>
                </div>
                <Clock size={32} style={{ color: 'var(--warning-600)' }} className="opacity-80" />
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Resolved</p>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--success-600)' }}>{stats.resolved}</p>
                </div>
                <CheckCircle size={32} style={{ color: 'var(--success-600)' }} className="opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 sm:mb-10 rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-8" 
             style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search by title, description, or reference ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-50 border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 transition-all text-base"
                style={{ borderColor: 'var(--border)', '--tw-ring-color': 'var(--primary-600)' }}
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Filter size={20} style={{ color: 'var(--text-tertiary)' }} className="hidden sm:block" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 bg-gray-50 border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 transition-all text-base font-medium"
                style={{ borderColor: 'var(--border)', '--tw-ring-color': 'var(--primary-600)' }}
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
        </div>

        {/* Complaints List */}
        {filteredComplaints.length > 0 ? (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {filteredComplaints.map((complaint) => {
              const currentStatus = getNormalizedStatus(complaint);
              return (
                <div
                  key={complaint.reference_id || complaint.id}
                  className="rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden hover:shadow-lg group cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
                >
                  <div className="p-5 sm:p-7 lg:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                      <div className="lg:col-span-3">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-6">
                          <h2 className="text-xl sm:text-2xl lg:text-2xl font-semibold flex-1" style={{ color: 'var(--text-h)' }}>
                            {complaint.title}
                          </h2>
                          <span className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusBadge(currentStatus)}`}>
                            {getStatusIcon(currentStatus)}
                            <span>{currentStatus}</span>
                          </span>
                        </div>

                        {/* Rest of your card content remains the same */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 text-sm sm:text-base">
                          <div className="flex items-center gap-3">
                            <FileText size={18} style={{ color: 'var(--text-tertiary)' }} className="flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Reference ID</p>
                              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {complaint.reference_id || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <MapPin size={18} style={{ color: 'var(--text-tertiary)' }} className="flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Category</p>
                              <p className="font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                                {complaint.category?.name || complaint.category || 'General'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar size={18} style={{ color: 'var(--text-tertiary)' }} className="flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Submitted</p>
                              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <AlertTriangle size={18} style={{ color: 'var(--text-tertiary)' }} className="flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Priority</p>
                              <p className={`capitalize px-3 py-1 rounded-lg text-xs font-semibold w-fit ${getPriorityColor(complaint.priority)}`}>
                                {complaint.priority || 'Medium'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {complaint.description && (
                          <div className="text-sm sm:text-base leading-relaxed p-4 rounded-xl" 
                               style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderLeft: '4px solid var(--primary-600)' }}>
                            {complaint.description.substring(0, 200)}{complaint.description.length > 200 ? '...' : ''}
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-1 flex flex-col items-stretch lg:items-end justify-center pt-4 lg:pt-0">
                        <button
                          onClick={() => handleViewDetails(complaint)}
                          className="flex items-center justify-center lg:justify-end gap-2 px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-all active:scale-95 text-sm sm:text-base"
                          style={{ backgroundColor: 'var(--primary-600)', color: 'white' }}
                        >
                          <Eye size={18} />
                          View Details
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-3xl border p-8 sm:p-12 lg:p-16 text-center" 
               style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-4xl sm:text-5xl mb-6" 
                 style={{ backgroundColor: 'var(--bg-secondary)' }}>
              📭
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: 'var(--text-h)' }}>
              No complaints found
            </h3>
            <p className="text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
              {search || statusFilter !== 'All' 
                ? 'Try adjusting your search filters.' 
                : "You haven't submitted any complaints yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}