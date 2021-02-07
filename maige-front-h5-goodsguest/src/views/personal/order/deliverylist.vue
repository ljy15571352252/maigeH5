<template>
  <div class="v-personal-deliverylist">
    <div class="nav_header">
      <navbar class="nav_comments" title="物流列表" color="#fff"></navbar>
    </div>
    <div class="comments_list" :key="item.deliveryId" v-for="(item) in deliveryList">
      <div :key="sub.deliveryId" v-for="(sub) in item.goodsList">
        <div class="goods_detail">
          <img class="detail_img" :src="sub.thumbnailImgUrl" />
          <div class="detail_right">
            <div class="goods">
              <div class="goods_des">{{sub.goodsName}}</div>
              <div class="type_des">{{sub.goodsAttr}}</div>
            </div>
          </div>
        </div>
        <van-divider />
      </div>
      <div class="operation_btn">
        <van-button size="small" round type="default" @click.stop="checkDetail(item)">物流详情</van-button>
      </div>
    </div>
    <!-- 回到顶部组件 -->
    <back-top />
  </div>
</template>

<script>
/**
 * 当前订单的物流信息列表
 */
// 头部nav栏
import navbar from "@/components/navbar/nav.vue";
// 接口
import { orderDelivery } from "@/configs/interface.js";
export default {
  name: "ordercomments",
  data() {
    return {
      // 物流信息列表
      deliveryList: []
    };
  },
  components: {
    navbar
  },
  created() {
    this.getDeliveryList();
  },
  methods: {
    // 查询物流信息列表
    getDeliveryList() {
      this.$http({
        method: "get",
        url: orderDelivery,
        data: {
          orderId: this.$route.query.orderId
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          this.deliveryList = data;
        }
      });
    },
    // 点击跳转查看物流详情
    checkDetail(value) {
      this.$router.push({
        name: "deliveryDetail",
        query: {
          deliveryId: value.deliveryId
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-deliverylist {
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
  .operation_btn {
    text-align: right;
  }
}
</style>