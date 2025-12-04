<template>
  <div class="wrapper">
    <Navbar />
    <div class="main-content">
      <Header />
      <div class="content">
        <div class="top-bar">
          <h2>THÔNG TIN CÁ NHÂN</h2>
        </div>
        <div class="reader-card" v-if="reader">
          <p><strong>Tên Đăng Nhập:</strong> {{ reader.madocgia }}</p>
          <p><strong>Mật Khẩu:</strong> {{ reader.pass }}</p>
          <p><strong>Họ Lót:</strong> {{ reader.holot }}</p>
          <p><strong>Tên:</strong> {{ reader.ten }}</p>
          <p><strong>Ngày Sinh:</strong> {{ reader.ngaysinh }}</p>
          <p><strong>Giới Tính:</strong> {{ reader.phai }}</p>
          <p><strong>Địa Chỉ:</strong> {{ reader.diachi }}</p>
          <p><strong>Số Điện Thoại:</strong> {{ reader.dienthoai }}</p>

          <div class="actions">
            <button @click="deleteReader(reader.madocgia)" class="delete">Xóa tài khoản</button>
            <button @click="openEditForm(reader)" class="edit">Chỉnh sửa</button>
            <button @click="openChangePass(reader)" class="changePass">Đổi Mật khẩu</button>
          </div>
        </div>
        <formEditReader v-if="showEditForm" :reader="selectedReader" @editUser="editReader"
          @close="showEditForm = false" />

        <formChangePassword v-if="showChangePassForm" :reader="selectedReader" @changePassword="editReader"
          @close="showChangePassForm = false" />

      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/navbar.vue";
import Header from "@/components/header.vue";
import readerService from "@/services/reader.service";
import borrowBookService from "@/services/borrowBook.service";
import formEditReader from "@/components/formEditReader.vue";
import formChangePassword from "@/components/formChangePassword.vue";

export default {
  components: {
    Navbar,
    Header,
    formEditReader,
    formChangePassword,
  },
  data() {
    return {
      reader: [],
      showForm: false,
      selectedReader: null,
      showEditForm: false,
      showChangePassForm: false
    };
  },
  methods: {
    async fetchReader() { 
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const madocgia = user ? user.id : null;

        const response = await readerService.getByIdUser(madocgia); 
        this.reader = response.data;

      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
      }
    },

   async deleteReader(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này ?")) return;
      try {
        // xóa tài khoản đọc giả thì thêm chữ deleted trước madocgia 
        // tránh trường hợp cũng mã thì hiện ra lịch sử của người trước

        const updateMadocgia = `deleted_${this.reader.madocgia}`
        await readerService.updateReader(id, {madocgia: updateMadocgia});

        const borrowData = await borrowBookService.getByIdUser(this.reader.madocgia);
        if (borrowData.data.length > 0) {
          // duyệt từng thẻ mượn và cập nhật mã độc giả
          await Promise.all(
            borrowData.data.map(async (borrow) => {
              await borrowBookService.updateBorrowBook(borrow.maMuon, { madocgia: updateMadocgia });
            })
          );
        }

        localStorage.removeItem("user"); // Xóa trạng thái đăng nhập
        this.$router.push("/") // chuyển về trang chủ

      } catch (error) {
        console.error("Lỗi khi tài khoản:", error);
      }
    },
    openEditForm(reader) {
      this.selectedReader = { ...reader};  
      this.showEditForm = true;
    },

    openChangePass(reader){
      this.selectedReader = {...reader};
      this.showChangePassForm  = true;
      console.log(reader)
    },

    async editReader(updateReader) {  
      try {
        console.log(updateReader.madocgia);
        await readerService.updateReader(updateReader.madocgia,updateReader);
        alert("Cập nhật thành công")
        await this.fetchReader();
        this.showEditForm = false;
        this.fetchReader()
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
      }
    },
  },
    

  mounted() {
    this.fetchReader();
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 70px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.top-bar h2 {
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 22px;
  margin-bottom: 20px;
}

.reader-card {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: transform 0.2s ease-in-out;
}

.reader-card p {
  font-size: 16px;
  color: #333;
  margin: 8px 0;
  padding: 5px;
  border-bottom: 1px solid #ddd;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: 0.3s;
}

.delete {
  background-color: #c10a1f;
  color: white;
}

.delete:hover {
  background-color: #8c2f39;
}

.edit {
  background-color: #3961d9;
  color: white;
}

.edit:hover {
  background-color: #2b4593;
}

.changePass {
  background-color: #8dd243;
  color: white;
}

.changePass:hover {
  background-color: #4e7a1f;
}

@media (max-width: 768px) {
  .reader-card {
    width: 100%;
    padding: 15px;
  }

  button {
    width: 48%;
  }
}
</style>

