// 引入组件
import tocart from './content/tocart.vue';
// 定义 backtop 对象
const ToCart = {
  // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
  install: function (Vue) {
    Vue.component('ToCart', tocart)
  }
}
// 导出
export default ToCart;