import { useEffect, useState } from "react";
import { getAdminComplaints } from "../../api/complaintApi";
import { ShieldCheck, Clock, Users } from "lucide-react";

export default function AdminAllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL"); // ALL | APPROVED | REJECTED

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAdminComplaints();

        let data =
          res.data?.data?.results ||
          res.data?.results ||
          res.data?.data ||
          res.data ||
          [];

        // Only verified outcomes for admin log
        const filtered = data.filter((c) => {
          const status = (c.status || "").toUpperCase();
          return status === "APPROVED" || status === "REJECTED";
        });

        setComplaints(filtered);
      } catch (err) {
        console.error(err);
        setError("Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const visible = complaints.filter((c) => {
    if (filter === "ALL") return true;
    return (c.status || "").toUpperCase() === filter;
  });

  if (loading) {
    return <div className="py-20 text-center text-lg">Loading complaints...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-green-600" size={28} />
          <h1 className="text-3xl font-bold">Complaints Log</h1>
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "APPROVED", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p className="text-gray-500 mb-6">
        Showing: <strong>{visible.length}</strong>
      </p>

      {visible.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow">
          <Users size={50} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">No complaints found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {visible.map((c) => {
            const status = (c.status || "").toUpperCase();
            const isApproved = status === "APPROVED";

            return (
              <div key={c.reference_id} className="bg-white rounded-2xl shadow p-6 border">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg line-clamp-2">{c.title}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{c.description}</p>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>
                    <strong>Category:</strong>{" "}
                    {c.category?.display_name || c.category || "-"}
                  </p>
                  <p>
                    <strong>Location:</strong> {c.municipality}, Ward {c.ward}
                  </p>
                  <p>
                    <strong>Priority:</strong> {c.priority}
                  </p>
                  {status === "REJECTED" && c.rejection_reason && (
                    <p>
                      <strong>Rejection:</strong> {c.rejection_reason}
                    </p>
                  )}
                  <p className="flex items-center gap-1 pt-1">
                    <Clock size={14} />
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}