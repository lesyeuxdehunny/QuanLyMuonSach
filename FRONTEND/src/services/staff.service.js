import createAPI from "./api.service";

export default {
  getAllStaff() {
    return createAPI.get("/staffs");
  },

  getStaffByID(id) {
    return createAPI.get(`/staffs/${id}`);
  },

  getStaffByName(name) {
    return createAPI.get(`/staffs?ten=${encodeURIComponent(name)}`);
  },

  createStaff(Data) {
    return createAPI.post("/staffs", Data);
  },

  updateStaff(id, updateData) {
    return createAPI.put(`/staffs/${id}`, updateData);
  },

  deleteStaff(id) {
    return createAPI.delete(`/staffs/${id}`);
  },
};
