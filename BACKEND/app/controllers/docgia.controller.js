const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Thêm mới đọc giả
exports.create = async (req, res, next) => {
  
  if (!req.body?.ten) {
    return next(new ApiError(400, "Tên không được để trống"));
  }

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const doc = await docGiaService.create(req.body);
    return res.send(doc);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tạo đọc giả ${error}`));
  }
};

// Lấy danh sách đọc giả tìm theo tên
exports.findAll = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const { ten } = req.query;
    const docs = ten
      ? await docGiaService.findByName(ten)
      : await docGiaService.find({});

    return res.send(docs);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách đọc giả"));
  }
};

// Lấy thông tin một đoc giả theo ID
exports.find = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const doc = await docGiaService.findByIdUser(req.params.id);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy đọc giả"));
    }

    return res.send(doc);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy đọc giả với ID=${req.params.id} ${error}`)
    );
  }
};

// Cập nhật thông tin đọc giả
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  if (!Object.keys(payload).length) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }

  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const doc = await docGiaService.update(id, payload);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy đọc giả để cập nhật"));
    }

    return res.send(doc);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật đọc giả với ID=${id}`));
  }
};

// Xóa một đọc giả theo ID
exports.delete = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const doc = await docGiaService.delete(req.params.id);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy đọc giả để xóa"));
    }

    return res.send(doc);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa đọc giả với ID=${req.params.id}`)
    );
  }
};

// Xóa tất cả đoc giả
exports.deleteAll = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const deletedCount = await docGiaService.deleteAll();

    return res.send({
      message: `${deletedCount} đọc giả đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả đọc giả"));
  }
};