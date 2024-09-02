import { createApp } from "vue";
import App from "./App.vue";
import AdminPage from "./AdminPage.vue";
import "./index.css";

const isAdmin = process.env.VUE_APP_ADMIN === 'true';

const RootComponent = isAdmin ? AdminPage : App;

createApp(RootComponent).mount("#app");
