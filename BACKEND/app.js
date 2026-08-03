const express = require("express");
const cors = require("cors");

const authRouter = require("./app/routes/auth.route");
const docgia = require("./app/controllers/docgia.controller");
const docgiaRouter = require("./app/routes/docgia.route");
const nhanvienRouter = require("./app/routes/nhanvien.route");
const sachRouter = require("./app/routes/sach.route");
const nxbRouter = require("./app/routes/nxb.route");
const theodoimuonsachRouter = require("./app/routes/theodoimuonsach.route");

const { verifyToken, requireStaff } = require("./app/middlewares/auth.middleware");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

// Route công khai: đăng nhập, đăng ký độc giả
app.use("/auth", authRouter);
app.post("/readers", docgia.create);

// Độc giả tự quản lý thông tin cá nhân -> cần đăng nhập nhưng không cần quyền staff
app.use("/readers", verifyToken, docgiaRouter);

// Các route quản trị -> bắt buộc là staff
app.use("/staffs", verifyToken, requireStaff, nhanvienRouter);
app.use("/books", verifyToken, sachRouter); // đọc sách cho phép mọi user đã đăng nhập, ghi thì chặn thêm bên dưới nếu cần
app.use("/publishers", verifyToken, nxbRouter);
app.use("/bookManagement", verifyToken, theodoimuonsachRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to book borrowing management application." });
});

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;