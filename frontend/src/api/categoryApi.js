import api from "./axios";

// GET ALL CATEGORIES
export const getCategories = () => {
  return api.get("/complaints/categories/");
};

// CREATE CATEGORY
export const createCategory = (data) => {
  return api.post("/complaints/categories/", data);
};

// UPDATE CATEGORY
export const updateCategory = (id, data) => {
  return api.patch(`/complaints/categories/${id}/`, data);
};

// DELETE CATEGORY
export const deleteCategory = (id) => {
  return api.delete(`/complaints/categories/${id}/`);
};