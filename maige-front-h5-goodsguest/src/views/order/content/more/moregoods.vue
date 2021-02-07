<template>
  <div class="v-order-content-moregoods">
    <div class="address_info">
      <div class="address_top">
        <span class="user_name">{{goods.consignee}}</span>
        <span class="user_phone">{{goods.phone}}</span>
      </div>
      <div class="address_bottom">
        <van-icon class="location_icon" name="location" />
        <div
          class="address_des"
        >{{goods ? (goods.provinceName + goods.cityName + goods.districtName + goods.address) : ""}}</div>
      </div>
    </div>
    <van-divider />
    <div class="store_choose">
      <div :key="item.cartId" v-for="(item) in goods.orderGoodsList">
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
 * 多地址提交时的商品信息
 * 参数说明：goods 当前商店的商品信息
 */
import { Dialog } from "vant";
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
.v-order-content-moregoods {
  background: #fff;
  margin-top: 10px;
  // 当前地址信息
  .address_info {
    margin-top: 10px;
    padding: 0 12px;
    .address_top {
      display: flex;
      align-items: center;
      font-size: 13px;
      .user_name {
        color: #131313;
        margin-right: 10px;
      }
      .user_phone {
        color: #c7c7cc;
      }
    }
    .address_bottom {
      display: flex;
      align-items: flex-start;
      margin-top: 5px;
      .location_icon {
        color: #c7c7cc;
        margin-right: 10px;
        font-size: 18px;
      }
      .address_des {
        flex: 1;
        margin-right: 15px;
        font-size: 13px;
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
        }
        .goods_type {
          color: #ccc;
          font-size: 11px;
          display: flex;
          align-items: center;
          margin-top: 10px;
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