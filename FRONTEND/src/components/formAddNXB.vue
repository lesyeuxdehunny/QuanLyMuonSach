<template>
  <div class="form-overlay">
    <div class="form-container">
      <h2>Thêm NXB</h2>
      <form>
        <label>Mã Nhà Xuất Bản:</label>
        <input type="text" v-model="nxb.maNXB" @blur="validateMaNXB" required />
        <p v-if=" errorMessage" class="error-message" style="color: red;">{{ errorMessage }}</p>

        <label>Tên Nhà Xuất Bản:</label>
        <input type="text" v-model="nxb.tennxb" required />

        <label>Địa chỉ:</label>
        <input type="text" v-model="nxb.diachi" required />

        <div class="form-actions">
          <button type="submit" class="submit" @click="addNXB">Thêm</button>
          <button type="button" class="cancel" @click="$emit('close')">Đóng</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import nxbService from "@/services/publisher.service";

export default {
  data() {
    return {
      nxb: {
        maNXB: "",
        tennxb: "",
        diachi: ""
      },
      errorMessage: "",
      
    };
  },
  methods: {
    async validateMaNXB() {
      if (!this.nxb.maNXB) {
        this.errorMessage = "Bạn chưa nhập mã nhà xuất bản";
        return;
      }
      try {
        const response = await nxbService.getNXBbyID(this.nxb.maNXB);
        if (response.data) {
          this.errorMessage = "NXB đã tồn tại"
        }
        else {
          this.errorMessage = "";
        }
      }
      catch (error) {
        this.errorMessage = "";
      }
    },
    async addNXB() {
      await this.validateMaNXB();
      if (this.errorMessage) return;
      this.$emit("add-nxb", this.nxb);
    }
  }
};
</script>

<style scoped>
.form-overlay {
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
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.form-container h2 {
  text-align: center;
}

button {
  padding: 8px 15px;
  margin: 5px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

label {
  display: block;
  font-weight: bold;
  text-align: left;
  margin: 10px 0px 0px 0px;
}

input {
  width: 100%;
  margin: 2px 0 0 0;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
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
