<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <button class="toggle-btn" @click="toggleSidebar"><strong>☰</strong></button>

    <ul v-if="role === 'reader' || role === null">
      <li>
        <router-link to="/">
          <i class="fas fa-home"></i>
          <span v-if="!isCollapsed">Trang Chủ</span>
        </router-link>
      </li>
      <li>
        <router-link to="/history">
          <i class="fas fa-history"></i>
          <span v-if="!isCollapsed">Lịch sử mượn</span>
        </router-link>
      </li>
      <li>
        <router-link to="/profile">
          <i class="fas fa-user"></i>
          <span v-if="!isCollapsed">Thông tin tài khoản</span>
        </router-link>
      </li>
    </ul>

    <ul v-else-if="role === 'staff'">
      <li>
        <router-link to="/admin/">
          <i class="fas fa-book"></i>
          <span v-if="!isCollapsed">Quản lý Sách</span>
        </router-link>
      </li>
      <li>
        <router-link to="/admin/readers">
          <i class="fas fa-book-reader"></i>
          <span v-if="!isCollapsed">Quản lý Độc Giả</span>
        </router-link>
      </li>
      <li>
        <router-link to="/admin/staffs">
          <i class="fas fa-user-tie"></i>
          <span v-if="!isCollapsed">Quản lý Nhân Viên</span>
        </router-link>
      </li>
      <li>
        <router-link to="/admin/publishers">
          <i class="fas fa-building"></i>
          <span v-if="!isCollapsed">Quản lý Nhà Xuất Bản</span>
        </router-link>
      </li>
      <li>
        <router-link to="/admin/bookManagement">
          <i class="fas fa-tasks-alt"></i>
          <span v-if="!isCollapsed">Quản lý mượn-trả sách</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      role: null,
      isCollapsed: false
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.role = user ? user.role : null;
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreen);
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    checkScreen() {
      this.isCollapsed = window.innerWidth < 768;
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: #ffeda8;
  color: white;
  min-height: 100vh;
  margin-top: 74px;
  padding: 20px 10px;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 60px;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #003631;
  font-size: 24px;
  margin-bottom: 10px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  font-size: 18px;

  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

li:last-child {
  border-bottom: none;
}

a {
  color: #003631;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

a:hover {
  background: rgba(255, 255, 255, 0.2);
  padding-left: 10px;
  border-radius: 5px;
  transition: 0.3s;
}

.sidebar.collapsed span {
  display: none;
}
</style>