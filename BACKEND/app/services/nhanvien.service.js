const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class nhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("staffs");
  }

  async createAdmin(){
    try {
      const admin = await this.NhanVien.findOne({msnv: "admin"});

      if (!admin) {
        // Mã hoá mật khẩu admin mặc định trước khi lưu
        const hashedPassword = await bcrypt.hash("admin", 10);

        const adminData = {
          msnv: "admin",
          hotenNV: "Administrator",
          password: hashedPassword,
          chucvu: "Quản lý",
          diachi: "",
          dienthoai: "",
        };

        await this.NhanVien.insertOne(adminData);
        console.log("Thêm admin thành công")
      }
    } catch (error) {
      console.error("Thêm admin thất bại. Vui lòng thử lại")
    }
  }

  extractNhanVienData(payload) {
    const nhanvien = {
      msnv: payload.msnv,
      hotenNV: payload.hotenNV,
      password: payload.password,
      chucvu: payload.chucvu,
      diachi: payload.diachi,
      dienthoai: payload.dienthoai,
    };

    Object.keys(nhanvien).forEach(
      (key) => nhanvien[key] === undefined && delete nhanvien[key]
    );
    return nhanvien;
  }

  //Tạo nhân viên mới
  async create(payload) {
    const NhanVien = this.extractNhanVienData(payload);
    //Kiểm tra đã tồn tại chưa
    const existNhanVien = await this.NhanVien.findOne({
      msnv: NhanVien.msnv,
    });

    if (existNhanVien) {
      throw new Error("Thông tin nhân viên đã tồn tại");
    }

    // Mã hoá mật khẩu trước khi lưu
    if (NhanVien.password) {
      NhanVien.password = await bcrypt.hash(NhanVien.password, 10);
    }

    const result = await this.NhanVien.insertOne(NhanVien);
    return result;
  }

  async find(filter) {
    const cursor = await this.NhanVien.find(filter);
    const docs = await cursor.toArray();
    // Không trả về trường mật khẩu ra ngoài API
    return docs.map(({ password, ...rest }) => rest);
  }

  async findByName(name) {
    if (!name) {
      return await this.find({});
    }

    const keywords = name.split(" ").filter((word) => word.trim() !== "");

    const searchQuery = {
      hotenNV: {
        $regex: new RegExp(keywords.join("|"), "i"),
      },
    };
    return await this.find(searchQuery);
  }

  async findById(id) {
    return await this.NhanVien.findOne({
      msnv: id,
    });
  }

  async update(id, payload) {
    const filter = {
      msnv: id,
    };
    const data = this.extractNhanVienData(payload);

    // Chỉ hash lại mật khẩu nếu có gửi mật khẩu mới, tránh ghi đè bằng rỗng
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }

    const res = await this.NhanVien.findOneAndUpdate(
      filter,
      { $set: data },
      { returnDocument: "after" }
    );

    if (res && res.password) delete res.password;
    return res;
  }

  async delete(id) {
    const result = await this.NhanVien.findOneAndDelete({
      msnv: id,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.NhanVien.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = nhanVienService;