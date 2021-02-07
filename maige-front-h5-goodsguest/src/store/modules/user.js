export default {
  namespaced: true, // 命名空间开启
  // state对象
  // 在组件中获取state中的值：this.$store.state.模块名.变量名
  state: {
    // 设置全局可访问的变量
  },
  // 同步更改state值的方法
  // 在组件中触发更改的方法：this.$store.commit('模块名/方法名', 值)
  mutations: {
    // setData(state, payload) {
    //   // state为state对象
    //   // payload表示要更改的值
    // }
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
  // 在组件中获取：this.$store.getters['模块名/计算属性名']
  getters: {
    // getData(state) {
    //   // state为state对象
    // }
  }
}