// src/api/complaintApi.js
import api from "./axios";

// ================= USER / PUBLIC APIs =================
export const createComplaint = async (complaintData) => {
  const response = await api.post("/complaints/", complaintData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const getMyComplaints = async () => {
  const response = await api.get("/complaints/");
  return response;
};

export const getComplaintDetail = async (reference_id) => {
  const response = await api.get(`/complaints/${reference_id}/`);
  return response;
};

export const deleteComplaint = async (reference_id) => {
  const response = await api.delete(`/complaints/${reference_id}/`);
  return response;
};

export const updateComplaint = async (reference_id, complaintData) => {
  const response = await api.put(`/complaints/${reference_id}/`, complaintData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

// ================= ADMIN ONLY APIs =================
export const getAllComplaints = async () => {
  const response = await api.get("/complaints/");
  return response;
};

// ✅ Admin: Get ALL complaints (Pending + Rejected + Approved)
export const getAdminComplaints = async () => {
  const response = await api.get("/complaints/admin/");
  return response;
};

export const updateComplaintAdmin = async (reference_id, data) => {
  const response = await api.patch(`/complaints/admin/${reference_id}/`, data);
  return response;
};

// ================= PUBLIC UPVOTE API =================
export const toggleUpvote = async (reference_id) => {
  const response = await api.post(`/complaints/${reference_id}/upvote/`);
  return response;
};

export const forwardToGovt = async (reference_id, category) => {
  const response = await api.post(`/complaints/${reference_id}/forward/`, { category });
  return response;
};

export default {
  createComplaint,
  getMyComplaints,
  getComplaintDetail,
  deleteComplaint,
  updateComplaint,
  getAllComplaints,
  updateComplaintAdmin,
  forwardToGovt,
  toggleUpvote,
};