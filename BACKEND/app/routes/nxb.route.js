const express = require("express");
const nxb = require("../controllers/nxb.controller");
const { requireStaff } = require("../middlewares/auth.middleware");

const router = express.Router();

router
  .route("/")
  .get(nxb.findAll)                 // ai đăng nhập cũng xem được
  .post(requireStaff, nxb.create)   // chỉ staff mới thêm được
  .delete(requireStaff, nxb.deleteAll);

router
  .route("/:maNXB")
  .get(nxb.findOne)                 // ai đăng nhập cũng xem được
  .put(requireStaff, nxb.update)    // chỉ staff mới sửa
  .delete(requireStaff, nxb.delete);// chỉ staff mới xóa

module.exports = router;