
import { createApp } from "vue";
import App from "./App.vue";
// import Bootstrap và Font Awesome
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import router
import router from "./router";

createApp(App).use(router).mount("#app");