<template>
  <div class="v-cart-content-recommenditem" @click="toDetail(item)">
    <div class="img_box">
      <img v-lazy="item.goodsThumbnailImgUrl" />
    </div>
    <div class="item_content">
      <div class="text_content two-txt-cut">{{item.goodsName}}</div>
      <div class="type_list">
        <div :key="index" v-for="(sub, index) in item.typeArr" class="type_item">{{sub}}</div>
      </div>
      <div class="footer_box">
        <div>
          <div class="price_box">
            <span>商城价：</span>
            <span class="now_price">￥{{item.shopPrice}}</span>
          </div>
          <div class="price_box">
            <span>市场价：</span>
            <del class="last_price">{{item.costPrice}}</del>
          </div>
          <div v-if="item.saleVolume" class="sales">月销{{item.saleVolume || 0}}件</div>
        </div>
        <img src="~assets/images/product/red_cart.png" @click.stop="addCart(item)" />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 为你推荐/热销排行/猜你喜欢功能模块中的商品缩略图
 */
import { addShopCart, getClickCount } from "@/configs/common.js";
import { Toast } from "vant";
export default {
  name: "recommenditem",
  data() {
    return {};
  },
  props: {
    // 当前商品的数据
    item: {
      default: null
    }
  },
  created() {},
  methods: {
    toDetail(item) {
      // 统计点击
      getClickCount(item.goodsId);
      this.$router.replace({
        name: "productnormal",
        query: {
          id: item.goodsId,
          type: "buy"
        }
      });
    },
    // 加入购物车
    addCart(item) {
      // 请求购物车接口
      let data = {
        goodsId: item.goodsId,
        goodsName: item.goodsName,
        goodsPrice: item.shopPrice,
        goodsSn: item.goodsSn,
        quantity: 1,
        skuId: item.skuId,
        supplierId: item.supplierId,
        activityGoodsId: item.activityGoodsId,
        activityId: item.activityId,
        activityTypeNum: item.activityTypeNum,
        groupId: item.groupId
      };
      addShopCart(data).then(res => {
        if (res.code === 200) {
          Toast("添加购物车成功");
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-cart-content-recommenditem {
  width: 170px;
  height: 280px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .img_box {
    width: 100%;
    height: 173px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .item_content {
    padding: 10px;
    .text_content {
      color: #333;
      font-size: 13px;
    }
    .type_list {
      display: flex;
      align-items: center;
      margin-top: 8px;
      .type_item {
        width: 28px;
        font-size: 10px;
        color: #ff3945;
        text-align: center;
        padding: 2px 0;
        border: 1px solid #ff3945;
        border-radius: 3px;
      }
      .type_item:nth-of-type(n + 2) {
        margin-left: 7px;
      }
    }
    .footer_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .price_box {
        .now_price {
          color: #ff3945;
          font-size: 13px;
        }
        .last_price {
          color: #666;
          margin-left: 5px;
        }
      }
      img {
        width: 15px;
        height: 15px;
      }
      .sales {
        color: #666;
        font-size: 10px;
      }
    }
  }
}
.v-cart-content-recommenditem:nth-of-type(2n) {
  margin-left: 10px;
}
</style>

