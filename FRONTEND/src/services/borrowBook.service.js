import createAPI from "./api.service";

export default {
  getAllBorrowBook() {
    return createAPI.get("/bookManagement");
  },

  getBorrowBookByName(name) {
    return createAPI.get(`/bookManagement?ten=${encodeURIComponent(name)}`);
  },

  createBorrowBook(Data) {
    return createAPI.post("/bookManagement", Data);
  },

  updateBorrowBook(id, updateData) {
    return createAPI.put(`/bookManagement/${id}`, updateData);
  },

  deleteBorrowBook(id) {
    return createAPI.delete(`/bookManagement/${id}`);
  },

  getByIdUser(id) {
    return createAPI.get(`/bookManagement/${id}`);
  },
};