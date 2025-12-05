<template>
  <div class="wrapper">
    <Navbar />
    <div class="main-content">
      <Header @search="searchReader"/>
      <div class="content">
        <div class="top-bar">
          <h2>Danh Sách Độc Giả</h2>
        </div>

        <div class="reader-list">
          <div class="reader-card" v-for="reader in readers" :key="reader.madocgia">
            <h3>{{ reader.holot }} {{ reader.ten }}</h3>
            <p><strong>Mã độc giả/Tên tài khoản:</strong> {{ reader.madocgia }}</p>
            <p><strong>Ngày sinh:</strong> {{ reader.ngaysinh }}</p>
            <p><strong>Phái:</strong> {{ reader.phai }}</p>
            <p><strong>Địa chỉ:</strong> {{ reader.diachi }}</p>
            <p><strong>Số điện thoại:</strong> {{ reader.dienthoai }}</p>
            <div class="actions">
              <button @click="deleteReader(reader.madocgia)" class="delete">XÓA</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/navbar.vue";
import Header from "@/components/header.vue";
import FormAddReader from "@/components/formAddStaff.vue";
import readerService from "@/services/reader.service";

export default {
  components: {
    Navbar,
    Header,
    FormAddReader
  },
  data() {
    return {
      readers: [],
      showForm: false
    };
  },
  methods: {
    async fetchReaders() { 
      try {
        const response = await readerService.getAllReader(); 
        this.readers = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách độc giả:", error);
      }
    },

    async deleteReader(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa độc giả này?")) return;
      try {
        await readerService.deleteDocGia(id);
        await this.fetchReaders(); // cập nhật lại
      } catch (error) {
        console.error("Lỗi khi xóa độc giả:", error);
      }
    },

    async searchReader(query) {
      try {
        const response = await readerService.getReaderByName(query);
        this.readers = response.data;
      } catch (error) {
        console.log(`Lỗi khi tìm kiếm ${error}`)
      }
    },
  },
  mounted() {
    this.fetchReaders();
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  background: #f8f9fa;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.content {
  background: #ffffff;
  padding: 20px;
  margin-top: 70px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.reader-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.reader-card {
  background: #EEEEEE;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.reader-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.reader-card h3 {
  text-align: center;
  text-transform: uppercase;
  color: #333;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid #000;
}

p {
  margin: 8px 0;
  font-size: 16px;
  color: #555;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.borrow {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.borrow:hover {
  background-color: #218838;
}

.edit {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.edit:hover {
  background-color: #0056b3;
}

.delete {
  background-color: #c10a1f;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.delete:hover {
  background-color: #8c2f39;
}

.add {
  background-color: #029eff;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
</style>