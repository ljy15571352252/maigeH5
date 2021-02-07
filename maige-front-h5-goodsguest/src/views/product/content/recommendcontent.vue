<template>
  <div class="v_product_content_swiper_area">
    <van-swipe @change="changePage" :loop="false">
      <van-swipe-item :key="index" v-for="(item, index) in pagesData">
        <div class="productPage">
          <recommenditem :item="sub" :key="num" v-for="(sub, num) in item" />
        </div>
      </van-swipe-item>
      <div class="footer_tab" slot="indicator">
        <span
          :class="currentPage === (num - 1) ? 'tab active_tab' : 'tab'"
          :key="num"
          v-for="num in pagesData.length"
        ></span>
      </div>
    </van-swipe>
  </div>
</template>

<script>
/**
 * 为你推荐/热销排行/猜你喜欢功能模块中的商品展示区域(左右轮播形式)
 */
// 商品缩略图
import recommenditem from "@/views/product/content/recommenditem.vue";
export default {
  name: "recommendcontent",
  data() {
    return {
      // 当前轮播页
      currentPage: 0
    };
  },
  props: {
    // 当前tab的数据
    tabData: {
      default: []
    }
  },
  created() {},
  computed: {
    // 分类菜单的渲染数据，一维转二维
    pagesData() {
      return this.arrayChange(this.tabData, 4);
    }
  },
  components: {
    recommenditem
  },
  methods: {
    // 一维数组转化为二维数组的方法,objArray表示一维数组，num表示二维数组里的一个数组多少个元素
    arrayChange(objArray, num) {
      // 一维数组的个数
      const len = objArray && objArray.length;
      // 分成几份
      const totalNum = len % num === 0 ? len / num : Math.floor(len / num + 1);
      let res = [];
      for (let i = 0; i < totalNum; i++) {
        let temp = objArray.slice(i * num, i * num + num);
        res.push(JSON.parse(JSON.stringify(temp)));
      }
      return res;
    },
    // 滑动切换下标
    changePage(index) {
      this.currentPage = index;
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v_product_content_swiper_area {
  width: 355px;
  margin: 10px auto 0;
  background-color: #fff;
  .productPage {
    display: flex;
    flex-wrap: wrap;
    color: #333;
  }
  // 下标的样式
  .footer_tab {
    margin-left: 50%;
    padding: 10px 0;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: -5px;
    .tab {
      display: inline-block;
      width: 10px;
      height: 4px;
      border-radius: 2px;
      background-color: #ddd;
    }
    .tab:nth-of-type(n + 2) {
      margin-left: 6px;
    }
    .active_tab {
      width: 15px;
      background-color: $mainColor;
    }
  }
}
</style>

