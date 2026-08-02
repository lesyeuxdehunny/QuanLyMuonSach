const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const MongoDB = require("../utils/mongodb.util");
const DocGiaService = require("../services/docgia.service");
const NhanVienService = require("../services/nhanvien.service");
const ApiError = require("../api-error");
const { sendResetPasswordEmail } = require("../utils/mailer");

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

// Gửi email đặt lại mật khẩu
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError(400, "Vui lòng nhập email"));
  }

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const reader = await docGiaService.findByEmail(email);

    // Không tiết lộ email có tồn tại hay không -> luôn trả về message chung
    if (reader) {
      const resetToken = jwt.sign(
        { id: reader.madocgia, purpose: "reset-password" },
        config.jwt.secret,
        { expiresIn: config.jwt.resetExpiresIn }
      );

      const resetLink = `${config.client.url}/reset-password?token=${resetToken}`;
      await sendResetPasswordEmail(reader.email, resetLink);
    }

    return res.send({
      message: "Nếu email tồn tại trong hệ thống, liên kết đặt lại mật khẩu sẽ được gửi.",
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xử lý quên mật khẩu: ${error}`));
  }
};

// Đặt lại mật khẩu bằng token nhận qua email
exports.resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return next(new ApiError(400, "Thiếu token hoặc mật khẩu mới"));
  }

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      return next(new ApiError(400, "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"));
    }

    if (decoded.purpose !== "reset-password") {
      return next(new ApiError(400, "Token không hợp lệ"));
    }

    const docGiaService = new DocGiaService(MongoDB.client);
    const reader = await docGiaService.findByIdUser(decoded.id);

    if (!reader) {
      return next(new ApiError(404, "Không tìm thấy tài khoản"));
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);
    await docGiaService.update(decoded.id, { pass: newPassword });

    return res.send({ message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi đặt lại mật khẩu: ${error}`));
  }
};