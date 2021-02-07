<template>
  <div class="v-product-content-operation">
    <div class="img_area">
      <img class="left_img" src="~assets/images/product/kefu.png" alt />
      <img class="left_img" src="~assets/images/product/shoucang.png" alt />
      <img class="left_img" src="~assets/images/product/gouwuche.png" alt />
    </div>
    <div class="btn_box">
      <div class="left_btn">
        <slot name="leftBtn"></slot>
      </div>
      <div class="right_btn">
        <slot name="rightBtn"></slot>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 商品详细页面-底部的操作栏
 * 参数说明：1. 插槽 leftBtn-----左边按钮
 *          2. 插槽 rightBtn-----右边按钮
 */
export default {
  name: "footerbtn",
  data() {
    return {};
  },
  props: {},
  created() {},
  methods: {}
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-product-content-operation {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: #fff;
  align-items: center;

  .img_area {
    flex: 1;
    display: flex;
    justify-content: space-around;
    .left_img {
      width: 20px;
      height: 20px;
    }
  }
  .btn_box {
    display: flex;
    .left_btn,
    .right_btn {
      width: 121px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .left_btn {
      background: #ffa32c;
      color: #fff;
    }
    .right_btn {
      background: #ff3945;
      color: #fff;
    }
  }
}
</style>

