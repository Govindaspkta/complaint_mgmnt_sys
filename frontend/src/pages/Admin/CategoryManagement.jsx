import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";

export default function CategoryManagement() {

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
  });

  // ================= FETCH =================
  const fetchCategories = async () => {

    try {

      const res = await getCategories();

      console.log("CATEGORY RESPONSE:", res.data);

      // SAFE ARRAY CHECK
      if (Array.isArray(res.data)) {

        setCategories(res.data);

      } else if (Array.isArray(res.data.data)) {

        setCategories(res.data.data);

      } else {

        setCategories([]);
      }

    } catch (err) {

      console.log("FETCH ERROR:", err);

      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= RESET =================
  const resetForm = () => {

    setEditingId(null);

    setFormData({
      name: "",
      display_name: "",
      description: "",
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      console.log("FORM:", formData);

      if (editingId) {

        await updateCategory(editingId, formData);

      } else {

        await createCategory(formData);
      }

      resetForm();

      fetchCategories();

    } catch (err) {

      console.log("SUBMIT ERROR:", err);

      alert("Failed");

    } finally {

      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (cat) => {

    setEditingId(cat.reference_id);

    setFormData({
      name: cat.name || "",
      display_name: cat.display_name || "",
      description: cat.description || "",
    });
  };

  // ================= DELETE =================
  const handleDelete = async (reference_id) => {

    try {

      await deleteCategory(reference_id);

      fetchCategories();

    } catch (err) {

      console.log(err);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Category Management
      </h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="System Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="display_name"
            placeholder="Display Name"
            value={formData.display_name}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl h-32"
          />

          <div className="flex gap-3">

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              {loading
                ? "Loading..."
                : editingId
                ? "Update Category"
                : "Create Category"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* CATEGORY LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {categories.length === 0 ? (

          <div>No Categories Found</div>

        ) : (

          categories.map((cat) => (

            <div
              key={cat.reference_id || cat.id}
              className="bg-white p-5 rounded-2xl shadow"
            >

              <h2 className="text-xl font-bold">
                {cat.display_name}
              </h2>

              <p className="text-gray-500">
                {cat.name}
              </p>

              <p className="mt-3">
                {cat.description}
              </p>

              <div className="flex gap-3 mt-5">

                <button
                  onClick={() => handleEdit(cat)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      cat.reference_id || cat.id
                    )
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}