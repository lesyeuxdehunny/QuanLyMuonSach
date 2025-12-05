const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

//Tạo nhân viên mới
exports.create = async (req, res, next) => {
  if (!req.body?.hotenNV) {
    return next(new ApiError(400, "Tên nhân viên không được để trống"));
  }

  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const doc = await nhanVienService.create(req.body);
    res.send(doc);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tạo nhân viên ${error}`));
  }
};

//Lấy danh sách nhân viên
exports.findAll = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const { ten } = req.query;
    const docs = ten
      ? await nhanVienService.findByName(ten)
      : await nhanVienService.find({});
    res.send(docs);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách nhân viên"));
  }
};

//Tìm nhân viên theo ID
exports.findOne = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const doc = await nhanVienService.findById(req.params.id);
    if (!doc) return next(new ApiError(404, "Nhân viên không tồn tại"));
    res.send(doc);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi tìm nhân viên với ID=${req.params.id}`)
    );
  }
};

//Cập nhật nhân viên
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }

  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const doc = await nhanVienService.update(req.params.id, req.body);
    if (!doc) return next(new ApiError(404, "Nhân viên không tồn tại"));
    res.send(doc);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật nhân viên ID=${req.params.id}`)
    );
  }
};

//Xóa nhân viên theo ID
exports.delete = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const doc = await nhanVienService.delete(req.params.id);
    if (!doc) return next(new ApiError(404, "Nhân viên không tồn tại"));
    res.send(doc);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa nhân viên ID=${req.params.id}`));
  }
};

//Xóa tất cả nhân viên
exports.deleteAll = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const deletedCount = await nhanVienService.deleteAll();
    res.send({ message: `${deletedCount} nhân viên đã được xóa thành công` });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả nhân viên"));
  }
};