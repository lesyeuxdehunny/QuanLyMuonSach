<template>
  <div class="form-overlay"> 
    <div class="form-container">
      <h3>Cập Nhật Thông Tin</h3>
      <label for="tendangnhap">Tên Đăng Nhập</label>
      <input id="tendangnhap" v-model="editUser.madocgia"/>  

      <label for="matkhau">Mật Khẩu</label>
      <input id="hoten" v-model="editUser.pass"/>

      <label for="ho">Họ Lót</label>
      <input id="ho" v-model="editUser.holot"/>

      <label for="ten">Tên</label>
      <input id="ten" v-model="editUser.ten"/>

      <label for="ns">Ngày sinh</label>
      <input id="ns" type="date" v-model="editUser.ngaysinh"/>

      <label for="gt">Giới Tính</label>
      <select id="gt" v-model="editUser.phai">
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
      </select>

      <label for="mk">Địa chỉ</label>
      <input id="mk" v-model="editUser.diachi"/>

      <label for="sdt">Số Điện Thoại</label>
      <input id="sdt" v-model="editUser.dienthoai"/>

      <button @click="submitForm" class="submit">Lưu</button>
      <button @click="$emit('close')" class="cancel">Hủy</button>
    </div>
  </div>
</template>

<script>

export default {
    props: ["reader"],
    data() {
        return {
            editUser: {...this.reader},
            errorMessage: "", 
        };
  },
  methods: {
    submitForm() {
        this.$emit("editUser", this.editUser); 
        // this.editUser = { madocgia: "", pass: "", holot: "", ten: "", ngaysinh: "", phai: "", diachi: "", dienthoai: "" };
        this.errorMessage = "";
    },
  },
    watch: {
    reader(newUser) {
      this.editUser = { ...newUser }; 
    }
  },
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
  padding: 3px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 8px 15px;
  margin: 5px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.cancel {
  background-color: red;
  color: white;
}

.submit {
background-color: green;
  color: white;
}
</style>
