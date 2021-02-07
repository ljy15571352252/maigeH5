<template>
  <div class="v-personal-commentedit">
    <div class="nav_header">
      <navbar
        class="nav_comments"
        title="评价晒单"
        color="#fff"
      ></navbar>
    </div>
    <div class="comments_content">
      <div class="goods_detail">
        <img class="detail_img" :src="goodsInfo.thumbnailImgUrl" />
        <div class="detail_right">
          <div class="goods">
            <div class="goods_des two-txt-cut">{{goodsInfo.goodsName}}</div>
            <div class="type_des">{{goodsInfo.goodsAttr}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 评价或追评页面
 */
// 头部nav栏
import navbar from "@/components/navbar/nav.vue";
// 确认弹窗
import { Dialog, Toast } from "vant";
// 接口
import { commentsgoodsInfo, goodsCommentsInfo } from "@/configs/interface.js";
import { myStorage } from "@/utils/cache.js";
export default {
  name: "commentedit",
  data() {
    return {
      // 商品基础信息服务
      goodsInfo: {}
    };
  },
  components: {
    navbar
  },
  created() {
    if (this.$route.query.commentId) {
      this.getGoodsComments();
    }
    this.getGoodsDetail();
  },
  methods: {
    // 查询评价页面商品基础信息
    getGoodsDetail() {
      this.$http({
        method: "get",
        url: commentsgoodsInfo,
        data: {
          orderId: this.$route.query.orderId,
          goodsId: this.$route.query.goodsId,
          skuId: this.$route.query.skuId
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          this.goodsInfo = data;
        }
      });
    },
    // 追评时带出的商品评价一些信息比如评价等级
    getGoodsComments() {
      this.$http({
        method: "get",
        url: goodsCommentsInfo,
        data: {
          commentId: this.$route.query.commentId
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          console.log(data);
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-commentedit {
  height: 100%;
  background-color: $lightColor;
  height: 100vh;
  overflow: auto;
  .nav_header {
    width: 100%;
    height: 150px;
    background: url("~assets/images/order/order_end.png") no-repeat;
    background-size: contain;
  }
  .comments_content {
    margin: 0 10px;
    margin-top: -80px;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    min-height: 100%;
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
}
</style>