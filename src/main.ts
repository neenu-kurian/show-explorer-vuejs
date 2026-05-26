import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.config.errorHandler = (err, instance, info) => {
  console.error("Vue Error:", err);
  console.error("Component:", instance);
  console.error("Info:", info);
};
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});
window.addEventListener("error", (event) => {
  //  event.preventDefault();
  console.log("CUSTOM HANDLED:", event.error);
});
app.mount("#app");
