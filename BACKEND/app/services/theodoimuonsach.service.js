const { ObjectId } = require("mongodb");
const DocGiaService = require("./docgia.service");
const SachService = require("./sach.service");

class theoDoiMuonSachService {
  constructor(client) {
    this.managementBook = client.db().collection("bookManagement");
    this.sachService = new SachService(client);
    this.docgiaService = new DocGiaService(client);
  }

  async extractManagementBookData(payload) {
    //Kiểm tra xem masach và madocgia có tồn tại không
    const sach = await this.sachService.findById(payload.masach);

    if (!sach) {
      throw new Error("Không tìm thấy thông tin sách ");
    }
    const docgia = await this.docgiaService.findByIdUser(payload.madocgia);
    if (!docgia) {
      throw new Error("Không tìm thấy thông tin độc giả");
    }

    const managementBook = {
      maMuon: payload.maMuon,
      madocgia: payload.madocgia,
      masach: payload.masach,
      ngaymuon: payload.ngaymuon,
      ngaytra: payload.ngaytra,
      datra: false, //Trạng thái trả sách
    };

    Object.keys(managementBook).forEach(
      (key) => managementBook[key] === undefined && delete managementBook[key]
    );
    return managementBook;
  }

  async create(payload) {
    const managementBook = await this.extractManagementBookData(payload);
    const sach = await this.sachService.findById(payload.masach);
    
    if(sach.soquyen===0) throw new Error("Số lượng sách đã hết, không thể mượn!");
    
      const result = await this.managementBook.insertOne(managementBook);
    await this.sachService.update(payload.masach, {
      soquyen: sach.soquyen - 1,
      maNXB: sach.maNXB,
    });
    return result;
  }

  async find(filter) {
    const cursor = await this.managementBook.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    if (!name) {
      return await this.find({});
    }
    const keywords = name.split(" ").filter((word) => word.trim() !== "");
    const searchQuery = {
      maMuon: {
        $regex: new RegExp(keywords.join("|"), "i"),
      },
    };
    return await this.find(searchQuery);
  }
  async findByIdUser(id) {
    return await this.managementBook.find({ madocgia: id }).toArray();
  }

  async update(id, payload) {
    const filter = {
      maMuon: id,
    };

    const updateData = {
      $set: payload,
    };

    const res = await this.managementBook.updateMany(filter, updateData);
    return res;
  }

  async delete(id) {
    const result = await this.managementBook.findOneAndDelete({
      maMuon: id,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.managementBook.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = theoDoiMuonSachService;