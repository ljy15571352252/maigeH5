<template>
  <div class="v-order-payorder">
    <navbar
      title="提交订单"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    ></navbar>
    <div class="container">
      <div class="base_info">
        <div class="all_title">基本信息</div>
        <div class="time_box">
          <div class="time_des">剩余时间</div>
          <div class="split_line"></div>
          <van-count-down :time="time">
            <template v-slot="timeData">
              <span class="time_item">
                {{ timeData.hours > 9 ? timeData.hours : '0' + timeData.hours }}
                <span
                  class="time_des"
                  style="left: 6px"
                >Hour</span>
              </span>
              <span>:</span>
              <span class="time_item">
                {{ timeData.minutes > 9 ? timeData.minutes : '0' + timeData.minutes }}
                <span
                  class="time_des"
                >Minute</span>
              </span>
              <span>:</span>
              <span class="time_item">
                {{ timeData.seconds > 9 ? timeData.seconds : '0' + timeData.seconds }}
                <span
                  class="time_des"
                >Second</span>
              </span>
            </template>
          </van-count-down>
        </div>
        <div class="pay_tip">
          <img class="ok_icon" src="~assets/images/order/ok.png" alt />
          <span>订单已确定，请在60分钟内付款。</span>
        </div>
        <div class="order_brief">
          <div class="brief_item one-txt-cut">
            <span>订单号：</span>
            <span>{{orderInfo.orderNo}}</span>
          </div>
          <div class="brief_item one-txt-cut">
            <span>支付金额：</span>
            <span>¥{{orderInfo.amount || 0}}</span>
          </div>
          <div v-if="$route.query.type === 'single'" class="brief_item two-txt-cut">
            <span>收货地址：</span>
            <span>{{orderInfo.addressInfo ? orderInfo.addressInfo.replace('null', '') : ""}}</span>
          </div>
        </div>
      </div>
      <div class="goods_info">
        <div class="all_title">商品信息</div>
        <div v-if="$route.query.type === 'single'" class="goods_box">
          <goods ref="child" :key="index" v-for="(item, index) in allgoods" :data="item" />
        </div>
        <div v-if="$route.query.type === 'more'" class="goods_box">
          <moregoods
            ref="child"
            :key="index"
            v-for="(item, index) in orderInfo.orderDetails"
            :data="item"
          />
        </div>
      </div>
      <van-cell-group class="modal_box">
        <div class="pay_info all_title">支付信息</div>
        <van-cell @click="showPopup('pay')">
          <template v-slot:title>
            <div class="cell_box">
              <img class="cell_img" src="~assets/images/order/pay.png" />
              <span class="cell_title">支付方式</span>
            </div>
          </template>
          <template v-slot:default>
            <span>{{currentPay.payType || '无'}}</span>
          </template>
        </van-cell>
        <van-cell @click="showPopup('exchange')">
          <template v-slot:title>
            <div class="cell_box">
              <img class="cell_img" src="~assets/images/order/exchange.png" />
              <span class="cell_title">积分兑换</span>
            </div>
          </template>
          <template v-slot:default>
            <span>{{orderInfo.integralUseNum ? ('已使用' + orderInfo.integralUseNum + "积分") : "未使用积分"}}</span>
          </template>
        </van-cell>
        <!-- <van-cell @click="showPopup('coupons')">
          <template v-slot:title>
            <div class="cell_box">
              <img class="cell_img" src="~assets/images/order/coupons.png" />
              <span class="cell_title">优惠券</span>
            </div>
          </template>
          <template v-slot:default>
            <span>无</span>
          </template>
        </van-cell>-->
        <!-- <van-cell @click="showPopup('redpacket')">
          <template v-slot:title>
            <div class="cell_box">
              <img class="cell_img" src="~assets/images/order/redpacket.png" />
              <span class="cell_title">红包使用</span>
            </div>
          </template>
          <template v-slot:default>
            <span>无</span>
          </template>
        </van-cell>-->
      </van-cell-group>
      <div v-html="html" v-show="false">{{html}}</div>
    </div>
    <div class="footer_operation">
      <div>共计{{choosegoods.allNum}}件商品</div>
      <div>
        <span>合计：</span>
        <span class="price_sum">￥{{orderInfo.amount || 0}}</span>
        <van-button round size="small" type="primary" @click="payOrder">立即支付</van-button>
      </div>
    </div>
    <pay
      v-model="showPay"
      :currentPay="currentPay"
      @payResult="payResult"
      :list="payList"
      @close="value => showPay = value"
    />
    <exchange
      v-model="showExchange"
      :current="currentExchange"
      :list="exchangeList"
      @exchangeResult="exchangeResult"
      @close="value => showExchange = value"
    />
    <coupons v-model="showCoupons" @close="value => showCoupons = value" />
    <redpacket v-model="showRedpacket" @close="value => showRedpacket = value" />
  </div>
</template>

<script>
/**
 * 订单的支付（单地址和多地址）
 */
// 头部nav栏
import navbar from "@/components/navbar/nav.vue";
// 引入单地址提交订单的所有商品列表
import goods from "@/views/order/content/single/goods.vue";
// 引入多地址提交订单的所有商品列表
import moregoods from "@/views/order/content/more/moregoods.vue";
// 引入支付方式弹窗
import pay from "@/views/order/modal/pay.vue";
// 引入积分兑换弹窗
import exchange from "@/views/order/modal/exchange.vue";
// 引入优惠券弹窗
import coupons from "@/views/order/modal/coupons.vue";
// 引入红包使用弹窗
import redpacket from "@/views/order/modal/redpacket.vue";

import {
  orderInfo,
  orderList,
  payMoney,
  zeroPay,
  accountPayInfo
} from "@/configs/interface.js";
import { myStorage } from "@/utils/cache.js";
import { Dialog } from "vant";
export default {
  name: "single",
  data() {
    return {
      // 订单信息
      orderInfo: {},
      // 待支付的商品列表
      goodslist: [],
      // 支付列表
      payList: [],
      // 积分列表
      exchangeList: [],
      // 选择的地址及地址下的商品列表
      assignList: [],
      // 是否展示支付弹窗
      showPay: false,
      // 是否展示积分兑换弹窗
      showExchange: false,
      // 是否展示优惠券弹窗
      showCoupons: false,
      // 是否展示红包弹窗
      showRedpacket: false,
      // 当前选择的支付方式
      currentPay: {
        payCode: "wxpay_mweb",
        payId: 3,
        payName: "微信H5支付",
        payType: "微信"
      },
      // 当前选择的积分兑换
      currentExchange: "",
      // 当前选择的优惠券
      currentCoupons: "",
      // 当前选择的红包
      currentRedpacket: "",
      // 倒计时
      time: 0,
      // 支付宝返回的html
      html: ""
    };
  },
  props: {},
  created() {
    this.getOrderInfo();
  },
  components: {
    navbar,
    goods,
    moregoods,
    pay,
    exchange,
    coupons,
    redpacket
  },
  computed: {
    // 将接口返回的数据按所在店铺分组
    allgoods() {
      return this.changeGoods(this.goodslist);
    },
    // 所有选中商品的总数量
    choosegoods() {
      let allNum = 0;
      this.goodslist.map((item, index) => {
        allNum += item.quantity;
      });
      return { allNum };
    }
  },
  methods: {
    // 将接口返回的数据按所在店铺分组
    changeGoods(list) {
      // 暂时对象存储，用来判断是否存在这个supplierId
      let newObj = {};
      // 最终需要的数组格式
      let newArr = [];
      list &&
        list.map((item, index) => {
          if (!newObj[item.supplierId]) {
            newArr.push({
              supplierId: item.supplierId,
              supplierName: item.supplierName,
              groupIcon: item.groupIcon,
              data: [item]
            });
            newObj[item.supplierId] = item;
          } else {
            newArr &&
              newArr.map((sub, num) => {
                if (sub.supplierId === item.supplierId) {
                  sub.data.push(item);
                }
              });
          }
        });
      return newArr;
    },
    // 展示各个弹窗
    showPopup(val) {
      switch (val) {
        // case "pay":
        //   this.showPay = true;
        //   break;
        // case "exchange":
        //   this.showExchange = true;
        //   break;
        // case "coupons":
        //   this.showCoupons = true;
        //   break;
        // case "redpacket":
        //   this.showRedpacket = true;
        //   break;
        default:
          break;
      }
    },
    // 选择支付方式的函数
    payResult(data) {
      this.currentPay = data;
    },
    // 添加多地址
    addAddress() {
      this.$router.push({ name: "addressList" });
    },
    // 查看订单详情
    getOrderInfo() {
      this.$http({
        method: "get",
        url: orderInfo,
        data: {
          totalOrderNo: this.$route.query.orderNo
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          this.orderInfo = data;
          // 剩余秒数
          this.time = data.leftTime && data.leftTime * 1000;
          // 如果time为0，则提示跳转至首页
          if (!data.leftTime) {
            Dialog.confirm({
              title: "",
              message: "订单已支付"
            }).then(() => {
              this.$router.replace({
                path: "/"
              });
            });
          }
          // 遍历订单提供的数据得到goodslist;
          const orderDetails = data.orderDetails;
          let list = [];
          orderDetails.map(item => {
            if (item.orderGoodsList && item.orderGoodsList.length > 0) {
              list = list.concat(item.orderGoodsList);
            }
          });
          this.goodslist = list;
          // 获取当前的支付信息
          this.getList(data.payCode);
          // 获取当前的积分信息
          this.getAccoutUse(data.accountInfoId);
        }
      });
    },
    // 选择兑换积分的结果
    exchangeResult(data) {
      this.currentExchange = data;
    },
    // 查询账户支付的一些信息（专属费用，积分兑换等等）accountType为0表示积分列表， 为1表示专属费用列表
    getAccoutUse(accountInfoId) {
      this.$http({
        method: "get",
        url: accountPayInfo,
        data: {
          userId: myStorage.get("userData") && myStorage.get("userData").userId
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data || [];
          // 积分兑换列表
          this.exchangeList = data.filter(item => {
            return item.accountType == 0;
          });
          this.exchangeList.map(item => {
            if (accountInfoId === item.id) {
              this.currentExchange = item;
            }
          });
          // 专属费用列表
          // this.costList = data.filter(item => {
          //   return item.accountType === 1;
          // });
        }
      });
    },
    // 查询订单详情来获取到支付方式列表
    getList(payCode) {
      this.$http({
        method: "post",
        url: orderList,
        data: {}
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          this.payList = data.payment;
          // 获取当前支付方式
          this.payList.map(item => {
            if (item.payCode === payCode) {
              this.currentPay = item;
            }
          });
        }
      });
    },
    // 立即支付
    payOrder() {
      if (this.orderInfo.amount == 0) {
        this.zeroPayMoney();
      } else {
        this.fastPay();
      }
    },
    // 0元支付
    zeroPayMoney() {
      this.$http({
        method: "get",
        url: zeroPay,
        data: {
          orderNo: this.$route.query.orderNo // 总单号
        }
      }).then(res => {
        if (res.code == 200) {
          this.$router.push({
            name: "payResult",
            query: {
              orderNo: this.$route.query.orderNo, // 总单号
              payId: "other"
            }
          });
        }
      });
    },
    // 微信/支付宝支付
    fastPay() {
      this.$http({
        method: "get",
        url: payMoney,
        data: {
          orderNo: this.$route.query.orderNo,
          serverName: encodeURI(location.origin + process.env.BASE_URL)
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          if (this.currentPay.payId == 3) {
            window.location.href = data.wapUrl;
          } else if (this.currentPay.payId == 4) {
            this.html = data.wapUrl;
            this.$nextTick(() => {
              document.forms[0].submit();
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-order-payorder {
  background: $lightColor;
  height: 100%;
  padding-top: 60px;
  padding-bottom: 100px;
  overflow: auto;
  .base_info {
    background: #fff;
    margin-top: 10px;
    .time_box {
      width: 325px;
      height: 97px;
      background: url("~assets/images/order/time_bgc.png") no-repeat;
      background-size: cover;
      margin: 0 auto;
      padding: 10px 15px;
      color: #fff;
      .split_line {
        height: 1px;
        width: 100%;
        background: #fff;
        margin-top: 7px;
      }
      .van-count-down {
        display: flex;
        justify-content: space-around;
        font-size: 35px;
        color: #fff;
        margin-top: 15px;
        .time_item {
          position: relative;
          .time_des {
            position: absolute;
            bottom: -22px;
            left: 0;
            font-size: 10px;
          }
        }
      }
    }
  }
  .pay_tip {
    color: #707070;
    font-size: 13px;
    padding: 10px 26px;
    display: flex;
    align-items: center;
    .ok_icon {
      width: 28px;
      height: 28px;
      margin-right: 15px;
    }
  }
  .order_brief {
    padding: 10px 26px;
    color: #707070;
    font-size: 13px;
  }
  // 商品信息
  .goods_info {
    margin-top: 10px;
    background: #fff;
  }
  // 选择列表
  .modal_box {
    margin-top: 10px;
    .cell_box {
      display: flex;
      align-items: center;
      .cell_img {
        width: 15px;
        height: 15px;
        margin-right: 12px;
      }
      .cell_title {
        color: #131313;
      }
    }
  }
  // 标题
  .all_title {
    position: relative;
    font-size: 15px;
    color: #131313;
    padding: 12px 0 12px 15px;
    background: #fff;
  }
  .all_title:after {
    content: "";
    position: absolute;
    display: inline-block;
    width: 3px;
    height: 15px;
    background: #ff3a44;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
  }
  // 所有商品显示
  .all_goods {
    margin-top: 10px;
    background: #fff;
  }
  .footer_operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 10px;
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 10px;
    width: 100%;
    .van-button--primary {
      width: 90px;
      margin-left: 10px;
    }
  }
}
</style>