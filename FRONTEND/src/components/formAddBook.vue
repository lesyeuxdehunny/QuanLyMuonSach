<template>
  <div class="form-overlay">
    <div class="form-container">
      <h3>Thêm Sách</h3>

      <label for="masach">Mã sách</label>
      <input id="masach" v-model="book.masach" @blur="validateMasach" />
      <p v-if="errorBook" style="color: red;">{{ errorBook }}</p>

      <label for="tensach">Tên sách</label>
      <input id="tensach" v-model="book.tensach" />

      <label for="dongia">Đơn giá</label>
      <input id="dongia" v-model="book.dongia" @input="book.dongia = book.dongia.replace(/[^0-9]/g, '')"/>

      <label for="soquyen">Số quyển</label>
      <input id="soquyen" v-model.number="book.soquyen" />

      <label for="namxuatban">Năm xuất bản</label>
      <input id="namxuatban" v-model="book.namxuatban" type="date" />

      <label for="maNXB">Nhà Xuất Bản</label>
      <select v-model="book.maNXB" id="maNXB" @change="onNXBChange">
        <option disabled value="">-- Chọn nhà xuất bản --</option>
        <option v-for="nxb in publishers" :key="nxb.maNXB" :value="nxb.maNXB">
          {{ nxb.tennxb }}
        </option>
      </select>

      <p v-if="errorNXB" style="color: red;">{{ errorNXB }}</p>

      <label for="nguongoc">Nguồn gốc/Tác giả</label>
      <input id="nguongoc" v-model="book.nguongoc_tacgia" />

      <button @click="addBook" class="submit">Lưu</button>
      <button @click="$emit('close')" class="cancel">Hủy</button>
    </div>
  </div>
</template>

<script>
import bookService from "@/services/book.service";
import nxbService from "@/services/publisher.service";

export default {
  data() {
    return {
      book: {
        masach: "",
        tensach: "",
        dongia: "",
        soquyen: "",
        namxuatban: "",
        maNXB: "",
        nguongoc_tacgia: "",
      },
      publishers: [],
      errorNXB: "",
      errorBook: "",
    };
  },
  methods: {
    validateMaNXB() {
      if (!this.book.maNXB) {
        this.errorNXB = "Bạn chưa chọn nhà xuất bản";
        return false;
      }
      this.errorNXB = "";
      return true;
    },

    async validateMasach() {
      if (!this.book.masach) {
        this.errorBook = "Bạn chưa nhập mã sách";
        return;
      }
      try {
        const response = await bookService.getBookByID(this.book.masach);
        if (response.data) {
          this.errorBook = "Mã sách này đã tồn tại!";
        } else {
          this.errorBook = "";
        }
      } catch (error) {
        this.errorBook = ""; 
      }
    },

    async addBook() {
      const validNXB = this.validateMaNXB();
      if (!validNXB) return;

      await this.validateMasach();
      if (this.errorBook) return;

      this.$emit("add-book", this.book);

      //Reset form
      this.book = {
        masach: "",
        tensach: "",
        dongia: "",
        soquyen: "",
        namxuatban: "",
        maNXB: "",
        nguongoc_tacgia: "",
      };
      this.errorNXB = "";
      this.errorBook = "";
    },
  },
  async mounted() {
    try {
      const response = await nxbService.getAllNXB();
      this.publishers = response.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách NXB:", error);
    }
  },
};
</script>


<style scoped>
.form-overlay {
  padding-top: 70px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  background: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;

}

label {
  display: block;
  font-weight: bold;
  text-align: left;
  margin: 10px 0px 0px 0px;
}

input,
select {
  width: 100%;
  margin: 2px 0 0 0;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 8px 15px;
  margin: 15px 5px 0px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.cancel {
  background-color: #c10a1f;
  color: white;
}

.cancel:hover {
  background-color: #8c2f39;
}

.submit {
  background-color: #28a745;
  color: white;
}

.submit:hover {
  background-color: #218838;
}
</style>