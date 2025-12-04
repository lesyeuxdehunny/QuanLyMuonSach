import createAPI from "./api.service";

export default {
  getAllNXB() {
    return createAPI.get("/publishers");
  },

  getNXBbyID(id) {
    return createAPI.get(`/publishers/${id}`);
  },

  getNXBByName(name) {
    return createAPI.get(`/publishers?ten=${encodeURIComponent(name)}`);
  },

  createNXB(Data) {
    return createAPI.post("/publishers", Data);
  },

  updateNXB(id, updateData) {
    return createAPI.put(`/publishers/${id}`, updateData);
  },

  deleteNXB(id) {
    return createAPI.delete(`/publishers/${id}`);
  },
};