const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

//Thêm sách mới
exports.create = async (req, res, next) => {
  if (!req.body?.masach) {
    return next(new ApiError(400, "Mã sách không được để trống"));
  }

  try {
    const sachService = new SachService(MongoDB.client);
    const doc = await sachService.create(req.body);
    return res.send(doc);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tạo sách ${error}`));
  }
};

//Lấy danh sách sách
exports.findAll = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const { ten } = req.query;
    const docs = ten
      ? await sachService.findByName(ten)
      : await sachService.find({});

    return res.send(docs);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy danh sách các cuốn sách ${error}`));
  }
};

//Lấy thông tin sách theo ID
exports.findOne = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const doc = await sachService.findById(req.params.id);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }

    return res.send(doc);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy sách với ID=${req.params.id}`)
    );
  }
};

//Lấy sách theo tên
exports.findByName = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const {ten} = req.query;

    let docs;
    if (!ten) {
       docs = await sachService.find({}); // trả về tất cả khi k có tham số
    }
     docs = await sachService.findByName(ten);
    return res.send(docs);
  } catch (error) {
    return next(new ApiError(500,`lỗi khi tìm kiếm ${error}` ))
  }
};

//Cập nhật thông tin sách
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  if (!Object.keys(payload).length) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }

  try {
    const sachService = new SachService(MongoDB.client);
    const doc = await sachService.update(id, payload);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy sách để cập nhật"));
    }

    return res.send(doc);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật sách với ID=${id} err = ${error}`));
  }
};

//Xóa một quyển sách theo ID
exports.delete = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const doc = await sachService.delete(req.params.id);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy sách để xóa"));
    }

    return res.send(doc);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa sách với ID=${req.params.id}`)
    );
  }
};

//Xóa tất cả sách
exports.deleteAll = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const deletedCount = await sachService.deleteAll();

    return res.send({
      message: `${deletedCount} cuốn sách đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả sách"));
  }
};