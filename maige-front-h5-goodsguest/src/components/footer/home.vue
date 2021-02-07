<template>
  <div style="height:50px;">
    <van-tabbar v-model="active" active-color="#FF3A43" inactive-color="#000" route>
      <van-tabbar-item
        :key="index"
        v-for="(item, index) in navArray"
        :icon="item.icon"
        :to="item.path"
      >{{item.name}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
/**
 * 员工福利-路由导航栏
 * 使用，引入，注册然后直接实例化 <homenav />
 */
export default {
  name: "homenav",
  data() {
    return {
      // 当前选择的导航
      active: 0,
      // 导航栏
      navArray: [
        {
          path: "/home",
          name: "首页",
          icon: "wap-home-o"
        },
        {
          path: "/category",
          name: "搜索",
          icon: "search"
        },
       /* {
          path: "/discovery",
          name: "发现",
          icon: "browsing-history-o"
        },*/
        {
          path: "/cart",
          name: "购物车",
          icon: "cart-o"
        },
        {
          path: "/personal",
          name: "我的",
          icon: "contact"
        }
      ]
    };
  },
  created() {}
};
</script>

