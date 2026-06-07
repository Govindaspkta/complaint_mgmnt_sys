import { useState, useEffect } from "react";
import LocationSelector from "../components/LocationSelector";
import { Send } from "lucide-react";
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
  const [errors, setErrors] = useState({});

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        const results = res.data?.data?.results || res.data?.results || res.data || [];
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
    if (errors.location) setErrors({ ...errors, location: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // ✅ REAL-TIME IMAGE VALIDATION
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newErrors = { ...errors };
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!validTypes.includes(file.type)) {
      newErrors.image = "Only JPG, JPEG and PNG images are allowed";
      alert("❌ Only JPG and PNG images are allowed");
    } else if (file.size > 1024 * 1024) { // 1 MB
      newErrors.image = "Image size cannot exceed 1 MB. Please compress the image.";
      alert("❌ Image size cannot exceed 1 MB. Please compress and try again.");
    } else {
      delete newErrors.image; // Clear error if valid
    }

    setErrors(newErrors);
    setFormData({ ...formData, image: file });
  };

  // Comprehensive Validation (on Submit)
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title.trim() || formData.title.trim().length < 5) {
      newErrors.title = "Complaint title must be at least 5 characters";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    if (!formData.description.trim() || formData.description.trim().length < 30) {
      newErrors.description = "Description must be at least 30 characters";
      isValid = false;
    }

    if (
      !location?.province_id ||
      !location?.district_id ||
      !location?.municipality_id ||
      !location?.ward
    ) {
      newErrors.location = "Please select complete location";
      isValid = false;
      alert("Please select complete location.");
    }

    // Image re-check on submit
    if (!formData.image) {
      newErrors.image = "Please upload evidence photo";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("❌ Please fix all errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("priority", formData.priority);
      data.append("description", formData.description);

      data.append("province", location.province_name);
      data.append("district", location.district_name);
      data.append("municipality", location.municipality_name);
      data.append("ward", location.ward);
      data.append("province_id", location.province_id);
      data.append("district_id", location.district_id);
      data.append("municipality_id", location.municipality_id);

      if (formData.image) data.append("image", formData.image);

      const res = await createComplaint(data);

      alert(`✅ Complaint submitted successfully! Tracking ID: ${res.data?.tracking_id || res.data?.id || "Generated"}`);

      // Reset
      setFormData({ title: "", category: "", priority: "medium", description: "", image: null });
      setLocation(null);
      setErrors({});
    } catch (err) {
      console.error("Submit Error:", err.response?.data || err);

      const backendError = err.response?.data;
      if (backendError?.error?.image) {
        alert(`Image Error: ${backendError.error.image[0]}`);
      } else {
        alert(backendError?.message || backendError?.detail || "Failed to submit complaint.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Lodge Your Complaint
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Your complaint will be reviewed by admin and forwarded to concerned authority (NEA for electricity, etc.)
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Complaint Title"
              className={`w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* CATEGORY */}
          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={cat.reference_id || `cat-${index}`} value={cat.reference_id}>
                  {cat.display_name || cat.name || "Unnamed Category"}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* PRIORITY */}
          <div>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* LOCATION */}
          <div>
            <LocationSelector onLocationChange={handleLocationChange} />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className={`w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe your issue in detail..."
              required
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* IMAGE UPLOAD - Real-time Validation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Evidence Photo <span className="text-red-500">*</span> (Max 1MB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full p-4 border rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-xl ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            <p className="text-xs text-gray-500 mt-1">JPG / PNG only • Maximum 1 MB</p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}