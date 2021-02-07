<template>
  <div class="v-order-submit">
    <div class="submit_header">
      <navbar title="填写地址" color="#fff"></navbar>
    </div>
    <div class="submit_tab">
      <span :class="{address_active: $route.query.address === '0'}" @click="chooseSingle">单地址选择</span>
      <span class="divider_line"></span>
      <span :class="{address_active: $route.query.address === '1'}" @click="chooseMore">多地址选择</span>
    </div>
    <div class="tab_content">
      <single :data="orderInfo" v-if="$route.query.address === '0'" />
      <more :data="orderInfo" v-if="$route.query.address === '1'" />
    </div>
  </div>
</template>

<script>
/**
 * 订单提交（单地址，多地址）路由参数address为0表示单地址，1表示多地址
 */
// 头部nav栏
import navbar from "@/components/navbar/nav.vue";
// 单地址页面
import single from "@/views/order/content/single/index.vue";
// 多地址页面
import more from "@/views/order/content/more/index.vue";
import { myStorage } from "@/utils/cache.js";
import { Toast, Dialog } from "vant";
import { orderList } from "@/configs/interface.js";
export default {
  name: "submitorder",
  data() {
    return {
      // 订单的信息
      orderInfo: null,
      // 待提交的商品列表
      goodslist: []
    };
  },
  created() {
    this.getList();
  },
  components: {
    navbar,
    single,
    more
  },
  methods: {
    // 选择单地址
    chooseSingle() {
      if (this.$route.query.address == "0") {
        return;
      }
      this.$router.push({
        name: "orderSubmit",
        query: {
          address: "0",
          buyNow: this.$route.query.buyNow,
          activityId: this.$route.query.activityId
        }
      });
    },
    // 选择多地址
    chooseMore() {
      if (this.$route.query.address == "1") {
        return;
      }
      // 如果为团购绑定地址，则不可选择多地址
      if (this.$route.query.isBindAddress == '1') {
        return;
      }
      // 如果只有一个数量的商品，则只能单地址提交而不能点击多地址
      if (this.goodslist.length === 1 && this.goodslist[0].quantity <= 1) {
        Toast("只有数量大于1才可以多地址分配");
        return;
      }
      this.$router.push({
        name: "orderSubmit",
        query: {
          address: "1",
          buyNow: this.$route.query.buyNow,
          activityId: this.$route.query.activityId
        }
      });
    },
    // 查询待提交订单的商品列表(如果是购物车的商品则不需要传参数，只有立即购买时需要传)
    getList() {
      let data = {};
      // buyNow为1时表示立即购买，为0时表示购物车结算
      if (this.$route.query.buyNow == 1) {
        data = this.$store.state.common.buyNowData;
        this.groupId = data.groupId;
      }
      this.$http({
        method: "post",
        url: orderList,
        data: data
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          this.orderInfo = data;
          this.goodslist = data.goodsParams || [];
          let allNum = 0;
          this.goodslist.map((item, index) => {
            allNum += item.quantity;
          });
          // 如果商品数量不足，则提示跳转至首页
          if (allNum < 1) {
            Dialog.confirm({
              title: "",
              message: "请重新提交订单"
            }).then(() => {
              this.$router.replace({
                path: "/"
              });
            });
          }
          // 多地址分配时使用,用来初始化商品列表
          const assignAddress = this.$store.state.common.assignAddress;
          if (!assignAddress) {
            this.$store.commit("common/setMutipleAddress", this.goodslist);
          }
          // this.payList = data.payment;
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-order-submit {
  background: $lightColor;
  height: 100vh;
  overflow: auto;
  .submit_header {
    width: 100%;
    height: 105px;
    background: url("~assets/images/order/order.png") no-repeat;
    background-size: cover;
  }
  // tab栏
  .submit_tab {
    width: 305px;
    height: 40px;
    color: #ccc;
    background: #fff;
    border-radius: 25px;
    margin: -25px auto 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    .divider_line {
      width: 0px;
      height: 14px;
      border: 1px solid #ccc;
      margin: 0 32px;
    }
    // tab栏激活时的内容
    .address_active {
      color: #ff3945;
      position: relative;
    }
    .address_active::after {
      content: "";
      position: absolute;
      left: -16px;
      top: 50%;
      transform: translateY(-50%);
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #ff355f;
      border-radius: 50%;
    }
  }
  // tab栏下面的内容
  .tab_content {
    margin-top: 25px;
    margin-bottom: 50px;
  }
}
</style>

