const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Thêm sach mới
exports.create = async (req, res, next) => {

  try {
    const theodoimuonsachService = new TheoDoiMuonSachService(MongoDB.client);
    const doc = await theodoimuonsachService.create(req.body);
    return res.send(doc);
  } catch (error) {
    if(error) {
      return next(new ApiError(400,error.message));
    }
    else return next(new ApiError(500, `Lỗi khi tạo thẻ mượn sách  ${error}`));
  }
};

// Lấy danh sách "sách"
exports.findAll = async (req, res, next) => {
  try {
    const theodoimuonsachService = new TheoDoiMuonSachService(MongoDB.client);
    const { ten } = req.query;
    const docs = ten
      ? await theodoimuonsachService.findByName(ten)
      : await theodoimuonsachService.find({});

    return res.send(docs);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Lỗi khi lấy danh sách các thẻ mượn sách ${error}`)
    );
  }
};

// Lấy thông tin sách theo ID
exports.find = async (req, res, next) => {
  try {
    const theodoimuonsachService = new TheoDoiMuonSachService(MongoDB.client);
    const doc = await theodoimuonsachService.findByIdUser(req.params.id);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy thẻ mượn sách"));
    }

    return res.send(doc);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi khi lấy thẻ mượn sách với ID=${req.params.id} err= ${error}`
      )
    );
  }
};

// Cập nhật thông tin mượn sách theo madocgia
exports.update = async (req, res, next) => {
  const { id } = req.params; // Lấy ID từ URL

  const payload = req.body;
  if (!Object.keys(payload).length) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }

  try {
    const theodoimuonsachService = new TheoDoiMuonSachService(MongoDB.client);
    const result = await theodoimuonsachService.update(id, payload);

    if (!result) {
      return next(
        new ApiError(404, `Không tìm thấy thẻ mượn sách với madocgia=${id}`)
      );
    }

    return res.send({ message: "Cập nhật thành công", result });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi khi cập nhật thẻ mượn sách với madocgia=${id}, lỗi: ${error}`
      )
    );
  }
};

// Xóa một cuốn sách theo ID
exports.delete = async (req, res, next) => {
  try {
    const theodoimuonsachService = new TheoDoiMuonSachService(MongoDB.client);
    const doc = await theodoimuonsachService.delete(req.params.id);

    if (!doc) {
      return next(new ApiError(404, "Không tìm thấy thẻ mượn sách để xóa"));
    }

    return res.send(doc);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa thẻ mượn sách ID=${req.params.id} Err: ${error}`)
    );
  }
};

// Xóa tất cả sách
exports.deleteAll = async (req, res, next) => {
  try {
    const theodoimuonsachService = new TheoDoiMuonSachService(MongoDB.client);
    const deletedCount = await theodoimuonsachService.deleteAll();

    return res.send({
      message: `${deletedCount} thẻ mượn sách đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả thẻ mượn sách"));
  }
};
