import home from "@/views/Home.vue";
import login from "@/views/Login.vue";
import history from "@/views/HistoryBorrow.vue";
import info from "@/views/Info.vue";
export default [
  {
    path: "/",
    name: "home",
    component: home,
  },
  {
    path: "/login",
    name: "login",
    component: login,
  },
  {
    path: "/history",
    name: "history",
    component: history,
  },
  {
    path: "/profile",
    name: "info",
    component: info,
  },
];
