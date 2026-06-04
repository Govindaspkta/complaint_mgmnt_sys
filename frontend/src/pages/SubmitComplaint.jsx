import { useState, useEffect } from "react";
import LocationSelector from "../components/LocationSelector";
import { Upload, Send } from "lucide-react";
import { createComplaint } from "./../api/complaintApi";
import { getCategories } from "./../api/categoryApi";

export default function SubmitComplaint() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "medium",
    description: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //  FETCH CATEGORIES
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const results = res.data?.data?.results || res.data?.results || res.data || [];

      console.log("Fetched Categories:", results); // ← Check this in console

      setCategories(results);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  };

  fetchCategories();
}, []);

  const handleLocationChange = (loc) => {
    setLocation(loc);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  // ✅ SUBMIT (SAFE VERSION)
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Location Validation
  if (
    !location?.province_id ||
    !location?.district_id ||
    !location?.municipality_id ||
    !location?.ward
  ) {
    alert("Please select complete location.");
    return;
  }

  // Category Validation
  if (!formData.category) {
    alert("Please select a category.");
    return;
  }

  setIsSubmitting(true);

  try {
    const data = new FormData();

    // Complaint Fields
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("priority", formData.priority);
    data.append("description", formData.description);

    // Location Fields
    data.append("province", location.province_name);
    data.append("district", location.district_name);
    data.append("municipality", location.municipality_name);
    data.append("ward", location.ward);

    // Optional IDs (recommended if backend uses foreign keys)
    data.append("province_id", location.province_id);
    data.append("district_id", location.district_id);
    data.append("municipality_id", location.municipality_id);

    // Image
    if (formData.image) {
      data.append("image", formData.image);
    }

    const res = await createComplaint(data);

    console.log("Complaint Created:", res.data);

    alert("Complaint submitted successfully!");

    // Reset Form
    setFormData({
      title: "",
      category: "",
      priority: "medium",
      description: "",
      image: null,
    });

    setLocation(null);
  } catch (err) {
    console.error(
      "Submit Error:",
      err.response?.data || err.message
    );

    alert(
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Failed to submit complaint."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-6">
          Lodge Your Complaint
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Complaint Title"
            className="w-full p-4 border rounded-2xl"
            required
          />

{/* CATEGORY SELECT */}
<select
  name="category"
  value={formData.category}
  onChange={(e) => {
    console.log("Category selected:", e.target.value);
    setFormData({
      ...formData,
      category: e.target.value,
    });
  }}
  className="w-full p-4 border rounded-2xl"
  required
>
  <option value="">Select Category</option>

  {categories.map((cat, index) => (
    <option
      key={cat.reference_id || `cat-${index}`}   // ← Fixed: Safe fallback
      value={cat.reference_id}
    >
      {cat.display_name || cat.name || "Unnamed Category"}
    </option>
  ))}
</select>

          {/* PRIORITY */}
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full p-4 border rounded-2xl"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          {/* LOCATION */}
          <LocationSelector onLocationChange={handleLocationChange} />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            className="w-full p-4 border rounded-2xl"
            placeholder="Describe your issue..."
            required
          />

          {/* IMAGE */}
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl"
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}