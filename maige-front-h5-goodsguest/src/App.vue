<template>
  <div id="app">
    <entry />
  </div>
</template>

<script>
import entry from "./views/entry.vue";
export default {
  name: "app",
  components: {
    entry
  },
  created(){
    if(this.$platformOpenInfo &&  this.$platformOpenInfo.title){
       //动态展示对于的图片和名称
      document.title = this.$platformOpenInfo.title
      var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.href = this.$platformOpenInfo.icon
    }
  }
};
</script>

<style>
  #app {
    height: 100%;
    width: 100%;
  }
</style>
