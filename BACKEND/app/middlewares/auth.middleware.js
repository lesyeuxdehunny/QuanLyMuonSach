const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../api-error");

// Kiểm tra token hợp lệ
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return next(new ApiError(401, "Không tìm thấy token xác thực"));
  }

  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return next(new ApiError(401, "Token không hợp lệ hoặc đã hết hạn"));
    }
    req.user = decoded; // { id, role, ... }
    next();
  });
};

// Chỉ cho phép staff/admin
exports.requireStaff = (req, res, next) => {
  if (!req.user || req.user.role !== "staff") {
    return next(new ApiError(403, "Bạn không có quyền truy cập chức năng này"));
  }
  next();
};