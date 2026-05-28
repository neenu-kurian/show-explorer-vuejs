import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.config.errorHandler = (err, _instance, info) => {
 console.error('[Vue error]', info, err)
};
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});
window.addEventListener("error", (event) => {
  console.error("CUSTOM HANDLED:", event.error);
});
app.mount("#app");
