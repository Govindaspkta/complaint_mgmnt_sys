
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintDetail, deleteComplaint, updateComplaint } from '../api/complaintApi';
import { getCategories } from './../api/categoryApi';
import LocationSelector from "../components/LocationSelector";
import { ArrowLeft, Edit, Trash2, Send } from 'lucide-react';

export default function ComplaintDetail() {
  const { reference_id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "", category: "", priority: "medium", description: "", image: null,
  });
  const [location, setLocation] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintRes, catRes] = await Promise.all([
          getComplaintDetail(reference_id),
          getCategories()
        ]);

        const data = complaintRes.data?.data || complaintRes.data;
        setComplaint(data);

        const results = catRes.data?.data?.results || catRes.data?.results || catRes.data || [];
        setCategories(results);
      } catch (err) {
        console.error(err);
        setError("Failed to load complaint details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reference_id]);

  const getCurrentStatus = () => (complaint?.status || complaint?.complaint_status || 'Pending').trim();

  const canEdit = getCurrentStatus().toUpperCase() === "REJECTED";

  const enterEditMode = () => {
    if (!complaint) return;
    setFormData({
      title: complaint.title || "",
      category: complaint.category?.reference_id || complaint.category || "",
      priority: (complaint.priority || "medium").toLowerCase(),
      description: complaint.description || "",
      image: null,
    });

    setLocation({
      province_id: complaint.province_id,
      district_id: complaint.district_id,
      municipality_id: complaint.municipality_id,
      ward: complaint.ward,
      province_name: complaint.province,
      district_name: complaint.district,
      municipality_name: complaint.municipality,
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleLocationChange = (loc) => {
    setLocation(loc);
    if (errors.location) setErrors(prev => ({ ...prev, location: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      alert("❌ Only JPG, JPEG and PNG images are allowed");
      return;
    }
    if (file.size > 1024 * 1024) {
      alert("❌ Image size cannot exceed 1 MB.");
      return;
    }
    setFormData(prev => ({ ...prev, image: file }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim() || formData.title.trim().length < 5) newErrors.title = "Title must be at least 5 characters";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.description?.trim() || formData.description.trim().length < 30) newErrors.description = "Description must be at least 30 characters";
    if (!location?.province_id || !location?.district_id || !location?.municipality_id || !location?.ward) newErrors.location = "Please select complete location";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("❌ Please fix all errors before updating.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("priority", formData.priority);
      data.append("description", formData.description);

      if (location) {
        data.append("province", location.province_name);
        data.append("district", location.district_name);
        data.append("municipality", location.municipality_name);
        data.append("ward", location.ward);
        data.append("province_id", location.province_id);
        data.append("district_id", location.district_id);
        data.append("municipality_id", location.municipality_id);
      }
      if (formData.image) data.append("image", formData.image);

      await updateComplaint(reference_id, data);
      alert("✅ Complaint updated successfully! Status is now PENDING.");

      const res = await getComplaintDetail(reference_id);
      setComplaint(res.data?.data || res.data);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.detail || "Failed to update complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await deleteComplaint(reference_id);
      alert("Complaint deleted successfully");
      navigate('/complaints');
    } catch (err) {
      alert("Failed to delete complaint");
    }
  };

  if (loading) return <div className="text-center py-20">Loading complaint details...</div>;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;
  if (!complaint) return <div className="text-center py-20">Complaint not found</div>;

  const status = getCurrentStatus();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button onClick={() => navigate('/complaints')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} /> Back to My Complaints
      </button>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">{complaint.title}</h1>
            <p className="text-gray-500 mt-1">Reference ID: {complaint.reference_id}</p>
          </div>
          <span className={`px-5 py-2 rounded-full text-sm font-medium ${getStatusBadge(status)}`}>
            {status}
          </span>
        </div>

        {!isEditing && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{complaint.municipality}, Ward {complaint.ward}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted On</p>
                <p className="font-medium">{new Date(complaint.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-10">
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
            </div>

            {complaint.image && (
              <div className="mb-10">
                <p className="text-sm text-gray-500 mb-3">Evidence Photo</p>
                <img src={complaint.image} alt="Evidence" className="rounded-2xl max-h-96 w-full object-contain border" />
              </div>
            )}

            {canEdit && (
              <div className="flex gap-4 pt-6 border-t">
                <button onClick={enterEditMode} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2">
                  <Edit size={20} /> Edit & Resubmit Complaint
                </button>
                <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2">
                  <Trash2 size={20} /> Delete Complaint
                </button>
              </div>
            )}
          </>
        )}

        {isEditing && (
          <form onSubmit={handleUpdate} className="space-y-6 mt-8">
            <h2 className="text-2xl font-bold mb-2">Update Rejected Complaint</h2>
            <p className="text-gray-600 mb-6">Make changes and resubmit. Status will return to PENDING.</p>

            <div>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} className={`w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`} placeholder="Complaint Title" />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <select name="category" value={formData.category} onChange={handleInputChange} className={`w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select Category</option>
                {categories.map((cat) => <option key={cat.reference_id} value={cat.reference_id}>{cat.display_name || cat.name}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <LocationSelector onLocationChange={handleLocationChange} />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} className={`w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Describe your issue in detail..." />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Evidence Photo (Optional)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-4 border rounded-2xl" />
              <p className="text-xs text-gray-500 mt-1">JPG / PNG only • Max 1 MB</p>
            </div>

            <div className="flex gap-4 pt-6">
              <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-2xl font-medium">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70">
                {isSubmitting ? "Updating..." : "Update & Resubmit Complaint"} <Send size={20} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const getStatusBadge = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('pending')) return 'bg-amber-100 text-amber-700';
  if (s.includes('approved')) return 'bg-green-100 text-green-700';
  if (s.includes('rejected')) return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};