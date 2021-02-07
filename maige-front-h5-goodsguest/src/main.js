import Vue from 'vue'
import App from './App.vue'
// 引入vuex仓库注入到根实例
import store from '@/store/index'
// 路由
import router from "@/router/router.js"
// 引入时间格式化插件
import moment from "moment";
// 全局基础样式
import "@/assets/css/base.css"
// 请求文件
import http from '@/http/request.js'
// 引入执行rem计算
import 'amfe-flexible/index.js'
// 提前引入swiper样式
import 'swiper/css/swiper.css'
// 图片懒加载
import VueLazyload from 'vue-lazyload'
// 引入dialog(这个注册方法比较特殊, 单独注册一下)
import { Dialog } from "vant";
Vue.use(Dialog);

// 引入自定义的select单选择组件
import CommonSelect from "@/components/select/index.js";
Vue.use(CommonSelect);

// 引入自定义的switch组件（原vant的样式存在问题）
import CommonSwitch from '@/components/switch/index';
Vue.use(CommonSwitch);

// 引入自定义的回到顶部组件
import BackTop from "@/components/backtop/index";
Vue.use(BackTop);

// 引入自定义的回到购物车组件
import ToCart from "@/components/tocart/index";
Vue.use(ToCart);

// 按需引入vant组件(vant组件按需加载不需要再单独引入css)，使用新的vant组件必须在configs/components.js里添加
import components from '@/configs/components.js';
// 全局注册
Vue.use(components);

import { platformOpenInfo } from "@/configs/interface";

// 挂载请求
Vue.prototype.$http = http;
// 绑定moment
Vue.prototype.$moment = moment;

// 图片的懒加载
Vue.use(VueLazyload, {
  // error:require("@/assets/images/error.jpg"),
  // loading:require("@/assets/images/error.jpg"),
})
// 阻止显示生产活动的消息
Vue.config.productionTip = false;

/**
 * 并行加载初始化数据
 * 完成后加载 VUE 框架 (防止异常后未加载)
 */
const that = new Vue()

Promise.all(
  [
    async () => {
      that.$http({
        method: "get",
        url: platformOpenInfo,
        data: {}
      }).then(res => {
        Vue.prototype.$platformOpenInfo = res.data;
      });
      
    }
  ].map(method => method())
).finally(() => {
  setTimeout(function(){ //延迟加载，保证数据加载完成
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')  
  },50)
  
});