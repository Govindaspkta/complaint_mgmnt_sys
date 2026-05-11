import { useState } from 'react';
import LocationSelector from '../components/LocationSelector';
import { Upload, Send } from 'lucide-react';

export default function SubmitComplaint() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photo: null,
  });
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationChange = (loc) => {
    setLocation(loc);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert("Please select complete location (Province to Ward)");
      return;
    }

    setIsSubmitting(true);

    // For now, just showing data (we will connect to backend later)
    const complaintData = {
      ...formData,
      location,
    };

    console.log("Complaint Submitted:", complaintData);
    alert("✅ Complaint submitted successfully! (Demo Mode)");

    // Reset form
    setFormData({ title: '', description: '', photo: null });
    setLocation(null);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-dark">Lodge Your Complaint</h1>
        <p className="text-center text-gray-600 mb-10">Road Damage • Infrastructure • Public Issues</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Road damage in main street"
            />
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Location Details</label>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <LocationSelector onLocationChange={handleLocationChange} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Please describe the problem clearly..."
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary-400 transition">
              <Upload className="mx-auto text-4xl text-gray-400 mb-3" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo"
              />
              <label htmlFor="photo" className="cursor-pointer text-primary-600 font-medium">
                Click to upload photo of damage
              </label>
              {formData.photo && (
                <p className="text-sm text-green-600 mt-2">✅ {formData.photo.name}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
          >
            <Send size={24} />
            {isSubmitting ? "Submitting Complaint..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}