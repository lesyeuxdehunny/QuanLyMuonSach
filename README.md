# Hệ thống Quản lý Mượn sách - Website Thư viện "Trạm Dừng Chân"

Dự án môn học: **Bảo trì phần mềm (CT244)**  
Trường Công nghệ Thông tin và Truyền thông - Đại học Cần Thơ.

---

## 📝 Tổng quan đề tài
Trong kỷ nguyên số, việc quản lý thư viện theo phương pháp thủ công bằng sổ sách truyền thống bộc lộ nhiều bất cập lớn: khó kiểm soát tình trạng sách, lịch sử mượn trả dễ sai sót và tốn thời gian vận hành. 

**Website Quản lý Mượn sách** là một giải pháp toàn diện giúp tự động hóa và tối ưu hóa hoạt động của một thư viện hoặc tủ sách quy mô vừa và nhỏ. Hệ thống tối ưu hóa các quy trình nghiệp vụ chuyên biệt, phân quyền chặt chẽ giữa ban quản trị (Admin/Nhân viên) và độc giả (Người mượn sách), mang đến một quy trình mượn - trả khoa học, chính xác và nhanh chóng.

---

## 🛠 Công nghệ sử dụng

Hệ thống được phát triển dựa trên kiến trúc phân tầng hiện đại (Frontend - Backend - Database) với các công cụ chính:

*   **Frontend:**
    *   **Vue.js:** Progressive Framework xây dựng giao diện người dùng đơn trang (SPA) linh hoạt, tối ưu hiệu năng.
    *   **Bootstrap 5:** Framework CSS thiết kế giao diện Responsive (tương thích mọi thiết bị), trực quan, dễ sử dụng.
*   **Backend:**
    *   **Node.js & Express.js:** Môi trường thực thi và framework phía máy chủ mạnh mẽ, xử lý I/O không đồng bộ hướng sự kiện, tối ưu tốc độ phản hồi API.
*   **Database:**
    *   **MongoDB:** Cơ sở dữ liệu NoSQL hướng tài liệu (Document-oriented), lưu trữ dạng JSON/BSON linh hoạt, cho phép mở rộng và thay đổi cấu trúc dữ liệu dễ dàng.
*   **Công cụ phát triển:** Visual Studio Code, Git, MongoDB Compass.

---

## ✨ Các chức năng chính trong hệ thống

Hệ thống phân quyền rõ ràng thành 3 cấp độ tương tác:

### 1. Đối với khách chưa đăng nhập (Guest)
*   Xem toàn bộ kho sách của thư viện.
*   Xem chi tiết thông tin của từng quyển sách (Tên sách, tác giả, đơn giá, số quyển còn lại, nhà xuất bản, năm xuất bản...).
*   Tìm kiếm sách theo tiêu đề hoặc lọc/sắp xếp theo các tiêu chí khác nhau.

### 2. Đối với độc giả đã có tài khoản (User)
*   Thừa hưởng đầy đủ quyền xem và tìm kiếm sách của khách.
*   **Mượn sách trực tuyến:** Chọn quyển sách mong muốn, chọn ngày mượn cụ thể và gửi yêu cầu mượn (nếu sách trong kho còn số lượng).
*   **Lịch sử mượn sách:** Xem danh sách toàn bộ các thẻ mượn cá nhân kèm mã mượn, ngày mượn, ngày trả thực tế và trạng thái thẻ (*Đã trả* hoặc *Chưa trả*).
*   **Quản lý tài khoản cá nhân:** 
    *   Xem thông tin cá nhân chi tiết.
    *   Chỉnh sửa thông tin cá nhân (Họ tên, ngày sinh, giới tính, địa chỉ, số điện thoại...).
    *   Đổi mật khẩu tài khoản.
    *   Yêu cầu xóa tài khoản độc giả.

### 3. Đối với Quản trị viên / Nhân viên (Admin/Staff)
*   **Đăng nhập hệ thống:** Giao diện đăng nhập bảo mật riêng dành cho ban quản lý.
*   **Quản lý Sách:** Thêm sách mới (qua form nhập liệu), Chỉnh sửa thông tin sách hiện có (trừ mã sách), Xóa sách khỏi kho (có thông báo xác nhận), Tìm kiếm sách theo tên.
*   **Quản lý Độc giả:** Xem danh sách độc giả đã đăng ký trên hệ thống, tìm kiếm độc giả, xóa tài khoản độc giả vi phạm hoặc theo yêu cầu.
*   **Quản lý Nhân viên:** Thêm mới tài khoản nhân viên/quản lý, chỉnh sửa chức vụ, địa chỉ, mật khẩu của nhân viên, xóa tài khoản nhân viên.
*   **Quản lý Nhà xuất bản (NXB):** Thêm, sửa, xóa và tra cứu thông tin của các đối tác nhà xuất bản sách.
*   **Quản lý Mượn - Trả sách:** 
    *   Xem danh sách tất cả các thẻ mượn sách trong hệ thống.
    *   Tìm kiếm thẻ mượn nhanh theo mã mượn.
    *   Cập nhật trạng thái từ *Chưa trả* sang *Đã trả sách* khi độc giả đến hoàn trả sách trực tiếp.
    *   Xóa thẻ mượn sách lỗi hoặc hết hạn lưu trữ.

---

## 🗄 Cấu trúc Cơ sở dữ liệu (MongoDB Collections)

Cơ sở dữ liệu bao gồm 5 bảng (Collections) chính tương ứng với mô hình PDM:

1.  **NhaXuatBan (Nhà xuất bản):** `_id` (ObjectId), `MaNXB` (String - PK), `TenNXB` (String), `DiaChi` (String).
2.  **Sach (Sách):** `_id` (ObjectId), `MaSach` (String - PK), `TenSach` (String), `DonGia` (Number), `SoQuyen` (Number), `NamXuatBan` (String), `NguonGoc_TacGia` (String), `MaNXB` (String - FK).
3.  **DocGia (Độc giả):** `_id` (ObjectId), `MaDocGia` (String/Username - PK), `HoLot` (String), `Ten` (String), `NgaySinh` (String), `Phai` (String/Boolean), `DiaChi` (String), `SDT` (String).
4.  **NhanVien (Nhân viên):** `_id` (ObjectId), `MaNhanVien` (String/Username - PK), `HoTenNV` (String), `MatKhau` (String), `ChucVu` (String), `DiaChi` (String), `SDT` (String).
5.  **TheoDoiMuonSach (Theo dõi mượn trả):** `_id` (ObjectId), `MaDocGia` (String - FK), `MaSach` (String - FK), `NgayMuon` (String), `NgayTra` (String), `TrangThai` (String - Mặc định ngầm hiểu hoặc cập nhật qua giao diện).

---

## 🚀 Hướng dẫn cài đặt và chạy ứng dụng trên máy cục bộ (Local)

Để chạy được dự án sau khi clone từ GitHub về máy, hãy thực hiện theo các bước chi tiết dưới đây:

### 📋 Yêu cầu tiên quyết
Đảm bảo máy tính đã cài đặt sẵn:
*   [Node.js](https://nodejs.org/) (Khuyến nghị phiên bản LTS mới nhất - v18 hoặc v20+).
*   [MongoDB Community Server](https://www.mongodb.com/try/download/community) cài đặt cục bộ và đang khởi chạy, hoặc một tài khoản [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) trực tuyến.
*   Git để quản lý mã nguồn.

---

### 📥 Bước 1: Clone dự án về máy
Mở Terminal / Command Prompt trên máy tính của bạn, di chuyển đến thư mục muốn lưu trữ dự án và chạy lệnh:

```bash
git clone https://github.com/lesyeuxdehunny/QuanLyMuonSach.git
cd QuanLyMuonSach
```

Dự án thông thường sẽ được chia thành hai thư mục chính bên trong:
*   `backend` (hoặc `server`): Chứa mã nguồn API Node.js/Express.
*   `frontend` (hoặc `client`): Chứa mã nguồn giao diện Vue.js.

---

### ⚙️ Bước 2: Cấu hình và Cài đặt Backend (Server)

1.  Di chuyển vào thư mục backend:
    ```bash
    cd backend
    ```

2.  Cài đặt các gói thư viện phụ thuộc (dependencies):
    ```bash
    npm install
    ```

<!-- 3.  **Cấu hình kết nối API (Nếu có):**
    Kiểm tra file cấu hình API endpoint (thường là trong file `src/services/api.service.js` hoặc một file `.env` của frontend) đảm bảo đường dẫn trỏ đúng về backend:
    ```env
    VITE_APP_API_URL=http://localhost:2512/api
    ``` -->

4.  Khởi chạy Server backend:
    ```bash
    npm start
    ```
    *Màn hình thông báo `Server is running on port 2511` và `Connected to the database!`*

---

### 🖥️ Bước 3: Cài đặt và Khởi chạy Frontend (Client)

1.  Mở một cửa sổ Terminal mới (giữ nguyên cửa sổ Backend đang chạy), di chuyển từ thư mục gốc của dự án vào thư mục frontend:
    ```bash
    cd frontend
    ```

2.  Cài đặt các gói thư viện phụ thuộc cho giao diện:
    ```bash
    npm install
    ```

3.  Khởi chạy ứng dụng Frontend Vue.js:
    ```bash
    npm run dev
    ```

5.  **Truy cập ứng dụng:**
    Terminal sẽ cung cấp một đường dẫn cục bộ (`http://localhost:2512`). 
    * Mở trình duyệt web và truy cập vào đường dẫn đó để sử dụng website.

