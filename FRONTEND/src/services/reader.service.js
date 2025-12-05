import createAPI from "./api.service";

export default {
  getAllReader() {
    return createAPI.get("/readers");
  },

  getByIdUser(id) {
    return createAPI.get(`/readers/${id}`);
  },

  getReaderByName(name) {
    return createAPI.get(`/readers?ten=${encodeURIComponent(name)}`);
  },

  createReader(readerData) {
    return createAPI.post("/readers", readerData);
  },

  updateReader(id, updateData) {
    return createAPI.put(`/readers/${id}`, updateData);
  },

  deleteDocGia(id) {
    return createAPI.delete(`/readers/${id}`);
  },
};