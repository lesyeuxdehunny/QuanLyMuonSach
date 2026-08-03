<template>
  <div class="wrapper">
    <Navbar />
    <div class="main-content">
      <Header @search="searchBooks" />
      <div class="content">
        <div class="top-bar d-flex">
          <h2>Kho Sách</h2>
          <div style="position: relative;">
            <button class="ml-4 d-flex filter-btn" @click="filterMenu = !filterMenu">
              <h5>Sắp xếp theo</h5>
              <i class="fas fa-sort ml-2 mt-2"></i>
            </button>
            <div v-if="filterMenu" class="filter-menu">
              <ul>
                <li @click="sortBooks('name')" :class="{ active: atoz !== 'default' }">
                  <span v-if="atoz === 'asc'">Từ A đến Z</span>
                  <span v-else-if="atoz === 'desc'">Từ Z đến A</span>
                  <span v-else>Từ A đến Z</span>
                </li>
                <li @click="sortBooks('price')" :class="{ active: priceOrder !== 'default' }">
                  Giá
                  <span v-if="priceOrder === 'asc'">tăng dần</span>
                  <span v-else-if="priceOrder === 'desc'">giảm dần</span>
                  <span v-else>tăng dần</span>
                </li>
                <li @click="sortBooks('year')" :class="{ active: yearOrder !== 'default' }">
                  Năm xuất bản
                  <span v-if="yearOrder === 'desc'">mới nhất</span>
                  <span v-else-if="yearOrder === 'asc'">cũ nhất</span>
                  <span v-else>mới nhất</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Thêm sách -->
        <button @click="showForm = true" class="add">Thêm Sách</button>
        <!-- Hiển thị form khi showForm = true -->
        <FormAddBook v-if="showForm" @add-book="create" @close="showForm = false" />

        <div class="book-list">
          <div class="book-card" v-for="book in books" :key="book.masach">
            <h3>{{ book.tensach }}</h3>
            <!-- <img :src="getImageUrl(book.hinhAnh)" :alt="'Bìa sách ' + book.tensach"> -->
            <p><strong>Mã sách:</strong> {{ book.masach }}</p>
            <p><strong>Đơn giá:</strong> {{ book.dongia }} VND</p>
            <p><strong>Số quyển:</strong> {{ book.soquyen }}</p>
            <p><strong>Năm xuất bản:</strong> {{ book.namxuatban }}</p>
            <p><strong>Mã nhà xuất bản:</strong> {{ book.maNXB }}</p>
            <p><strong>Nguồn gốc/Tác giả:</strong> {{ book.nguongoc_tacgia }}</p>
            <div class="actions">
              <button @click="deleteBook(book._id)" class="delete">XÓA</button>
              <button @click="openEditForm(book)" class="edit">Chỉnh sửa</button>
            </div>
          </div>

          <FormEditBook v-if="showEditForm" :book="selectedBook" @edit-book="editBook" @close="showEditForm = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/navbar.vue";
import Header from "@/components/header.vue";
import FormAddBook from "@/components/formAddBook.vue";
import FormEditBook from "@/components/formEditBook.vue";
import bookService from "@/services/book.service";

export default {
  components: {
    Navbar,
    Header,
    FormAddBook,
    FormEditBook,
  },
  data() {
    return {
      books: [],
      cloneBooks: [],
      showForm: false,
      showEditForm: false,
      selectedBook: null,
      filterMenu: false,
      atoz: "default",
      priceOrder: "default",
      yearOrder: "default",
    };
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await bookService.getAllBook();
        this.books = response.data;
        this.cloneBooks = [...this.books];   // clone để có thể quay lại "default"
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
      }
    },

    async create(book) {
      try {
        //Chuyển đơn giá, số quyển thành Number
        book.dongia = parseInt(book.dongia);
        book.soquyen = parseInt(book.soquyen);
        //Kiểm tra sách đã tồn tại chưa
        await bookService.createBook(book);
        await this.fetchBooks(); //Cập nhật danh sách sau khi thêm thành công
        this.showForm = false; //Ẩn form sau khi lưu
        alert("Thêm sách thành công!");
        this.fetchBooks();
      } catch (error) {
        console.error("Lỗi khi thêm sách:", error);
      }
    },

    async deleteBook(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa sách này?")) return;
      try {
        await bookService.deleteBook(id);
        this.books = this.books.filter(book => book._id !== id);
        alert("Xóa sách thành công!");
        this.fetchBooks();
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
      }
    },

    async searchBooks(query) {
      try {
        const response = await bookService.getBookByName(query);
        this.books = response.data;
        this.cloneBooks = [...this.books]; // đồng bộ lại clone sau khi search
      } catch (error) {
        console.log(`lỗi khi tìm kiếm ${error}`);
      }
    },

    openEditForm(book) {
      this.selectedBook = { ...book };
      this.showEditForm = true;
    },

    async editBook(updatedBook) {
      try {
        await bookService.updateBook(updatedBook.masach, updatedBook);
        await this.fetchBooks();
        this.showEditForm = false;
        alert("Cập nhật sách thành công!");
        this.fetchBooks();
      } catch (error) {
        console.error("Lỗi khi cập nhật sách:", error);
      }
    },

    checkDefaultOther(activeCategory) {
      const sortMap = {
        name: ["priceOrder", "yearOrder"],
        price: ["atoz", "yearOrder"],
        year: ["atoz", "priceOrder"],
      };
      if (sortMap[activeCategory]) {
        sortMap[activeCategory].forEach((key) => {
          this[key] = "default";
        });
      }
    },

    sortBooks(category) {
      this.checkDefaultOther(category);

      if (category === "name") {
        if (this.atoz === "default") {
          this.atoz = "asc";
          this.books.sort((a, b) => a.tensach.localeCompare(b.tensach));
        } else if (this.atoz === "asc") {
          this.atoz = "desc";
          this.books.sort((a, b) => b.tensach.localeCompare(a.tensach));
        } else {
          this.atoz = "default";
          this.books = [...this.cloneBooks];
        }
      }

      if (category === "price") {
        if (this.priceOrder === "default") {
          this.priceOrder = "asc";
          this.books.sort((a, b) => a.dongia - b.dongia);
        } else if (this.priceOrder === "asc") {
          this.priceOrder = "desc";
          this.books.sort((a, b) => b.dongia - a.dongia);
        } else {
          this.priceOrder = "default";
          this.books = [...this.cloneBooks];
        }
      }

      if (category === "year") {
        if (this.yearOrder === "default") {
          this.yearOrder = "desc";
          this.books.sort((a, b) => b.namxuatban.localeCompare(a.namxuatban));
        } else if (this.yearOrder === "desc") {
          this.yearOrder = "asc";
          this.books.sort((a, b) => a.namxuatban.localeCompare(b.namxuatban));
        } else {
          this.yearOrder = "default";
          this.books = [...this.cloneBooks];
        }
      }
    },
  },
  mounted() {
    this.fetchBooks();
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

.book-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.book-card {
  background: #EEEEEE;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.book-card h3 {
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

.book-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-box {
  display: inline-block;
  background-color: #ff7e5f;
  color: white;
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 8px;
  min-width: 40px;
  text-align: center;
  font-size: 14px;
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

.filter-btn {
  background-color: #3961d9;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}
.filter-btn:hover {
  background-color: #2b4593;
}
.filter-menu ul li:hover {
  color: #007bff;
}
.active {
  color: #007bff;
  text-decoration: underline;
  font-weight: bold;
}
</style>