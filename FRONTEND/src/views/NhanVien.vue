<template>
  <div class="wrapper">
    <Navbar />
    <div class="main-content">
      <Header @search="searchStaff" />
      <div class="content">
        <div class="top-bar">
          <h2>Danh Sách Nhân Viên</h2>
        </div>
        <button v-if="isManager" @click="showForm = true" class="add">Thêm Nhân viên</button>

        <FormAddStaff v-if="showForm" @add-staff="create" @close="showForm = false" />

        <div class="staff-list">
          <div class="staff-card" v-for="staff in staffs" :key="staff.msnv">
            <h3>Tên nhân viên: {{ staff.hotenNV }}</h3>
            <p><strong>Mã số/Tên tài khoản: </strong>{{ staff.msnv }}</p>
            <p><strong>Chức vụ: </strong>{{ staff.chucvu }}</p>
            <p><strong>Địa chỉ: </strong>{{ staff.diachi }}</p>
            <p><strong>SĐT: </strong>{{ staff.dienthoai }}</p>
            <!-- <p><strong>Mật khẩu: </strong>{{ staff.password }}</p> -->
            <div class="actions" v-if="isManager">
              <button @click="deleteStaff(staff.msnv)" class="delete">XÓA</button>
              <button @click="openEditForm(staff)" class="edit">Chỉnh sửa</button>
            </div>
          </div>
          <FormEditStaff v-if="showEditForm" :staff="selectedStaff" @edit-staff="editStaff"
            @close="showEditForm = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/navbar.vue";
import Header from "@/components/header.vue";
import FormAddStaff from "@/components/formAddStaff.vue";
import FormEditStaff from "@/components/formEditStaff.vue";
import staffService from "@/services/staff.service";

export default {
  components: {
    Navbar,
    Header,
    FormAddStaff,
    FormEditStaff,
  },
  data() {
    return {
      staffs: [],
      showForm: false,
      selectedStaff: null,
      showEditForm: false,
      isManager: false,
    };
  },
  methods: {
    async fetchStaffs() {
      try {
        const response = await staffService.getAllStaff();
        this.staffs = response.data;
        const user = JSON.parse(localStorage.getItem("user"));
        const chucvu = user.chucvu.toLowerCase();
        this.isManager = chucvu === "quản lý"
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách nhân viên:", error);
      }
    },

    async create(staff) {
      try {
        await staffService.createStaff(staff);
        await this.fetchStaffs(); //Cập nhật danh sách sau khi thêm thành công
        this.showForm = false; //Ẩn form sau khi lưu
        alert("Thêm nhân viên thành công!");
        this.fetchStaffs();
      } catch (error) {
        console.error("Lỗi khi thêm nhân viên:", error);
      }
    },

    async deleteStaff(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;
      try {
        await staffService.deleteStaff(id);
        await this.fetchStaffs();
        alert("Xóa nhân viên thành công!");
        this.fetchStaffs();
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
      }
    },
    openEditForm(nhanvien) {
      this.selectedStaff = { ...nhanvien };
      this.showEditForm = true;
    },

    async editStaff(updatedStaff) {
      try {
        console.log(updatedStaff.msnv);
        await staffService.updateStaff(updatedStaff.msnv, updatedStaff);
        await this.fetchStaffs();
        this.showEditForm = false;
        alert("Cập nhật sách thành công!");
        this.fetchStaffs();
      } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);
      }
    },

    async searchStaff(query) {
      try {
        const response = await staffService.getStaffByName(query);
        this.staffs = response.data;
      } catch (error) {
        console.log(` lỗi khi tìm kiếm ${error}`)
      }
    },
  },

  mounted() {
    this.fetchStaffs();
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  background: #f8f9fa;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.content {
  background: #ffffff;
  padding: 20px;
  margin-top: 70px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.staff-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.staff-card {
  background: #EEEEEE;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.staff-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.staff-card h3 {
  text-align: center;
  text-transform: uppercase;
  color: #333;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid #000;
}

p {
  margin: 8px 0;
  font-size: 16px;
  color: #555;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.edit {
  background-color: #3961d9;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.edit:hover {
  background-color: #2b4593;
}

.delete {
  background-color: #c10a1f;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.delete:hover {
  background-color: #8c2f39;
}

.add {
  background-color: #029eff;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
