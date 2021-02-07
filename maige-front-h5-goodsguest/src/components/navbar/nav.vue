<template>
  <div :style="{background: defaultColor}" class="c-navbar">
    <div ref="bgc" class="bgc_opacity" :style="{background: endColor}"></div>
    <div class="navbar_content">
      <div :style="{color: color}" class="navbar_left">
        <slot name="left"></slot>
        <van-icon v-if="showLeft" @click="() => this.$router.go(-1)" name="arrow-left" />
      </div>
      <div :style="{color: color}" class="nav_center">
        <slot name="center"></slot>
        {{title}}
      </div>
      <div :style="{color: color}" class="nav_right">
        <slot name="right"></slot>
        {{rightText}}
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 各类子页面头部的标题栏组件, 自动随滚动改变透明度
 * 使用方式，引入注册，实例化 <navbar />
 * 参数：1.title 正中间的标题
 *      2. rightText 右边的文字
 *      3. leftText 左边的文字
 *      4. rightText 右边的文字
 *      5. showLeft 布尔类型，是否显示左边的返回箭头
 *      6. defaultColor 表示标题栏的滚动前的背景色, 默认无
 *      7. color 表示栏上的文字颜色
 *      8. endColor 表示标题栏滚动后的背景色, 默认linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)
 *      9. scrollmyself 表示计算滚动的节点，默认所在实例的根节点
 *
 * 插槽：right，center，left
 */
export default {
  name: "navbar",
  data() {
    return {
      // 目标节点
      target: ""
    };
  },
  props: {
    showLeft: {
      default: true
    },
    title: {
      default: "",
      type: String
    },
    rightText: {
      default: "",
      type: String
    },
    leftText: {
      default: "",
      type: String
    },
    defaultColor: {
      default: "",
      type: String
    },
    endColor: {
      default:
        "linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)",
      type: String
    },
    color: {
      default: "#333",
      type: String
    },
    // 选择滚动对象，默认true为当前的父组件根节点
    scrollmyself: {
      type: Boolean,
      default: true
    }
  },
  created() {},
  mounted() {
    // 通过这个target来判断当前的滚动监听对象是谁
    if (this.scrollmyself) {
      // 当前所在的父元素根节点
      this.target = this.$parent.$el;
    } else {
      // body节点
      this.target = document.body;
    }
    // 根节点绑定滚动事件监听tab栏
    this.target.addEventListener("scroll", this.scrolling);
  },
  beforeDestroy() {
    //  组件销毁的时候，需要删除scroll的监听事件。
    this.target.removeEventListener("scroll", this.scrolling);
  },
  methods: {
    scrolling() {
      // 根据滑动改变透明度
      if (this.target.scrollTop < 10) {
        this.$refs.bgc.style.opacity = 0;
      } else {
        let opacity = this.target.scrollTop / 100;
        this.$refs.bgc.style.opacity = opacity;
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.c-navbar {
  width: 100%;
  height: 60px;
  position: fixed;
  transform: translateZ(0);
  left: 0;
  top: 0;
  z-index: 999;
  .bgc_opacity {
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .navbar_content {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 11px;
    .navbar_left {
      font-size: 17px;
      margin-top: 5px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .nav_center {
      font-size: 17px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .nav_right {
      font-size: 17px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>

