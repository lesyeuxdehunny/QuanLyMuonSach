import { createWebHistory, createRouter } from "vue-router";
import clientRouter from "./client.Router";
import adminRouter from "./admin.Router";
const routes = [
  ...adminRouter,
  ...clientRouter,
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const publicPaths = ["/", "/login", "/reset-password"];

  if (!user && !publicPaths.includes(to.path)) {
    alert("Bạn cần đăng nhập để truy cập trang này!");
    next("/login");
  }
  else if (to.path.startsWith("/admin") && (!user || user.role !== "staff")) {
    alert("Bạn không có quyền truy cập vào khu vực quản trị!");
    next("/");
  }
  else {
    next();
  }
});

export default router;