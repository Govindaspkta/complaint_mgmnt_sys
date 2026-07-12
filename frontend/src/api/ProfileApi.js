// import api from "./axios";

// export const updateProfile = (formData) => {
//   return api.post("/authx/profile-completion/", formData);
// };



import api from "./axios";

// User Side
export const updateProfile = (formData) => {
  return api.post("/authx/profile-completion/", formData);
};

// Admin Side - Add this
export const getPendingProfiles = () => {
  return api.get("/authx/profile-verification/");
};

export const verifyProfile = (reference_id) => {
  return api.patch(`/authx/profile-verification/${reference_id}/`, {
    verification_status: "APPROVED"
  });
};

export const rejectProfile = (reference_id, reason) => {
  return api.patch(`/authx/profile-verification/${reference_id}/`, {
    verification_status: "REJECTED",
    rejection_reason: reason
  });
};