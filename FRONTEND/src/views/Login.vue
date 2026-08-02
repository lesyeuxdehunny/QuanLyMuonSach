<template>
  <div class="login-container">
    <div class="login-box">
      <div class="tabs" v-if="authView === 'login' || authView === 'register'">
        <!-- mặc định là login -->
        <span :class="{ active: authView === 'login' }" @click="switchToLogin">Đăng nhập</span>
        <span :class="{ active: authView === 'register' }" @click="switchToRegister">Đăng ký</span>
      </div>

      <!-- Form Đăng Nhập -->
      <form v-if="authView === 'login'" @submit.prevent="login">
        <label for="tendangnhap"><strong>Tên đăng nhập</strong></label>
        <input v-model="loginData.tendangnhap" placeholder="Nhập tên đăng nhập" required />
        <label for="matkhau"><strong>Mật khẩu</strong></label>
        <input v-model="loginData.password" type="password" placeholder="Nhập mật khẩu" required />
        <button type="submit">Đăng nhập</button>
        <p class="forgot-link" @click="authView = 'forgot'">Quên mật khẩu?</p>
      </form>

      <!-- Form quên mật khẩu -->
      <form v-else-if="authView === 'forgot'" @submit.prevent="submitForgotPassword">
        <label>Nhập email đã đăng ký</label>
        <input v-model="forgotEmail" type="email" placeholder="Nhập email" required />
        <button type="submit">Gửi yêu cầu</button>
        <p class="forgot-link" @click="authView = 'login'">Quay lại đăng nhập</p>
      </form>

      <!-- Form đặt lại mật khẩu -->
      <form v-else-if="authView === 'reset'" @submit.prevent="submitResetPassword">
        <label>Mật khẩu mới</label>
        <input v-model="newPassword" type="password" placeholder="Nhập mật khẩu mới" required />
        <label>Nhập lại mật khẩu mới</label>
        <input v-model="confirmNewPassword" type="password" placeholder="Nhập lại mật khẩu mới" required />
        <button type="submit">Đặt lại mật khẩu</button>
      </form>

      <!-- Form Đăng Ký -->
      <form v-else-if="authView === 'register'" @submit.prevent="register">
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
import authService from "@/services/auth.service";

export default {
  data() {
    return {
      authView: "login", // 'login' | 'register' | 'forgot' | 'reset'
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
      madocgiaError: "",
      forgotEmail: "",
      newPassword: "",
      confirmNewPassword: "",
      resetToken: "",
    };
  },
  methods: {
    switchToLogin() {
      this.authView = "login";
    },

    switchToRegister() {
      this.authView = "register";
    },

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
        const response = await authService.login(
          this.loginData.tendangnhap,
          this.loginData.password
        );
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "staff") {
          this.$router.push("/admin/");
        } else {
          this.$router.push("/");
        }
      } catch (error) {
        const msg = error.response?.data?.message || "Đăng nhập thất bại";
        alert(msg);
      }
    },

    async submitForgotPassword() {
      try {
        const response = await authService.forgotPassword(this.forgotEmail);
        alert(response.data.message);
        this.authView = "login";
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi xảy ra");
      }
    },

    async submitResetPassword() {
      if (this.newPassword !== this.confirmNewPassword) {
        alert("Mật khẩu không trùng khớp!");
        return;
      }
      try {
        const response = await authService.resetPassword(this.resetToken, this.newPassword);
        alert(response.data.message);
        this.authView = "login";
        this.$router.push("/login");
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi xảy ra");
      }
    },

    async register() {
      try {
        await this.checkMadocgia();
        if (this.madocgiaError) return;

        if (this.registerData.pass !== this.confirmPassword) {
          alert("Mật khẩu không trùng khớp!");
          return;
        }

        await readerService.createReader(this.registerData);

        alert("Đăng ký thành công! Hãy đăng nhập.");
        this.authView = "login";
      } catch (error) {
        console.error("Lỗi khi tạo tài khoản:", error);

        if (error.response) {
          console.error("Server responded:", error.response.status, error.response.data);
          alert(`${error.response.data?.message || JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          console.error("No response received:", error.request);
          alert("Không nhận được phản hồi từ server.");
        } else {
          alert(`Lỗi: ${error.message}`);
        }
      }
    }

  },

  mounted() {
    const token = this.$route.query.token;
    if (token) {
      this.resetToken = token;
      this.authView = "reset";
    }
  },
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

.forgot-link {
  cursor: pointer;
  margin-top: 10px;
}
</style>