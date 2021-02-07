<template>
  <div class="v-order-payresult">
    <navbar
      title="支付结果"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    ></navbar>
    <div class="pay_des">
      <img v-if="status === 1" class="pay_img" src="~assets/images/order/success.png" />
      <img v-if="status === 2" class="pay_img" src="~assets/images/order/fail.png" />
      <div v-if="status === 1" class="pay_success">
        <div>恭喜你</div>
        <div>本次交易支付成功</div>
      </div>
      <div v-if="status === 2" class="pay_fail">本次交易支付失败</div>
      <div v-if="status === 1" class="operation_btn">
        <van-button size="small" type="default" @click="lookOrder">查看订单</van-button>
        <van-button size="small" type="primary" @click="toHome">返回首页</van-button>
      </div>
      <div v-if="status === 2" class="operation_btn">
        <van-button size="small" type="default" @click="reloadPay">查看订单</van-button>
        <van-button size="small" type="primary" @click="toHome">返回首页</van-button>
      </div>
      <div v-html="html" v-show="false">{{html}}</div>
    </div>
  </div>
</template>

<script>
/**
 * 订单的支付结果页面
 */
// 头部nav栏
import navbar from "@/components/navbar/nav.vue";
import { Toast, Dialog } from "vant";
// 接口
import { payStatus, payMoney } from "@/configs/interface.js";
export default {
  name: "single",
  data() {
    return {
      timer: null,
      // 是否支付成功, 1表示成功 2表示失败
      status: "",
      // 加载动画对象
      loading: null,
      // 支付宝支付返回的
      html: ""
    };
  },
  props: {},
  created() {},
  mounted() {
    if (this.$route.query.payId == "other") {
      // 0元支付
      this.status = 1;
    } else {
      Dialog.alert({
        title: "",
        message: "确认支付完成"
      }).then(() => {
        this.loading = Toast.loading({
          message: "加载中...",
          forbidClick: true
        });
        this.timer = setInterval(() => {
          this.getStatus();
        }, 2000);
      });
    }
  },
  components: {
    navbar
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {},
  methods: {
    // 查询支付状态
    getStatus() {
      this.$http({
        method: "get",
        url: payStatus,
        data: {
          orderNo: this.$route.query.orderNo
        }
      }).then(res => {
        clearInterval(this.timer);
        this.loading.clear();
        if (res.code == 200) {
          this.status = 1;
        } else {
          this.status = 2;
        }
      });
    },
    toHome() {
      this.$router.push({
        name: "home"
      });
    },
    // 重新支付
    reloadPay() {
      this.$router.push({
        name: "orderManage"
      });
      // this.$http({
      //   method: "get",
      //   url: payMoney,
      //   data: {
      //     orderNo: this.$route.query.orderNo,
      //     serverName: encodeURI(location.origin + process.env.BASE_URL)
      //   }
      // }).then(res => {
      //   if (res.code == 200) {
      //     let data = res.data || {};
      //     if (this.$route.query.payId == 3) {
      //       window.location.href = data.wapUrl;
      //     } else if (this.$route.query.payId == 4) {
      //       this.html = data.wapUrl;
      //       this.$nextTick(() => {
      //         document.forms[0].submit();
      //       });
      //     }
      //   }
      // });
    },
    // 去到订单管理页面
    lookOrder() {
      this.$router.push({ name: "orderManage" });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-order-payresult {
  background: $lightColor;
  height: 100vh;
  padding-top: 60px;
  .pay_des {
    margin-top: 80px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .pay_img {
      width: 211px;
      height: auto;
    }
    .pay_fail,
    .pay_success {
      margin-top: 40px;
      color: #8c8c8c;
      font-size: 15px;
      text-align: center;
    }
    .operation_btn {
      margin-top: 35px;
      .van-button--default {
        margin-right: 20px;
      }
    }
  }
}
</style>