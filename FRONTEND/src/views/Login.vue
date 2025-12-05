<template>
  <div class="login-container">
    <div class="login-box">
      <div class="tabs">
        <!-- mặc định là login -->
        <span :class="{ active: isLogin }" @click="isLogin = true">Đăng nhập</span>
        <span :class="{ active: !isLogin }" @click="isLogin = false">Đăng ký</span>
      </div>

      <!-- Form Đăng Nhập -->
      <form v-if="isLogin" @submit.prevent="login">
        <label for="tendangnhap"><strong>Tên đăng nhập</strong></label>
        <input v-model="loginData.tendangnhap" placeholder="Nhập tên đăng nhập" required />
        <label for="matkhau"><strong>Mật khẩu</strong></label>
        <input v-model="loginData.password" type="password" placeholder="Nhập mật khẩu" required />
        <button type="submit">Đăng nhập</button>
      </form>

      <!-- Form Đăng Ký -->
      <form v-else @submit.prevent="register">
        <input v-model="registerData.madocgia" @blur="checkMadocgia" placeholder="Nhập tên đăng nhập" required />
        <p v-if="madocgiaError" style="color: #fff; font-size: 16px;">{{ madocgiaError }}</p>
        <input v-model="registerData.holot" placeholder="Nhập họ lót" required />
        <input v-model="registerData.ten" placeholder="Nhập tên" required />
        <input v-model="registerData.ngaysinh" type="text" placeholder="Nhập ngày sinh" onfocus="(this.type='date')"
          onblur="(this.type='text')" />
        <select v-model="registerData.phai">
          <option value="gt" disabled>Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <input v-model="registerData.diachi" placeholder="Nhập địa chỉ" />
        <input v-model="registerData.dienthoai" placeholder="Nhập số điện thoại" required />
        <input v-model="registerData.email" placeholder="Nhập email" required />
        <input v-model="registerData.pass" type="password" placeholder="Nhập mật khẩu" required />
        <input v-model="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" required />
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  </div>
</template>

<script>
import readerService from "@/services/reader.service";
import staffService from "@/services/staff.service";

export default {
  data() {
    return {
      isLogin: true, //Mặc định là tab login
      loginData: {
        tendangnhap: "",
        password: ""
      },
      registerData: {
        holot: "",
        ten: "",
        ngaysinh: "",
        phai: "gt",
        diachi: "",
        dienthoai: "",
        email: "",
        pass: "",
        madocgia: "",
      },
      confirmPassword: "",
      madocgiaError: ""
    };
  },
  methods: {
    async checkMadocgia() {
      if (!this.registerData.madocgia) {
        this.madocgiaError = ""
        return;
      }

      try {
        console.log(this.registerData.madocgia)
        const response = await readerService.getByIdUser(this.registerData.madocgia);
        if (response.data) {
          this.madocgiaError = "Tên tài khoản đã tồn tại"
        }
        else {
          this.madocgiaError = "";
        }
      }
      catch (error) {
        this.madocgiaError = "";
      }
    },

    async login() {
      try {
        //Lấy danh sách độc giả và nhân viên
        const readerRes = await readerService.getAllReader();
        const staffRes = await staffService.getAllStaff();

        //Kiểm tra vai trò nào đang đăng nhập
        const user = readerRes.data.find(reader => reader.madocgia === this.loginData.tendangnhap)

        const staff = staffRes.data.find(staff => staff.msnv === this.loginData.tendangnhap)

        if (user && user.pass === this.loginData.password) {
          this.$router.push("/");
          localStorage.setItem("user", JSON.stringify({ id: user.madocgia, role: "reader", username: user.ten }));
          this.$router.push("/");
        }
        else if (staff && staff.password === this.loginData.password) {
          localStorage.setItem("user", JSON.stringify({ id: staff.msnv, role: "staff", username: staff.hotenNV, chucvu:staff.chucvu }));
          this.$router.push("/admin/");
        }
        else {
          alert("Tên đăng nhập hoặc mật khẩu không chính xác");
        }
      }
      catch (error) {
        console.error("Lỗi khi đăng nhập", error);
      }
    },

    async register() {
      try {
        await this.checkMadocgia();
        if (this.madocgiaError) return

        if (this.registerData.pass !== this.confirmPassword) {
          alert("Mật khẩu không trùng khớp!");
          return;
        }

        await readerService.createReader(this.registerData);

        alert("Đăng ký thành công! Hãy đăng nhập.");
        this.isLogin = true; //Chuyển sang trang đăng nhập
      } catch (error) {
        console.error("Lỗi khi tạo tài khoản:", error);
        alert(`Có lỗi xảy ra, vui lòng thử lại. ${error}`);
      }
    },
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #003631;
  opacity: 90%;
}

.login-box {
  background: #222;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  width: 400px;
  color: white;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}

.tabs span {
  cursor: pointer;
  padding: 10px;
  font-size: 18px;
}

.tabs .active {
  border-bottom: 2px solid white;
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
  padding: 10px;
  margin: 5px 0;
  border-radius: 20px;
  border: none;
}

button {
  width: 100%;
  padding: 10px;
  background: #28a745;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #218838;
}
</style>