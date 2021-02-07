<template>
  <div :style="{width: width, height: height}" class="c_common_tab_outer_container">
    <div class="inner_container">
      <div class="content">
        <slot name="container"></slot>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 横向移动容器
 * 使用引入，然后实例化：<crossmove><crossmove/>
 * 参数说明：
 *        1. width和height为盒子的宽高
 *        插槽 -- <template slot="container"></template>
 */
export default {
  name: "crossmove",
  data() {
    return {};
  },
  props: {
    width: {
      default: '',
      type: String
    },
    height: {
      default: '',
      type: String
    }
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss">
// tab栏模块
.c_common_tab_outer_container {
  width: 100%;
  height: 60px;
  position: relative;
  overflow: hidden;
  .inner_container {
    position: absolute;
    left: 0;
    overflow-x: scroll;
    overflow-y: hidden;
  }
  .content {
    width: 100vw;
    height: 60px;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
  // 隐藏滚动条
  .inner_container::-webkit-scrollbar {
    display: none;
  }
}
</style>

