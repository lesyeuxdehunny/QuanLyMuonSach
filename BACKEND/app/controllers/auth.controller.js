const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const MongoDB = require("../utils/mongodb.util");
const DocGiaService = require("../services/docgia.service");
const NhanVienService = require("../services/nhanvien.service");
const ApiError = require("../api-error");

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ApiError(400, "Vui lòng nhập tên đăng nhập và mật khẩu"));
  }

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const nhanVienService = new NhanVienService(MongoDB.client);

    // Tìm trong độc giả trước
    const reader = await docGiaService.findByIdUser(username);
    if (reader) {
      const match = await bcrypt.compare(password, reader.pass || "");
      if (!match) {
        return next(new ApiError(401, "Tên đăng nhập hoặc mật khẩu không chính xác"));
      }
      const token = jwt.sign(
        { id: reader.madocgia, role: "reader", username: reader.ten },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      return res.send({
        token,
        user: { id: reader.madocgia, role: "reader", username: reader.ten },
      });
    }

    // Tìm trong nhân viên
    const staff = await nhanVienService.findById(username);
    if (staff) {
      const match = await bcrypt.compare(password, staff.password || "");
      if (!match) {
        return next(new ApiError(401, "Tên đăng nhập hoặc mật khẩu không chính xác"));
      }
      const token = jwt.sign(
        { id: staff.msnv, role: "staff", chucvu: staff.chucvu, username: staff.hotenNV },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      return res.send({
        token,
        user: { id: staff.msnv, role: "staff", chucvu: staff.chucvu, username: staff.hotenNV },
      });
    }

    return next(new ApiError(401, "Tên đăng nhập hoặc mật khẩu không chính xác"));
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi đăng nhập: ${error}`));
  }
};