<template>
  <div class="v-activity-birthday">
    <navbar title="喜事连连" defaultColor="#fff" endColor="#fff" color="#333"></navbar>
  </div>
</template>

<script>
/*
 * 喜事连连
 */
import navbar from "@/components/navbar/nav.vue";
import { getClickCount } from "@/configs/common.js";
export default {
  name: "birthday",
  components: { navbar },
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {}
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-activity-birthday {
  overflow: auto;
  padding-top: 60px;
  background-color: $lightColor;
}
</style>