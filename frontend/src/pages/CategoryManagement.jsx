import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../api/categoryApi";

export default function CategoryManagement() {

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // FETCH
  const fetchCategories = async () => {
    try {
      const res = await getCategories();

      setCategories(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createCategory(formData);

      setFormData({
        name: "",
        display_name: "",
        description: "",
      });

      fetchCategories();

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);

      fetchCategories();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-3xl shadow mb-6">

          <h1 className="text-3xl font-bold">
            Category Management
          </h1>

          <p className="text-gray-500 mt-2">
            Create and manage complaint categories
          </p>

        </div>

        {/* CREATE FORM */}
        <div className="bg-white p-6 rounded-3xl shadow mb-6">

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
              required
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="text"
              name="display_name"
              placeholder="Display Name"
              value={formData.display_name}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-xl"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl h-32"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>

          </form>

        </div>

        {/* CATEGORY LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {categories.map((category) => (

            <div
              key={category.id}
              className="bg-white p-5 rounded-3xl shadow"
            >

              <h2 className="text-xl font-bold">
                {category.display_name}
              </h2>

              <p className="text-sm text-gray-500">
                {category.name}
              </p>

              <p className="mt-3 text-gray-700">
                {category.description}
              </p>

              <button
                onClick={() => handleDelete(category.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}