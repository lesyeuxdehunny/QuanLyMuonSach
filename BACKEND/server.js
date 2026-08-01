const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const NhanVienService = require("./app/services/nhanvien.service");

async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Connect to the database!");

    // Tạo tài khoản admin mặc định - chỉ chạy 1 lần khi khởi động server
    const nhanVienService = new NhanVienService(MongoDB.client);
    await nhanVienService.createAdmin();

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
}

startServer();