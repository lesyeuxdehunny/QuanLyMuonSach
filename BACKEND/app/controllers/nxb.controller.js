const NXBService = require("../services/nxb.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Thêm NXB
exports.create = async (req, res, next) => {
  if (!req.body?.tennxb) {
    return next(new ApiError(400, "Tên nxb không được để trống"));
  }

  try {
    const nxbService = new NXBService(MongoDB.client);
    const doc = await nxbService.create(req.body);
    return res.send(doc);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tạo sách ${error}`));
  }
};

//Lấy danh sách NXB
exports.findAll = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const { ten } = req.query;
    const docs = ten
      ? await nxbService.findByName(ten)
      : await nxbService.find({});

    return res.send(docs);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy danh sách các nxb ${error}`)
    );
  }
};

// tìm NXB theo maNXB 
exports.findOne = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const doc = await nxbService.findById(req.params.maNXB);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy nxb"));
    }

    return res.send(doc);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy nxb với ID=${req.params.id}`));
  }
};

// Cập nhật thông tin NXB
exports.update = async (req, res, next) => {
  const { maNXB } = req.params;
  const payload = req.body;

  if (!Object.keys(payload).length) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }

  try {
    const nxbService = new NXBService(MongoDB.client);
    const doc = await nxbService.update(maNXB, payload);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy NXB để cập nhật"));
    }

    return res.send(doc);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật NXB với ID=${id}`));
  }
};

// Xóa NXB
exports.delete = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const doc = await nxbService.delete(req.params.maNXB);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy nxb để xóa"));
    }

    return res.send(doc);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa nxb với ID=${req.params.id}`)
    );
  }
};

// Xóa tất cả NXB
exports.deleteAll = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const deletedCount = await nxbService.deleteAll();

    return res.send({
      message: `${deletedCount} NXB đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả nxb"));
  }
};