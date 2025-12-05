<template>
  <div class="form-overlay">
    <div class="form-container">
      <h3>Thêm Nhân Viên</h3>
      <label for="manv">Mã nhân viên</label>
      <input id="manv" v-model="staff.msnv" @blur="validateMaNV" />
      <p v-if="errorStaff" style="color: red;">{{ errorStaff }}</p>


      <label for="hoten">Họ tên nhân viên</label>
      <input v-model="staff.hotenNV" placeholder="" />

      <label for="mk">Mật khẩu</label>
      <input v-model="staff.password" />

      <label for="chucvu">Chức vụ</label>
      <select v-model="staff.chucvu">
        <option value="gt" disabled>Chức vụ</option>
        <option value="Quản lý">Quản lý</option>
        <option value="Nhân viên">Nhân viên</option>
      </select>

      <label for="diachi">Địa chỉ</label>
      <input id="diachi" v-model="staff.diachi" />

      <label for="sdt">Số điện thoại</label>
      <input id="sdt" v-model="staff.dienthoai" />

      <button @click="submitForm" class="submit">Lưu</button>
      <button @click="$emit('close')" class="cancel">Hủy</button>
    </div>
  </div>
</template>

<script>
import staffService from '@/services/staff.service';

export default {
  data() { //Giá trị ban đầu
    return {
      staff: {
        msnv: "",
        hotenNV: "",
        password: "",
        chucvu: "",
        diachi: "",
        dienthoai: ""
      },
      errorStaff: "",
    };
  },
  methods: { 
    async validateMaNV() {
      if (!this.staff.msnv) {
        this.errorStaff = "Bạn chưa nhập mã nhân viên";
        return
      }
      try {
        const response = await staffService.getStaffByID(this.staff.msnv);
        if (response.data) {
          this.errorStaff = "Nhân viên này đã tồn tại";
        }
        else {
          this.errorStaff = ""
        }
      } catch (error) {
        this.errorStaff = ""
      }
    },
    async submitForm() {
      this.validateMaNV();
      if (this.errorStaff) return; 
      this.$emit("add-staff", this.staff); 
    },

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

input, select {
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