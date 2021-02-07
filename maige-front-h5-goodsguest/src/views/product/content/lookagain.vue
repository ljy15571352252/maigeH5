<template>
  <div class="v-product-content-lookagain">
    <div class="looagain_title">热销排行</div>
    <div class="productPage">
      <recommenditem :item="sub" :key="num" v-for="(sub, num) in tabData" />
    </div>
  </div>
</template>

<script>
/**
 * 热销排行
 * 参数说明: paramter 父组件传过来的商品信息
 */
// 商品区域（带轮播）
import recommenditem from "@/views/product/content/recommenditem.vue";
// 接口
import { hotRank } from "@/configs/interface.js";
export default {
  name: "lookagain",
  data() {
    return {
      tabData: [],
      // 父组件传过来的商品信息
      goodsData: {}
    };
  },
  props: {
    paramter: {
      default: {}
    }
  },
  watch: {
    paramter: {
      handler(newValue) {
        this.goodsData = newValue;
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getList();
  },
  components: {
    recommenditem
  },
  methods: {
    getList() {
      this.$http({
        method: "get",
        url: hotRank,
        data: {
          catId: this.goodsData.catId,
          goodsName: this.goodsData.goodsName,
          showNumber: 6
        }
      }).then(res => {
        this.tabData = res;
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-product-content-lookagain {
  width: 100%;
  padding-bottom: 80px;
  .looagain_title {
    width: 100%;
    padding: 18px;
    font-size: 14px;
    color: #666;
    text-align: center;
    background: #f3f4f5;
  }
  .productPage {
    display: flex;
    flex-wrap: wrap;
    color: #333;
    padding: 10px;
  }
}
</style>

