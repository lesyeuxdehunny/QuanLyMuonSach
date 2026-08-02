const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class DocGiaService {
  constructor(client) {
    this.Reader = client.db().collection("readers");
  }

  //Dữ liệu đầu vào
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

  async create(payload) {
    const Reader = this.extractReaderData(payload);
    //Kiểm tra đã tồn tại chưa
    const existReader = await this.Reader.findOne({
      madocgia: Reader.madocgia,
    });

    if (existReader) {
      throw new Error("Độc giả đã tồn tại");
    }

    // Mã hoá mật khẩu trước khi lưu
    if (Reader.pass) {
      Reader.pass = await bcrypt.hash(Reader.pass, 10);
    }

    const result = await this.Reader.insertOne(Reader);
    return result;
  }

  //Tìm kiếm
  async find(filter) {
    const cursor = await this.Reader.find(filter);
    // Không trả về trường mật khẩu ra ngoài API
    const docs = await cursor.toArray();
    return docs.map(({ pass, ...rest }) => rest);
  }

  //Tìm theo tên
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

  //Tìm theo ID
  async findByIdUser(id) {
    return await this.Reader.findOne({ madocgia: id });
  }

  //Tìm theo email (phục vụ chức năng quên mật khẩu)
  async findByEmail(email) {
    return await this.Reader.findOne({ email });
  }

  //Cập nhật
  async update(id, payload) {
    const filter = {
      madocgia: id,
    };
    const data = this.extractReaderData(payload);

    if (data.pass) {
      data.pass = await bcrypt.hash(data.pass, 10);
    } else {
      delete data.pass; // không ghi đè bằng rỗng nếu không đổi mật khẩu
    }

    const res = await this.Reader.findOneAndUpdate(
      filter,
      { $set: data },
      { returnDocument: "after" }
    );
    if (res && res.pass) delete res.pass;
    return res;
  }

  //Xóa một
  async delete(id) {
    const result = await this.Reader.findOneAndDelete({
      madocgia: id,
    });
    return result;
  }

  //Xóa nhiều
  async deleteAll() {
    const result = await this.Reader.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = DocGiaService;