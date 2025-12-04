import createAPI from "./api.service";

export default {
  getAllBook() {
    return createAPI.get("/books");
  },
  
  getBookByID(id) {
    return createAPI.get(`/books/${id}`);
  },

  getBookByName(name) {
    return createAPI.get(`/books?ten=${encodeURIComponent(name)}`);
  },

  createBook(bookData) {
    return createAPI.post("/books", bookData);
  },

  updateBook(id, updateData) {
    return createAPI.put(`/books/${id}`, updateData);
  },

  deleteBook(id) {
    return createAPI.delete(`/books/${id}`);
  },
};
