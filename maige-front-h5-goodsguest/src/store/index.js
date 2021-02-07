import Vue from "vue";
import Vuex from "vuex";
// 业务模块的信息模块
import common from './modules/common'
// 用户的信息模块
import user from './modules/user'

Vue.use(Vuex)

/**
 * store无法持久保存数据
 * 如果需要保存本地数据，需要在storage文件夹里创建每条数据本地保存和读取的函数方法
 * 注意： 建议vuex只存取结果，其它逻辑处理放在各自组件里
 */

export default new Vuex.Store({
  modules: {
    common,
    user
  }
})