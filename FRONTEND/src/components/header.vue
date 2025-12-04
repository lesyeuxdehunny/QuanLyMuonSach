<template>
  <header class="header">
    <div class="title">THƯ VIỆN TRẠM DỪNG CHÂN</div>

    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Nhập vào từ khóa tìm kiếm..." />
      <button class="btn seach-btn" @click="() => { 
        $emit('search', searchQuery, searchCategory);
        showFilter=false;
        }">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      <!-- Trong .search-bar -->
      <div class="filter-wrapper" v-if="isHomePage">
        <button class="btn filter-btn" @click="toggleFilter">
          <i class="fa fa-filter" style="margin-left: 8px; cursor: pointer;"></i>
        </button>

        <!-- Option của filter -->
        <div class="filter-panel" v-if="showFilter">
          <p>Lọc theo:</p>
          <select v-model="searchCategory">
            <option value="tensach">Tên sách</option>
            <option value="nguongoc_tacgia">Nguồn gốc/Tác giả</option>
            <option value="nhaxuatban">Nhà xuất bản</option>
          </select>
        </div>
      </div>

    </div>

    <div class="actions">
      <div v-if="isLoggedIn" class="full-info">
        <span class="username">Xin chào {{ username }}</span>
        <button class="btn logout" @click="logout">Đăng xuất</button>
      </div>
      <div v-if="isLoggedIn" class="icon-only" @click="logout" title="Đăng xuất">
        <i class="fa-solid fa-right-from-bracket fa-lg"></i>
      </div>
      <button v-else class="btn login" @click="gotoLogin">Đăng nhập</button>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false, //Mặc định chưa đăng nhập
      username: "",
      showFilter: false,
      searchCategory: "tensach",
    };
  },
  methods: {
    gotoLogin() {
      this.$router.push("/login");
    },
    logout() {
      localStorage.removeItem("user"); //Xóa trạng thái đăng nhập
      window.location.reload(); //Tải lại trang đó
    },
    checkLoginStatus() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.isLoggedIn = true;
        this.username = user.username; //Lấy tên người dùng từ localStorage
      }
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    }
  },
  computed: {
    isHomePage() {
      return this.$route.name === "home";
    },
  },
  mounted() {
    this.checkLoginStatus();
  }
};
</script>
<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #003631;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: nowrap;
  height: 75px;
}

.title {
  white-space: nowrap;
  margin-right: 10px;
}

.search-bar {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  max-width: 500px;
  min-width: 120px;
}

.search-bar input {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  outline: none;
  width: 100%;
  font-size: 16px;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-left: 6px;
  border-radius: 5px;
  cursor: pointer;
  flex-shrink: 0;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Hiển thị đầy đủ thông tin người dùng */
.full-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Icon logout thu gọn */
.icon-only {
  display: none;
  cursor: pointer;
  color: white;
}

.username {
  font-size: 16px;
}

.btn {
  background: #ccc;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
}

.logout {
  background: #8c2f39;
  color: white;
}

.login {
  background: #28a745;
  color: white;
}

.login:hover {
  background-color: #218838;
}

/* PHẦN DƯỚI HEADER */
.main-content {
  margin-top: 80px;
  padding: 20px;
}

/* RESPONSIVE: chỉ ẩn full-info và hiện icon logout */
@media (max-width: 768px) {
  .full-info {
    display: none;
  }

  .icon-only {
    display: inline-block;
  }
}
.filter-wrapper {
  position: relative;
  display: inline-block;
}

.filter-panel {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 1000;
  color: black;
  min-width: 270px;
  display: flex;
  align-items: center;
  gap: 10px;
}

</style>