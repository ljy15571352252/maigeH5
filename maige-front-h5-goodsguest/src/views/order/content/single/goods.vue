<template>
  <div class="v-order-content-goods">
    <!-- <div class="store_name">
      <div class="group_box">
        <img class="group_icon" :src="goods.groupIcon" alt />
        <span class="group_name one-txt-cut">{{goods.supplierName}}</span>
        <van-icon class="next_icon" name="arrow" />
      </div>
    </div>-->
    <div class="store_choose">
      <div :key="item.cartId" v-for="(item) in goods.data">
        <div class="goods_items">
          <img class="goods_img" v-lazy="item.thumbnailImgUrl" />
          <div class="right_box">
            <div class="goods_name two-txt-cut">{{item.goodsName}}</div>
            <div class="goods_type one-txt-cut">
              <span class="type_text">{{item.goodsAttr}}</span>
              <van-icon name="arrow-down" />
            </div>
            <div class="footer_show">
              <span class="now_price">￥{{item.specialPrice}}</span>
              <span class="num_box">{{item.quantity}}</span>
            </div>
          </div>
        </div>
        <van-divider />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 单地址提交订单时的商品信息
 * 参数说明：goods 当前商店的商品信息
 */
export default {
  name: "goods",
  data() {
    return {
      goods: JSON.parse(JSON.stringify(this.data))
    };
  },
  props: {
    // 当前商店的所有货物
    data: {
      default: {}
    }
  },
  created() {},
  computed: {},
  watch: {},
  components: {},
  methods: {}
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-order-content-goods {
  background: #fff;
  margin-top: 10px;
  // 商店标题样式
  .store_name {
    padding: 10px 16px;
    display: flex;
    align-items: center;
    .group_box {
      display: flex;
      align-items: center;
      .group_icon {
        width: 12px;
        height: 12px;
        margin-right: 5px;
      }
      .group_name {
        max-width: 150px;
        color: #131313;
        font-size: 14px;
        margin-right: 12px;
        vertical-align: middle;
        font-weight: bold;
      }
      .next_icon {
        vertical-align: middle;
      }
    }
  }
  // 当前商店名下的购物车商品
  .store_choose {
    widows: 100%;
    padding: 0 15px;
    .goods_items {
      display: flex;
      align-items: center;
      padding: 6px;
      .goods_img {
        width: 68px;
        height: 68px;
        margin-right: 20px;
      }
      .right_box {
        flex: 1;
        .goods_name {
          word-break: break-all;
          color: #131313;
          font-size: 14px;
          font-weight: 400px;
          padding: 0;
        }
        .goods_type {
          color: #ccc;
          font-size: 11px;
          display: flex;
          align-items: center;
          padding: 8px;
          .type_text {
            margin-right: 10px;
          }
        }
        .footer_show {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          .now_price {
            font-size: 15px;
            color: #ff3a44;
          }
          .num_box {
            width: 76px;
            padding: 4px 0;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
        }
      }
    }
  }
}
</style>