import { useEffect, useState, useCallback } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
    is_active: true,
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      console.log("📋 FULL RESPONSE:", res.data);

      const data = res.data?.success && res.data?.data?.results 
        ? res.data.data.results 
        : [];
      setCategories(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", display_name: "", description: "", is_active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.display_name.trim()) {
      alert("System Name and Display Name are required!");
      return;
    }

    try {
      setSubmitting(true);
      console.log("🚀 SUBMITTING...", { isUpdate: !!editingId, editingId, formData });

      if (editingId) {
        console.log(`📤 PUT to: /complaints/categories/${editingId}`);
        const res = await updateCategory(editingId, formData);
        console.log("✅ UPDATE SUCCESS:", res.data);
        alert("✅ Category Updated Successfully");
      } else {
        const res = await createCategory(formData);
        console.log("✅ CREATE SUCCESS:", res.data);
        alert("✅ Category Created Successfully");
      }

      resetForm();
      await fetchCategories();
    } catch (err) {
      console.error("❌ ERROR:", err);
      console.error("Response:", err.response?.data);
      alert(err.response?.data?.message || "Operation failed. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    console.log("✏️ Editing:", cat);
    setEditingId(cat.reference_id);
    setFormData({
      name: cat.name || "",
      display_name: cat.display_name || "",
      description: cat.description || "",
      is_active: cat.is_active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (reference_id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(reference_id);
      alert("✅ Category Deleted");
      await fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Cannot delete this category (may be in use)");
    }
  };

  const filtered = categories.filter(c =>
    c.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Category Management</h1>
      <p className="text-gray-600 mb-8">Manage categories → Approved complaints route to govt systems (NEA etc.)</p>

      {/* FORM */}
      <div className="bg-white p-8 rounded-3xl shadow-xl mb-10">
        <h2 className="text-2xl font-semibold mb-6">
          {editingId ? "✏️ Edit Category" : "➕ Create New Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">System Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-4 rounded-2xl"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Display Name</label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className="w-full border p-4 rounded-2xl"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-4 rounded-2xl h-32"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <label>Active</label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-medium disabled:opacity-70"
            >
              {submitting ? "Processing..." : editingId ? "Update Category" : "Create Category"}
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
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Existing Categories ({filtered.length})</h2>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-5 py-3 rounded-2xl w-80"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cat) => (
          <div key={cat.reference_id} className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl">{cat.display_name}</h3>
            <p className="text-gray-500">{cat.name}</p>
            {cat.description && <p className="mt-3 text-sm text-gray-600">{cat.description}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleEdit(cat)}
                className="flex-1 bg-yellow-500 text-white py-3 rounded-2xl"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.reference_id)}
                className="flex-1 bg-red-500 text-white py-3 rounded-2xl"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}