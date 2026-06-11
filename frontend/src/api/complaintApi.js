// src/api/complaintApi.js
import api from "./axios";

// Existing...
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

// === ADMIN ONLY ===
export const getAllComplaints = async () => {
  const response = await api.get("/complaints/"); // or /admin/complaints/ if you have separate endpoint
  return response;
};

export const getComplaintDetail = async (reference_id) => {
  const response = await api.get(`/complaints/${reference_id}/`);
  return response;
};

export const updateComplaint = async (reference_id, data) => {
  const response = await api.patch(`/complaints/${reference_id}/`, data); // or PUT if needed
  return response;
};

export const deleteComplaint = async (reference_id) => {
  const response = await api.delete(`/complaints/${reference_id}/`);
  return response;
};

// Smart Routing Call (after approval)
export const forwardToGovt = async (reference_id, category) => {
  const response = await api.post(`/complaints/${reference_id}/forward/`, { category });
  return response;
};

export default {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintDetail,
  updateComplaint,
  deleteComplaint,
  forwardToGovt,
};