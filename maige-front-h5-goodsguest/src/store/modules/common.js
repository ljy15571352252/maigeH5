
import {
  getMutipleAddress,
  setMutipleAddress,
  getBuyNowData,
  setBuyNowData,
  setsaleData
} from "@/store/storage/index.js";
export default {
  namespaced: true, // 命名空间开启
  // state对象
  // 在组件中获取state中的值：this.$store.state.模块名.变量名
  state: {
    // 多地址分配时点击的当前商品信息
    currentGoods: null,
    // 多地址分配时已经选择的多地址商品信息（商品下面添加地址）
    assignAddress: getMutipleAddress() || [],
    // 立即购买的产品
    buyNowData: getBuyNowData(),
    // 当前选择单地址
    singleAddress: "",
    //当前选择的售后地址
    saleAdress:"",
  },
  // 同步更改state值的方法
  // 在组件中触发更改的方法：this.$store.commit('模块名/方法名', 值)
  mutations: {
    // 多地址分配时点击的添加商品
    setCurrentGoods(state, data) {
      state.currentGoods = data;
    },
    // 已经添加的多地址商品信息列表（商品下面插入多地址）
    setMutipleAddress(state, data) {
      state.assignAddress = setMutipleAddress(data);
    },
    // 设置立即购买的商品信息
    setBuyNow(state, data) {
      state.buyNowData = setBuyNowData(data);
    },
    // 设置当前单地址
    setSingle(state, data) {
      state.singleAddress = data;
    },
    setSaleadress(state, data){
      state.saleAdress = setsaleData(data) ;
    }
  },
  // 异步更改state值的方法
  // 在组件中触发方法：this.$store.dispatch('模块名/方法名', 值)
  actions: {
    // setData(context, payload) {
    //   // context对象为当前module的store实例,context.commit("同步的方法名")表示触发更改方法
    //   // payload表示要更改的值
    // }
  },
  // 计算属性(跟computed一样的使用方式)
  // 在组件中获取：this.$store.getters['模块名/方法名']
  getters: {
    // getData(state) {
    //   // state为state对象
    // }
  }
}