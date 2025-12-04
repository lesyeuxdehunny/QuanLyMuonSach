const { ObjectId } = require("mongodb");

class DocGiaService {
  constructor(client) {
    this.Reader = client.db().collection("readers");
  }

  // dữ liệu đầu vào
  extractReaderData(payload) {
    const reader = {
      madocgia: payload.madocgia,
      holot: payload.holot,
      ten: payload.ten,
      ngaysinh: payload.ngaysinh,
      phai: payload.phai,
      diachi: payload.diachi,
      dienthoai: payload.dienthoai,
      email: payload.email,
      pass: payload.pass,
      tendangnhap: payload.tendangnhap,
    };

    Object.keys(reader).forEach(
      (key) => reader[key] === undefined && delete reader[key]
    );
    return reader;
  }

  // tạo sách
  async create(payload) {
    const Reader = this.extractReaderData(payload);
    // Kiểm tra đã tồn tại chưa
    const existReader = await this.Reader.findOne({
      madocgia: Reader.madocgia,
    });

    if (existReader) {
      throw new Error("ds bản đã tồn tại");
    }

    const result = await this.Reader.insertOne(Reader);
    return result;
  }

  // tìm kiếm
  async find(filter) {
    const cursor = await this.Reader.find(filter);
    return await cursor.toArray();
  }

  // tìm theo tên
  async findByName(name) {
    if (!name) {
      return await this.find({});
    }

    const keywords = name.split(" ").filter((word) => word.trim() !== "");

    const searchQuery = {
      ten: {
        $regex: new RegExp(keywords.join("|"), "i"),
      },
    };
    return await this.find(searchQuery);
  }

  // tìm theo ID
  async findByIdUser(id) {
    return await this.Reader.findOne({ madocgia: id });
  }

  // cập nhật
  async update(id, payload) {
    const filter = {
      madocgia: id,
    };
    const data = this.extractReaderData(payload);
    const res = await this.Reader.findOneAndUpdate(
      filter,
      { $set: data },
      { returnDocument: "after" }
    );
    return res;
  }

  // xóa một
  async delete(id) {
    const result = await this.Reader.findOneAndDelete({
      madocgia: id,
    });
    return result;
  }

  // xóa nhiều
  async deleteAll() {
    const result = await this.Reader.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = DocGiaService;