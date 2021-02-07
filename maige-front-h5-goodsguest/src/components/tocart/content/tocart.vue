<template>
  <transition name="slide-fade">
    <div class="page-component-up-cart" v-show="isShow" @click="toCart">
      <img class="top_icon" src="~assets/images/home/gouwuche.png" />
    </div>
  </transition>
</template>
<script>
/**
 * 回到购物车组件
 */
export default {
  name: "tocart",
  props: {
    // 选择滚动对象，默认true为当前的父组件根节点
    scrollmyself: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否展示
      isShow: false,
      // 目标节点
      target: ""
    };
  },
  mounted() {
    // 通过这个target来判断当前的滚动监听对象是谁
    if (this.scrollmyself) {
      // 当前所在的父元素根节点
      this.target = this.$el.parentNode;
    } else {
      // body节点
      this.target = document.body;
    }
    this.target.addEventListener("scroll", this.showIcon);
  },
  beforeDestroy() {
    //  组件销毁的时候，需要删除scroll的监听事件。
    this.target.removeEventListener("scroll", this.showIcon);
  },
  methods: {
    // 根据滚动距离决定是否显示按钮
    showIcon() {
      if (this.target.scrollTop > 100) {
        this.isShow = true;
        this.$el.addEventListener("touchstart", this.addhoverClass);
        this.$el.addEventListener("touchend", this.addhoverClass);
      } else if (this.target.scrollTop < 100) {
        this.isShow = false;
      }
    },
    //  添加样式，鼠标hover上去，改变颜色
    addhoverClass(e) {
      if (e.type === "touchstart") {
        this.$el.classList.add("touch");
      } else if (e.type === "touchend") {
        this.$el.classList.remove("touch");
      }
    },
    // 返回顶部的函数
    toCart() {
      this.$router.push({
        name: "cart"
      });
    }
  }
};
</script>

<style lang="scss">
.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.3, 0.8, 1);
  opacity: 0;
}
.slide-fade-enter, .slide-fade-leave-to
   /* .slide-fade-leave-active 在低于 2.1.8 版本中 */ {
  // transform: translateY(-20px);
  opacity: 0;
}
.page-component-up-cart {
  background-color: #fff;
  position: fixed;
  right: 26px;
  bottom: 110px;
  width: 40px;
  height: 40px;
  border-radius: 25px;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  .top_icon {
    width: 20px;
    height: 20px;
  }
  .touch {
    background-color: red;
  }
}
</style>