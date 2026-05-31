import { useState } from "react";
import LocationSelector from "../components/LocationSelector";
import { Upload, Send } from "lucide-react";

export default function SubmitComplaint() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "medium",
    description: "",
    image: null,
  });

  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please select complete location.");
      return;
    }

    setIsSubmitting(true);

    const complaintData = {
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      description: formData.description,

      province: location.province,
      district: location.district,
      municipality: location.municipality,
      ward: location.ward,

      image: formData.image,
    };

    console.log("Complaint Submitted:", complaintData);

    alert("Complaint submitted successfully! (Demo Mode)");

    setFormData({
      title: "",
      category: "",
      priority: "medium",
      description: "",
      image: null,
    });

    setLocation(null);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-dark">
          Lodge Your Complaint
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Report Public Issues Transparently
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Complaint Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g. Road damage near bus park"
              className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Category</option>

              {/* Replace with API data later */}
              <option value="1">Road Damage</option>
              <option value="2">Water Supply</option>
              <option value="3">Electricity</option>
              <option value="4">Garbage Management</option>
              <option value="5">Street Lighting</option>
              <option value="6">Public Safety</option>
              <option value="7">Others</option>

            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Location Details
            </label>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <LocationSelector
                onLocationChange={handleLocationChange}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              placeholder="Describe the issue clearly..."
              className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidence Image (Optional)
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary-400 transition">
              <Upload className="mx-auto text-gray-400 mb-3" />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image"
              />

              <label
                htmlFor="image"
                className="cursor-pointer text-primary-600 font-medium"
              >
                Click to upload image
              </label>

              {formData.image && (
                <p className="text-sm text-green-600 mt-3">
                  ✅ {formData.image.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
          >
            <Send size={22} />

            {isSubmitting
              ? "Submitting Complaint..."
              : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}