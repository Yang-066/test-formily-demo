import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./icons";
import ElementUI from "element-ui";
import { message } from "@/utils/resetMessage";
import "element-ui/lib/theme-chalk/index.css";
// import VueCompositionAPI from "@vue/composition-api";
// import WidgetsInstaller from "../src/views/widgets";

Vue.config.productionTip = false;
Vue.use(ElementUI);
// Vue.use(VueCompositionAPI);
// Vue.use(WidgetsInstaller);

Vue.prototype.$message = message;
new Vue({
  router,
  template: "<App/>",
  render: (h) => h(App),
}).$mount("#app");
