// src/api/categoryApi.js
import api from "./axios";

// GET ALL
export const getCategories = async () => {
  const response = await api.get("/complaints/categories/");
  return response;
};

// CREATE
export const createCategory = async (data) => {
  const response = await api.post("/complaints/categories/", data);
  return response;
};

// UPDATE → Changed to PUT (your backend only allows PUT)
export const updateCategory = async (reference_id, data) => {
  const response = await api.put(`/complaints/categories/${reference_id}`, data);   // ← PUT
  return response;
};

// DELETE
export const deleteCategory = async (reference_id) => {
  const response = await api.delete(`/complaints/categories/${reference_id}`);
  return response;
};

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};