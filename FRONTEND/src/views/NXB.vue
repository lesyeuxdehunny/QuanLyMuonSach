<template>
  <div class="wrapper">
    <Navbar />
    <div class="main-content">
      <Header @search="searchNXB"/>
      <div class="content">
        <div class="top-bar">
          <h2>Danh Sách Nhà Xuất Bản</h2>
        </div>
        <button @click="showForm = true" class="add">Thêm Nhà Xuất Bản</button>
        <FormAddNXB v-if="showForm" @add-nxb="create" @close="showForm = false" />

        <div class="NXB-list">
          <div class="NXB-card" v-for="nxb in nxbs" :key="nxb.maNXB">
            <h3>Nhà xuất bản {{ nxb.tennxb }}</h3>
            <p><strong>Mã nhà xuất bản: </strong>{{ nxb.maNXB }}</p>
            <p><strong>Địa chỉ: </strong>{{ nxb.diachi }}</p>
            <div class="actions">
              <button @click="deleteNXB(nxb.maNXB)" class="delete">XÓA</button>
              <button @click="openEditForm(nxb)" class="edit">Chỉnh sửa</button>
            </div>
          </div>
          <FormEditNXB v-if="showEditForm" :nxb="selectedNXB" @edit-nxb="editNXB" @close="showEditForm = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/navbar.vue";
import Header from "@/components/header.vue";
import FormAddNXB from "@/components/formAddNXB.vue"
import FormEditNXB from "@/components/formEditPublisher.vue";
import nxbService from "@/services/publisher.service";

export default {
  components: {
    Navbar,
    Header,
    FormAddNXB,
    FormEditNXB,
  },
  data() {
    return {
      nxbs: [],
      showForm: false,
      showEditForm: false,
      selectedNXB: null,
    };
  },
  methods: {
    async fetchNXB() {
      try {
        const response = await nxbService.getAllNXB();
        this.nxbs = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách NXB:", error);
      }
    },

    async create(nxb) {
      try {
        await nxbService.createNXB(nxb);
        await this.fetchNXB(); //Cập nhật danh sách sau khi thêm thành công
        this.showForm = false; //Ẩn form sau khi lưu
        alert("Thêm nhà xuất bản thành công!");
        this.fetchNXB();
      } catch (error) {
        console.error("Lỗi khi thêm nhà xuất bản:", error);
      }
    },

    async deleteNXB(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này?")) return;
      try {
        await nxbService.deleteNXB(id);
        await this.fetchNXB();
        alert("Xóa nhà xuất bản thành công!");
        this.fetchNXB();
      } catch (error) {
        console.error("Lỗi khi xóa nhà xuất bản:", error);
      }
    },

    openEditForm(nxb) {
      this.selectedNXB = { ...nxb };
      this.showEditForm = true;
    },

    async editNXB(updateNXB) {
      try {
        console.log(updateNXB.maNXB);
        await nxbService.updateNXB(updateNXB.maNXB, updateNXB);
        await this.fetchNXB();
        this.showEditForm = false;
        alert("Cập nhật nhà xuất bản thành công!");
        this.fetchNXB();
      } catch (error) {
        console.error("Lỗi khi cập nhật nhà xuất bản:", error);
      }
    },

    async searchNXB(query){
      try {
        const response = await nxbService.getNXBByName(query);
        this.nxbs = response.data;
      } catch (error) {
        console.log(`Lỗi khi tìm kiếm ${error}`)
      }
    },
  },
  mounted() {
    this.fetchNXB();
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

.NXB-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.NXB-card {
  background: #EEEEEE;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.NXB-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.NXB-card h3 {
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

.borrow {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.borrow:hover {
  background-color: #218838;
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
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
</style>