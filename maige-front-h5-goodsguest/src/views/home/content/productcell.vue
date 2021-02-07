<template>
  <div class="c-product-cell" @click="toDetail(data)">
    <img v-lazy="data.goodsThumbnailImgUrl" alt />
    <div>
      <div class="product_des">{{data.goodsName}}</div>
      <div class="price_info">
        <div>
          <div class="pricenow">商城价： ¥{{data.shopPrice}}</div>
          <del class="priceever">市场价： ¥{{data.jdPrice ? data.jdPrice : data.costPrice}}</del>
        </div>
        <!-- <span class="find_icon" @click.stop="findSimilar(data)">找相似</span> -->
      </div>
    </div>
  </div>
</template>

<script>
import { deepEqual } from "assert";
/**
 * 员工福利-首页精选的商品展示缩略图模块
 * 使用方式，引入注册，实例化 <productcell :item="item" />
 * 参数说明：1.item表示商品的信息，必填
 *           2. toDetail表示跳转详情页自定义事件，可以在父组触发
 *           3. findSimilar表示找相似操作自定义点击事件，可以在父组件触发
 */
export default {
  name: "productcell",
  data() {
    return {
      data: {}
    };
  },
  props: {
    item: {
      default: {}
    }
  },
  watch: {
    item: {
      handler(newValue) {
        if (newValue) {
          const data = JSON.parse(JSON.stringify(newValue));
          this.data = data;
          this.$forceUpdate();
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    // 跳转详情页
    toDetail(data) {
      this.$emit("toDetail", data);
    },
    // 找相似
    findSimilar(data) {
      this.$emit("findSimilar", data);
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.c-product-cell {
  width: 173px;
  height: 280px;
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  img {
    max-width: 100%;
    height: 177px;
  }
  .product_des {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-top: 15px;
    font-size: 13px;
    color: #333;
  }
  .price_info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }
  .pricenow {
    color: $mainColor;
    margin-right: 10px;
  }
  .priceever {
    color: #666;
  }
  .find_icon {
    padding: 2px 5px;
    font-size: 9px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 8px;
  }
}
.c-product-cell:nth-of-type(2n) {
  margin-left: 10px;
}
</style>

