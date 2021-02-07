<template>
  <div class="v-personal-comments">
    <div class="nav_header">
      <navbar
      class="nav_comments"
      title="评价晒单"
      color="#fff"
    ></navbar>
    </div>
    <div class="comments_list">
      <div :key="sub.skuId" v-for="(sub) in orderInfo.orderGoodsList">
        <div class="goods_detail">
          <img class="detail_img" :src="sub.thumbnailImgUrl" />
          <div class="detail_right">
            <div class="goods">
              <div class="goods_des">{{sub.goodsName}}</div>
              <div class="type_des">{{sub.goodsAttr}}</div>
            </div>
            <van-button
              v-if="!sub.hadComment"
              size="small"
              round
              type="default"
              @click.stop="commentsGoods(sub)"
            >评价</van-button>
            <van-button
              v-if="sub.hadComment == 1"
              size="small"
              round
              type="default"
              @click.stop="commentsGoodsAdd(sub)"
            >追加评价</van-button>
            <van-button
              v-if="sub.hadComment == 3"
              size="small"
              round
              type="default"
              @click.stop="commentsDetail(sub)"
            >评论详情</van-button>
          </div>
        </div>
        <van-divider />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 当前订单的多个商品的评价晒单列表(只有当前订单为多个商品时才会弹出)
 */
// 头部nav栏
import navbar from "@/components/navbar/nav.vue";
// 接口
import { orderDetail } from "@/configs/interface.js";
export default {
  name: "ordercomments",
  data() {
    return {
      orderInfo: {}
    };
  },
  components: {
    navbar
  },
  created() {
    this.getOrderDetail();
  },
  methods: {
    // 查询支付完成的订单详情
    getOrderDetail() {
      this.$http({
        method: "get",
        url: orderDetail,
        data: {
          orderId: this.$route.query.orderId
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          this.orderInfo = data;
        }
      });
    },
    // 评价
    commentsGoods(sub) {
      this.$router.push({
        name: "commentEdit",
        query: {
          orderId: sub.orderId,
          goodsId: sub.goodsId,
          skuId: sub.skuId
        }
      });
    },
    // 追加评价
    commentsGoodsAdd(sub) {
      if (sub.commentId) {
        this.$router.push({
          name: "commentEdit",
          query: {
            orderId: sub.orderId,
            commentId: sub.commentId,
            goodsId: sub.goodsId,
            skuId: sub.skuId
          }
        });
      }
    },
    // 评论详情
    commentsDetail(sub) {}
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-comments {
  height: 100%;
  background-color: $lightColor;
  height: 100vh;
  overflow: auto;
  padding-bottom: 30px;
  .nav_header {
    width: 100%;
    height: 150px;
    background: url("~assets/images/order/order_end.png") no-repeat;
    background-size: contain;
  }
  .comments_list {
    margin: 0 10px;
    margin-top: -80px;
    border-radius: 8px 8px 0 0;
    background: #fff;
    min-height: 100%;
  }
  .goods_detail {
    display: flex;
    align-items: center;
    padding: 8px;
    background: #fff;
    .detail_img {
      width: 70px;
      height: 70px;
      margin-right: 12px;
    }
    .detail_right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .goods {
      flex: 1;
      margin-right: 20px;
      .goods_des {
        color: #454545;
        line-height: 20px;
      }
      .type_des {
        color: #999;
      }
    }
  }
}
</style>