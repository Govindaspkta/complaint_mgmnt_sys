import { useEffect, useState, useCallback } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/departmentApi";   // ← create this file

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    email: "",
    description: "",
    is_active: true,
  });

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDepartments();
      console.log("📋 Departments response:", res.data);

      const data =
        res.data?.success && res.data?.data?.results
          ? res.data.data.results
          : [];
      setDepartments(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      display_name: "",
      email: "",
      description: "",
      is_active: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.display_name.trim() || !formData.email.trim()) {
      alert("System Name, Display Name and Email are required!");
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        await updateDepartment(editingId, formData);
        alert("✅ Department Updated Successfully");
      } else {
        await createDepartment(formData);
        alert("✅ Department Created Successfully");
      }

      resetForm();
      await fetchDepartments();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (dept) => {
    setEditingId(dept.reference_id);
    setFormData({
      name: dept.name || "",
      display_name: dept.display_name || "",
      email: dept.email || "",
      description: dept.description || "",
      is_active: dept.is_active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (reference_id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await deleteDepartment(reference_id);
      alert("✅ Department Deleted");
      await fetchDepartments();
    } catch (err) {
      console.error(err);
      alert("Cannot delete this department (may be in use by categories)");
    }
  };

  const filtered = departments.filter(
    (d) =>
      d.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Department Management</h1>
      <p className="text-gray-600 mb-8">
        Create departments → Assign them to categories → Complaints will be forwarded to the department email
      </p>

      {/* FORM */}
      <div className="bg-white p-8 rounded-3xl shadow-xl mb-10">
        <h2 className="text-2xl font-semibold mb-6">
          {editingId ? "✏️ Edit Department" : "➕ Create New Department"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">System Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. electricity"
                className="w-full border p-4 rounded-2xl"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Display Name</label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                placeholder="e.g. Electricity Board"
                className="w-full border p-4 rounded-2xl"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Official Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="department@gov.np"
              className="w-full border p-4 rounded-2xl"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-4 rounded-2xl h-28"
              placeholder="Optional description..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              id="is_active"
            />
            <label htmlFor="is_active">Active</label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-medium disabled:opacity-70"
            >
              {submitting
                ? "Processing..."
                : editingId
                ? "Update Department"
                : "Create Department"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-10 py-4 rounded-2xl"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Existing Departments ({filtered.length})
        </h2>
        <input
          type="text"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-5 py-3 rounded-2xl w-80"
        />
      </div>

      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dept) => (
            <div
              key={dept.reference_id}
              className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl">{dept.display_name}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    dept.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {dept.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-gray-500 text-sm">{dept.name}</p>
              <p className="text-blue-600 text-sm mt-1">{dept.email}</p>

              {dept.description && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {dept.description}
                </p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleEdit(dept)}
                  className="flex-1 bg-yellow-500 text-white py-3 rounded-2xl"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dept.reference_id)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-2xl"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}