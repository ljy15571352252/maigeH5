<template>
  <van-action-sheet v-model="showmodal" @closed="hide" :title="title">
    <div class="v-product-sharemodal">
      <div class="img_icons">
        <img src="~assets/images/product/weixin.png" />
        <img src="~assets/images/product/pengyouquan.png" />
        <img src="~assets/images/product/qq.png" />
        <img src="~assets/images/product/kongjian.png" />
        <img src="~assets/images/product/weibo.png" />
        <img src="~assets/images/product/fuzhilianjie.png" />
        <img src="~assets/images/product/fenxiangtupian.png" />
      </div>
      <div class="cancel_btn" @click="hide">取消</div>
    </div>
  </van-action-sheet>
</template>

<script>
/**
 * 选择地址弹窗
 * 使用方式：引入注册，实例化 <addrmodal />
 * 参数说明：1. title 标题
 *          2. showmodal 弹簧是否打开 true为打开
 *          3. showmask 是否显示遮罩层为黑色 false为不显示
 *          4. closeIcon 是否显示关闭按钮 false不显示
 *          5. hide自定义关闭事件
 */
export default {
  name: "addrmodal",
  data() {
    return {};
  },
  props: {
    // 弹窗标题
    title: {
      default: "分享到"
    },
    // 弹窗是否关闭 true表示打开
    showmodal: {
      default: false
    },
    // 遮罩层是否显示为黑色
    showmask: {
      default: false
    },
    // 是否显示关闭按钮
    closeIcon: {
      default: false
    }
  },
  methods: {
    // 自定义关闭事件
    hide() {
      this.$emit("hide", false);
    }
  }
};
</script>
<style lang="scss">
.v-product-sharemodal {
  max-height: 290px;
  width: 100%;
  background: #f3f4f9;
  .img_icons {
    width: 100%;
    background: #fff;
    padding-top: 10px;
    img {
      width: 45px;
      height: 45px;
      margin-bottom: 25px;
      margin-left: 40px;
    }
  }
  .cancel_btn {
    margin-top: 10px;
    padding: 15px;
    width: 100%;
    text-align: center;
    background: #fff;
    font-size: 15px;
    color: #333;
  }
}
</style>
