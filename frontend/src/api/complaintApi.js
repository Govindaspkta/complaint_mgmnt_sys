import api from "./axios";

// ================= COMPLAINTS API =================

export const createComplaint = async (complaintData) => {
  const response = await api.post("/complaints/", complaintData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getAllComplaints = async () => {
  const response = await api.get("/complaints/");
  return response;
};

export const getComplaintDetail = async (reference_id) => {
  const response = await api.get(`/complaints/${reference_id}/`);
  return response;
};

export const updateComplaint = async (reference_id, data) => {
  const response = await api.patch(`/complaints/${reference_id}/`, data);
  return response;
};

export const deleteComplaint = async (reference_id) => {
  const response = await api.delete(`/complaints/${reference_id}/`);
  return response;
};

// Optional: Get My Complaints (for normal users)
export const getMyComplaints = async () => {
  const response = await api.get("/complaints/my-complaints/");   // adjust if your endpoint is different
  return response;
};

export default {
  createComplaint,
  getAllComplaints,
  getComplaintDetail,
  updateComplaint,
  deleteComplaint,
  getMyComplaints,
};