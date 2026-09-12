import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/dashboardApi"; // ✅ FIXED

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    total_users: 0,
    pending_profiles: 0,
    total_complaints: 0,
    total_categories: 0,
  });
useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();

      console.log("API RESPONSE:", res);

      if (res?.data?.data) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  fetchStats();
}, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500 text-sm">Total Users</p>
        <h2 className="text-2xl font-bold">{stats.total_users}</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500 text-sm">Pending Profiles</p>
        <h2 className="text-2xl font-bold">{stats.pending_profiles}</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500 text-sm">Complaints</p>
        <h2 className="text-2xl font-bold">{stats.total_complaints}</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500 text-sm">Categories</p>
        <h2 className="text-2xl font-bold">{stats.total_categories}</h2>
      </div>

    </div>
  );
}