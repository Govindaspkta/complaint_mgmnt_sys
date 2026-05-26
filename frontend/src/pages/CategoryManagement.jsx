import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", display_name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setError(null);
      const res = await getCategories();
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Category API Error:", err);
      setError("Could not load categories. Check API.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ name: "", display_name: "", description: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
      } else {
        await createCategory(formData);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError("Failed to save category. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setFormData({
      name: cat.name,
      display_name: cat.display_name,
      description: cat.description || ""
    });
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Complaint Category Management</h1>
        <p className="text-gray-500">Used for smart forwarding to NEA and other government systems</p>
      </div>

      {error && <div className="bg-red-50 border border-red-300 p-4 rounded-2xl text-red-700">{error}</div>}

      {/* Form */}
      <div className="bg-white p-8 rounded-3xl shadow">
        <h3 className="text-xl font-semibold mb-6">{editingId ? "Edit Category" : "Create New Category"}</h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="name" placeholder="System Name (e.g. electricity)" value={formData.name} onChange={handleChange} required className="border p-4 rounded-2xl w-full" />
          <input type="text" name="display_name" placeholder="Display Name (e.g. बिजुली समस्या)" value={formData.display_name} onChange={handleChange} required className="border p-4 rounded-2xl w-full" />
          <textarea name="description" placeholder="Description for routing" value={formData.description} onChange={handleChange} className="md:col-span-2 border p-4 rounded-2xl h-32" />

          <div className="md:col-span-2 flex gap-4">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 disabled:opacity-70">
              {loading ? "Processing..." : editingId ? "Update Category" : "Create Category"}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-8 py-4 rounded-2xl">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-bold text-xl">{cat.display_name}</h3>
            <p className="text-sm text-gray-500">Code: {cat.name}</p>
            <p className="mt-3 text-gray-600 line-clamp-3">{cat.description}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => handleEdit(cat)} className="flex-1 bg-amber-500 text-white py-3 rounded-2xl hover:bg-amber-600">Edit</button>
              <button onClick={() => handleDelete(cat.id)} className="flex-1 bg-red-500 text-white py-3 rounded-2xl hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}