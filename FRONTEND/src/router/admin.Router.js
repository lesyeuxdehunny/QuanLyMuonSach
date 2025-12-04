import sach from "@/views/Sach.vue";
import nxb from "@/views/NXB.vue";
import docgia from "@/views/Docgia.vue";
import nhanvien from "@/views/NhanVien.vue";
import theodoimuonsach from "@/views/TheoDoiMuonSach.vue";

export default [
  {
    path: "/admin/",
    name: "sach",
    component: sach,
  },
  {
    path: "/admin/readers",
    name: "docgia",
    component: docgia,
  },
  {
    path: "/admin/publishers",
    name: "nxb",
    component: nxb,
  },
  {
    path: "/admin/staffs",
    name: "nhanvien",
    component: nhanvien,
  },
  {
    path: "/admin/bookManagement",
    name: "theodoimuonsach",
    component: theodoimuonsach,
  },
];