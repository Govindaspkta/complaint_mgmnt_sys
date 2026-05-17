import { useState } from 'react';
import {
  Search,
  Eye,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export default function MyComplaints() {

  // 🔥 Dummy Data
  const complaintsData = [
    {
      id: 1,
      title: "Street Light Not Working",
      category: "Electricity",
      department: "Electricity Department",
      status: "Pending",
      priority: "High",
      created_at: "2026-05-17"
    },
    {
      id: 2,
      title: "Road Damaged Near Bus Park",
      category: "Roads",
      department: "Road Department",
      status: "Resolved",
      priority: "Medium",
      created_at: "2026-05-15"
    },
    {
      id: 3,
      title: "Water Leakage Problem",
      category: "Water Supply",
      department: "Water Department",
      status: "In Progress",
      priority: "High",
      created_at: "2026-05-14"
    },
    {
      id: 4,
      title: "Garbage Not Collected",
      category: "Waste Management",
      department: "Municipality",
      status: "Rejected",
      priority: "Low",
      created_at: "2026-05-12"
    }
  ];

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // 🔥 Filter Complaints
  const filteredComplaints = complaintsData.filter((complaint) => {

    const matchesSearch =
      complaint.title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      complaint.status === statusFilter;

    return matchesSearch && matchesStatus;

  });

  // 🔥 Status Badge
  const getStatusBadge = (status) => {

    switch (status) {

      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'Resolved':
        return 'bg-green-100 text-green-700';

      case 'Rejected':
        return 'bg-red-100 text-red-700';

      case 'In Progress':
        return 'bg-orange-100 text-orange-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // 🔥 Status Icon
  const getStatusIcon = (status) => {

    switch (status) {

      case 'Pending':
        return <Clock size={18} />;

      case 'Resolved':
        return <CheckCircle size={18} />;

      case 'Rejected':
        return <XCircle size={18} />;

      case 'In Progress':
        return <AlertTriangle size={18} />;

      default:
        return null;
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 px-4 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            My Complaints
          </h1>

          <p className="text-gray-500 mt-2">
            Track and monitor all your submitted complaints.
          </p>

        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-3xl shadow-md p-5 mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

          {/* Search */}
          <div className="relative w-full md:w-[400px]">

            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">

            <Filter size={18} className="text-gray-500" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >

              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>

            </select>

          </div>

        </div>

        {/* Complaint Cards */}
        <div className="grid gap-6">

          {filteredComplaints.length > 0 ? (

            filteredComplaints.map((complaint) => (

              <div
                key={complaint.id}
                className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  {/* Left */}
                  <div className="space-y-3">

                    <div className="flex items-center gap-3">

                      <h2 className="text-2xl font-bold text-gray-800">
                        {complaint.title}
                      </h2>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusBadge(complaint.status)}`}
                      >

                        {getStatusIcon(complaint.status)}

                        {complaint.status}

                      </span>

                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-gray-600">

                      <p>
                        <span className="font-semibold">
                          Category:
                        </span>{' '}
                        {complaint.category}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Department:
                        </span>{' '}
                        {complaint.department}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Priority:
                        </span>{' '}
                        {complaint.priority}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Submitted:
                        </span>{' '}
                        {complaint.created_at}
                      </p>

                    </div>

                  </div>

                  {/* Right */}
                  <div>

                    <button
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-500 text-white hover:opacity-90 transition"
                    >

                      <Eye size={18} />

                      View Details

                    </button>

                  </div>

                </div>

              </div>

            ))

          ) : (

            <div className="bg-white rounded-3xl shadow-md p-10 text-center">

              <h3 className="text-2xl font-bold text-gray-700">
                No Complaints Found
              </h3>

              <p className="text-gray-500 mt-2">
                Try changing search or filter options.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}