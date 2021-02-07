<template>
  <div id="app_wrapper">
    <router-view />
    <homenav v-if="isShowNav" />
  </div>
</template>

<script>
import homenav from "@/components/footer/home";
export default {
  data() {
    return {
      active: 0,
      // 是否展示下方导航栏
      isShowNav: false
    };
  },
  components: {
    homenav
  },
  created() {},
  // 监听路由变化时,判断是否隐藏导航栏
  watch: {
    $route(to, from) {
      if (to.meta && to.meta.needNav) {
        this.isShowNav = true;
      } else {
        this.isShowNav = false;
      }
    }
  }
};
</script>

<style>
  #app_wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>
