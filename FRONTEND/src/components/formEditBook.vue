<template>
  <div class="form-overlay">
    <div class="form-container">
      <h3>Cập Nhật Sách</h3>
      <label for="masach">Mã sách</label>
      <input id="masach" v-model="editedBook.masach" disabled />

      <label for="tensach">Tên sách</label>
      <input id="tensach" v-model="editedBook.tensach" />

      <label for="dongia">Đơn giá</label>
      <input id="dongia" v-model="book.dongia" @input="book.dongia = book.dongia.replace(/[^0-9]/g, '')"/>

      <label for="soquyen">Số quyển</label>
      <input id="soquyen" v-model.number="book.soquyen" />

      <label for="namxuatban">Năm xuất bản</label>
      <input id="namxuatban" v-model="editedBook.namxuatban" type="date" />

      <label for="maNXB">Nhà xuất bản</label>
      <select v-model="editedBook.maNXB" id="maNXB">
        <option disabled value="">-- Chọn nhà xuất bản --</option>
        <option v-for="nxb in publishers" :key="nxb.maNXB" :value="nxb.maNXB">
          {{ nxb.tennxb }}
        </option>
      </select>

      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

      <label for="nguongoc">Nguồn gốc/Tác giả</label>
      <input id="nguongoc" v-model="editedBook.nguongoc_tacgia" />

      <button @click="submitForm" class="submit">Lưu</button>
      <button @click="$emit('close')" class="cancel">Hủy</button>
    </div>
  </div>
</template>

<script>
import nxbService from "@/services/publisher.service";

export default {
  props: ["book"],
  data() {
    return {
      editedBook: { ...this.book }, //Không làm ảnh hưởng đến dữ liệu cha đã được nhập trước đó
      publishers: [],
      errorMessage: "",
    };
  },

  methods: {
    async fetchNXB() {
      try {
        const response = await nxbService.getAllNXB();
        this.publishers = response.data;

      } catch (error) {
        console.error("Lỗi khi lấy danh sách NXB:", error);
      }
    },

    submitForm() {
      this.$emit("edit-book", this.editedBook);
      this.errorMessage = "";
    },
  },
  watch: {
    book(newBook) {
      this.editedBook = { ...newBook };
    }
  },
  mounted() {
    this.fetchNXB();
  }
};
</script>


<style scoped>
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  margin-top: 35px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  background: white;
  padding: 20px;
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