// // src/api/complaintApi.js
// import api from "./axios";

// // ================= USER / PUBLIC APIs =================
// export const createComplaint = async (complaintData) => {
//   const response = await api.post("/complaints/", complaintData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response;
// };

// export const getMyComplaints = async () => {
//   const response = await api.get("/complaints/");
//   return response;
// };

// export const getComplaintDetail = async (reference_id) => {
//   const response = await api.get(`/complaints/${reference_id}/`);
//   return response;
// };

// export const deleteComplaint = async (reference_id) => {
//   const response = await api.delete(`/complaints/${reference_id}/`);
//   return response;
// };

// // ================= ADMIN ONLY APIs =================
// export const getAllComplaints = async () => {
//   const response = await api.get("/complaints/");
//   return response;
// };

// // Admin Approval / Rejection (Your dedicated endpoint)
// export const updateComplaintAdmin = async (reference_id, data) => {
//   const response = await api.patch(`/complaints/admin/${reference_id}/`, data);
//   return response;
// };

// // Optional: Future forwarding endpoint
// export const forwardToGovt = async (reference_id, category) => {
//   const response = await api.post(`/complaints/${reference_id}/forward/`, { category });
//   return response;
// };

// export default {
//   createComplaint,
//   getMyComplaints,
//   getComplaintDetail,
//   deleteComplaint,
//   getAllComplaints,
//   updateComplaintAdmin,   
//   forwardToGovt,
// };





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

// ✅ NEW: User Update (PUT) - For rejected complaints resubmission
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

// Admin Approval / Rejection
export const updateComplaintAdmin = async (reference_id, data) => {
  const response = await api.patch(`/complaints/admin/${reference_id}/`, data);
  return response;
};

// Optional: Future forwarding endpoint
export const forwardToGovt = async (reference_id, category) => {
  const response = await api.post(`/complaints/${reference_id}/forward/`, { category });
  return response;
};

// Default export (keeping your existing structure)
export default {
  createComplaint,
  getMyComplaints,
  getComplaintDetail,
  deleteComplaint,
  updateComplaint,           // ← Added
  getAllComplaints,
  updateComplaintAdmin,   
  forwardToGovt,
};