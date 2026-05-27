export default function DashboardOverview() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="bg-white p-6 rounded-2xl shadow">
        Total Users
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        Pending Profiles
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        Complaints
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        Categories
      </div>

    </div>
  );
}