<template>
  <div class="wrapper">
    <Navbar />
    <div class="main-content">
      <Header @search="searchBorrowBook" />
      <div class="content">
        <div class="top-bar">
          <h2>Danh Sách Mượn Sách</h2>
        </div>
        <div class="borrowBook-list">
          <div class="borrowBook-card" v-for="borrowbook in borrowbooks" :key="borrowbook.maMuon">
            <h3>Thẻ mượn sách: {{ borrowbook.maMuon }}</h3>
            <p><strong>Mã độc giả: </strong> {{ borrowbook.madocgia }}</p>
            <p><strong>Mã sách: </strong> {{ borrowbook.masach }}</p>
            <p><strong>Ngày mượn: </strong> {{ borrowbook.ngaymuon }}</p>
            <p><strong>Ngày đăng ký trả: </strong> {{ borrowbook.ngaytra }}</p>
            <label>
              <input type="checkbox" v-model="borrowbook.datra" @change="changeStatus(borrowbook)" />
              Đã trả sách
            </label>
            <div class="actions">
              <button @click="deleteBorrowBook(borrowbook.maMuon, borrowbook.datra, borrowbook.masach)"
                class="delete">XÓA</button>
            </div>
          </div>
          <FormEditBorrow v-if="showEditForm" :borrowbook="selectedBorrowBook" @edit-borrowBook="editBorrowBook"
            @close="showEditForm = false" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from "@/components/navbar.vue";
import Header from "@/components/header.vue";
import FormAddBook from "@/components/formAddBook.vue";
import FormEditBorrow from "@/components/formEditBorrow.vue";
import borrowBookService from "@/services/borrowBook.service";
import bookService from "@/services/book.service";

export default {
  components: {
    Navbar,
    Header,
    FormAddBook,
    FormEditBorrow,
  },
  data() {
    return {
      borrowbooks: [],
      showForm: false,
      showEditForm: false,
      selectedBorrowBook: null,
    };
  },
  methods: {
    async fetchBorrowbooks() {
      try {
        const borrowBooks = await borrowBookService.getAllBorrowBook()
        const response = await borrowBookService.getAllBorrowBook();
        this.borrowbooks = response.data;
      } catch (error) {

        console.error(`lỗi khi mượn sách ${error}`);
      }
    },
    async deleteBorrowBook(id, datra, masach) {
      if (!confirm("Bạn có chắc chắn muốn xóa thẻ mượn sách này?")) return;
      try {
        console.log(datra)
        const dataBook = await bookService.getBookByID(masach);

        if (datra === false) {
          await bookService.updateBook(masach, {
            maNXB: dataBook.data.maNXB,
            soquyen: dataBook.data.soquyen + 1,

          })
        }

        await borrowBookService.deleteBorrowBook(id);
        this.fetchBorrowbooks();
        alert("Xóa thẻ mượn sách thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    },

    openEditForm(borrowbook) {
      this.selectedBorrowBook = { ...borrowbook }; //Lưu thẻ mượn sách đang chỉnh sửa
      this.showEditForm = true; //Hiển thị form chỉnh sửa
    },

    async changeStatus(borrowBook) {
      try {
        await borrowBookService.updateBorrowBook(borrowBook.maMuon, {
          datra: borrowBook.datra,
          ngaytra: borrowBook.datra ? new Date().toISOString().split("T")[0] : null,
        });

        const dataBook = await bookService.getBookByID(borrowBook.masach);
        let newSoQuyen = dataBook.data.soquyen;

        if (borrowBook.datra === true) {
          newSoQuyen += 1;
        }
        else {
          newSoQuyen -= 1;
        }

        if (newSoQuyen !== dataBook.data.soquyen) {
          await bookService.updateBook(borrowBook.masach, {
            maNXB: dataBook.data.maNXB,
            soquyen: newSoQuyen,
          });
        }

        alert("Cập nhật thành công!");
        this.fetchBorrowbooks();
      } catch (error) {
        console.log(`Lỗi khi cập nhật: ${error}`);
      }
    },

    async searchBorrowBook(query) {
      try {
        const response = await borrowBookService.getBorrowBookByName(query);
        this.borrowbooks = response.data;
      } catch (error) {
        console.log(`Lỗi khi tìm kiếm ${error}`)
      }
    },
  },

  mounted() {
    this.fetchBorrowbooks();
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

.borrowBook-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.borrowBook-card {
  background: #EEEEEE;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.borrowBook-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.borrowBook-card h3 {
  text-align: center;
  /* text-transform: uppercase; */
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
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.edit:hover {
  background-color: #0056b3;
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
  background-color: blue;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
</style>