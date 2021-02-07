<template>
  <div class="v-personal-orderend">
    <div class="orderend_header">
      <div class="header_nav">
        <van-icon name="arrow-left" @click.stop="() => $router.go(-1)" />
        <!-- <img class="right_icon" src="~assets/images/product/fenxiang.png" /> -->
      </div>
      <!-- 待付款 -->
      <div v-if="orderInfo.orderStatus != 2 && orderInfo.payStatus == 0" class="complete">
        <img class="complete_img" src="~assets/images/order/wait.png" />
        <div class="complete_text">{{orderInfo.statusMsg}}</div>
      </div>
      <!-- 已取消 -->
      <div v-if="orderInfo.orderStatus == 2" class="complete">
        <img class="complete_img" src="~assets/images/order/quxiao.png" />
        <div class="complete_text">{{orderInfo.statusMsg}}</div>
      </div>
      <!-- 待发货 -->
      <div
        v-if="orderInfo.payStatus == 2 && (orderInfo.shippingStatus == 0 || orderInfo.shippingStatus == 4) && orderInfo.orderStatus == 1"
        class="complete"
      >
        <img class="complete_img" src="~assets/images/order/wait.png" />
        <div class="complete_text">{{orderInfo.statusMsg}}</div>
      </div>
      <!-- 待收货 -->
      <div
        v-if="orderInfo.orderStatus == 1 && (orderInfo.shippingStatus == 1 || orderInfo.shippingStatus == 4)"
        class="complete"
      >
        <img class="complete_img" src="~assets/images/order/wait.png" />
        <div class="complete_text">{{orderInfo.statusMsg}}</div>
      </div>
      <!-- 已完成 -->
      <div v-if="(orderInfo.orderStatus == 5 || orderInfo.orderStatus == 4)" class="complete">
        <img class="complete_img" src="~assets/images/order/complete.png" />
        <div class="complete_text">{{orderInfo.statusMsg}}</div>
      </div>
      <!-- 已失效 -->
      <div v-if="orderInfo.orderStatus == 3" class="complete">
        <img class="complete_img" src="~assets/images/order/shixiao.png" />
        <div class="complete_text">{{orderInfo.statusMsg}}</div>
      </div>
    </div>
    <div class="orderend_content">
      <!-- 待付款 -->
      <div v-if="orderInfo.orderStatus != 2 && orderInfo.payStatus == 0" class="wait_pay">
        <div class="wait_info">
          <span class="info_des">需付款：￥</span>
          <span class="pay_num">{{orderInfo.orderAmount}}</span>
          <span class="info_des">剩余时间：</span>
          <van-count-down :time="time" />
        </div>
        <van-button size="small" round type="primary" @click.stop="payNow()">去支付</van-button>
      </div>
      <!-- 已取消 -->
      <div v-if="orderInfo.orderStatus == 2" class="confirm_tip">
        <img class="bus_icon" src="~assets/images/order/bus.png" />
        <div class="confirm_text">您的订单已取消</div>
      </div>
      <!-- 待发货 -->
      <div
        v-if="orderInfo.payStatus == 2 && (orderInfo.shippingStatus == 0 || orderInfo.shippingStatus == 4) && orderInfo.orderStatus == 1"
        class="confirm_tip"
      >
        <img class="bus_icon" src="~assets/images/order/bus.png" />
        <div class="confirm_text">
          <div>您的订单已付款，请耐心等待发货</div>
        </div>
        <!-- <van-icon class="next_icon" name="arrow" /> -->
      </div>
      <!-- 待收货 -->
      <div v-if="orderInfo.orderStatus == 1 && orderInfo.shippingStatus == 1" class="confirm_tip">
        <img class="bus_icon" src="~assets/images/order/bus.png" />
        <div class="confirm_text">
          <div class="text_des">{{deliveryInfo || '等待收货'}}</div>
          <!-- <div class="time">22222</div> -->
        </div>
        <van-icon class="next_icon" name="arrow" />
      </div>
      <!-- 已完成 -->
      <div v-if="orderInfo.orderStatus == 5" class="confirm_tip">
        <img class="bus_icon" src="~assets/images/order/bus.png" />
        <div class="confirm_text">您的订单已签收，感谢您在本商城购物，欢迎您再次光临！</div>
        <!-- <van-icon class="next_icon" name="arrow" /> -->
      </div>
      <!-- 失效 -->
      <div v-if="orderInfo.orderStatus == 3" class="confirm_tip">
        <img class="bus_icon" src="~assets/images/order/bus.png" />
        <div class="confirm_text">您的订单已失效</div>
      </div>
      <div class="person_info">
        <img class="address_icon" src="~assets/images/order/address_icon.png" />
        <div>
          <div class="user_phone">
            <span class="user">{{orderInfo.consignee}}</span>
            <span class="phone">{{orderInfo.phone}}</span>
          </div>
          <div
            class="address_text"
          >{{orderInfo ? (orderInfo.provinceName + orderInfo.cityName + orderInfo.districtName + orderInfo.townName + orderInfo.address) : ""}}</div>
        </div>
      </div>
      <div class="goods_box">
        <div class="goods_title">
          <!-- <div>
            <img
                class="store_img"
                src="http://bsyimages.oss-cn-hangzhou.aliyuncs.com/images/201705/goods_img/88525_P_1493832168049.jpg"
            />
            <div class="store_name one-txt-cut">{{orderInfo.supplierName}}</div>
          </div>-->
          <div class="order_number">
            <span>订单号：</span>
            <span>{{orderInfo.orderSn}}</span>
          </div>
        </div>
        <div class="goods_list" :key="index" v-for="(item, index) in orderInfo.orderGoodsList">
          <div class="goods_detail">
            <img class="goods_icon" v-lazy="item.thumbnailImgUrl" />
            <div class="goods_right">
              <div>
                <div class="goods_des two-txt-cut">{{item.goodsName}}</div>
                <div class="goods_type">{{item.goodsAttr}}</div>
              </div>
              <div class="price">
                <div class="price_num">￥{{item.goodsPrice}}</div>
                <div class="goods_num">x{{item.quantity}}</div>
              </div>
            </div>
          </div>
          <div class="operation">
            <!-- 只有在状态完成之后且未通过售后才可以申请售后 -->
            <van-button
              size="small"
              round
              type="default"
              @click.stop="applyAftersale(orderInfo, item)"
              v-if="orderInfo.payStatus == 2 &&  orderInfo.shippingStatus != 0 && item.afterSaleStatus == 0"
            >申请售后</van-button>
          </div>
          <div class="sales_status">{{getSaleStatus(item.afterSaleStatus)}}</div>
        </div>
      </div>
      <div class="order_info">
        <div class="chunk">
          <div class="chunk_item">
            <span class="name">订单编号：</span>
            <span class="info">{{orderInfo.orderSn}}</span>
          </div>
          <div class="chunk_item">
            <span class="name">下单时间：</span>
            <span class="info">{{orderInfo.createTime}}</span>
          </div>
        </div>
        <van-divider />
        <div class="chunk">
          <div class="chunk_item">
            <span class="name">支付方式：</span>
            <span class="info">{{orderInfo.payName}}</span>
          </div>
          <div class="chunk_item">
            <span class="name">支付时间：</span>
            <span class="info">{{orderInfo.payTime}}</span>
          </div>
        </div>
        <!-- <van-divider />
        <div class="chunk">
          <div class="chunk_item">
            <span class="name">发票类型：</span>
            <span class="info">不开发票</span>
          </div>
          <div class="chunk_item">
            <span class="name">签收时间：</span>
            <span class="info">2019.10.31</span>
          </div>
        </div>-->
      </div>
      <div class="account">
        <div class="flex_box">
          <span class="name">商品总额</span>
          <span class="num">￥{{orderInfo.totalAmount}}</span>
        </div>
        <div class="flex_box">
          <span class="name">运费</span>
          <span class="num">+￥{{orderInfo.shippingFee}}</span>
        </div>
        <!-- <div class="flex_box">
          <span class="name">优惠券满减</span>
          <span class="num">-￥{{}}</span>
        </div>-->
        <div class="flex_box">
          <span class="name">积分</span>
          <span class="num">-￥{{orderInfo.integralAmount}}</span>
        </div>
        <div class="flex_box">
          <span class="name">实付金额</span>
          <span class="num">￥{{orderInfo.orderAmount}}</span>
        </div>
      </div>
    </div>
    <div class="footer_operation">
      <div>
        <!-- 只有未付款的和付过款没有进一步操作的不可以删除 -->
        <span
          v-if="orderInfo.orderStatus && orderInfo.orderStatus != 0 && orderInfo.orderStatus != 1 && orderInfo.orderStatus != 4"
          class="delete"
          @click.stop="deleteOrder()"
        >删除订单</span>
      </div>
      <div>
        <!-- 只有没有付款，且没取消过的订单才可以取消 -->
        <van-button
          size="small"
          v-if="orderInfo.orderStatus != 2 && orderInfo.payStatus == 0"
          round
          type="default"
          @click.stop="cancelOrder()"
        >取消订单</van-button>
        <!-- 未付款且没有取消的订单才可以付款 -->
        <van-button
          size="small"
          v-if="orderInfo.orderStatus != 2 && orderInfo.payStatus == 0"
          round
          type="default"
          @click.stop="payNow()"
        >立即付款</van-button>
        <!-- 付过钱但是没有完全发货的才需要提醒发货 -->
        <van-button
          v-if="orderInfo.payStatus == 2 && (orderInfo.shippingStatus == 0 || orderInfo.shippingStatus == 4) && orderInfo.orderStatus == 1"
          size="small"
          round
          type="default"
          @click.stop="alertGoods()"
        >提醒发货</van-button>
        <!-- 只有发货之后且付款之后且没有售后的才可以查看物流 -->
        <van-button
          v-if="orderInfo.orderStatus != 2 && orderInfo.shippingStatus && orderInfo.shippingStatus != 0"
          size="small"
          round
          type="default"
          @click.stop="checkDelivery()"
        >查看物流</van-button>
        <!-- 只有已经付款后且发货的才可以确认收货 -->
        <van-button
          v-if="orderInfo.orderStatus == 1 && orderInfo.shippingStatus == 1"
          size="small"
          round
          type="default"
          @click.stop="confirmGoods()"
        >确认收货</van-button>
        <!-- <van-button v-if="orderInfo.orderStatus == 5" size="small" round type="default">申请开票</van-button> -->
        <!-- 已完成确认收货 -->
        <!-- <van-button
          v-if="(orderInfo.orderStatus == 5 || orderInfo.orderStatus == 4)"
          size="small"
          round
          type="default"
          @click="setComments()"
        >评价晒单</van-button>-->
        <!-- 已取消订单时且付过钱时的退款明细 -->
        <!-- <van-button
          v-if="orderInfo.orderStatus == 2 && orderInfo.payStatus == 2"
          size="small"
          round
          type="default"
        >退款明细</van-button>-->
        <!-- 只有付款之后的流程才会出现再次购买按钮 -->
        <van-button
          v-if="orderInfo.orderStatus && orderInfo.orderStatus != 0"
          size="small"
          round
          type="default"
          @click.stop="buyAgain()"
        >再次购买</van-button>
      </div>
    </div>
    <div v-html="html" v-show="false">{{html}}</div>
    <cancelorder
      v-model="orderCancel"
      :order="orderInfo"
      @reload="getOrderDetail"
      @close="value => orderCancel = value"
    />
    <returnPay
      v-model="orderReturn"
      :order="orderInfo"
      @reload="getOrderDetail"
      @close="value => orderReturn = value"
    />
    <!-- 回到顶部组件 -->
    <back-top />
  </div>
</template>

<script>
/**
 * 订单详情页面
 * shippingStatus 0-未发货；1-已发货；2-已收货；4-部分发货
 * payStatus  0-未付款；1-付款中；2-已付款
 * orderStatus 0-未确认订单（付款之前）；1-已确认订单（付款之后，下个任意操作之前）；2-已取消；3-无效；4-售后；5-已完成,待评价；6-断货；7-删除
 * afterSaleStatus 是否申请售后(0-未申请；1-待处理；2-处理中；3-售后完成)
 */
// 取消订单弹窗
import cancelorder from "@/views/personal/order/content/cancelorder.vue";
// 退款弹窗
import returnPay from "@/views/personal/order/content/returnpay.vue";
// 确认弹窗
import { Dialog, Toast } from "vant";
// 接口
import {
  orderDetail,
  orderOperation,
  alertDeliver,
  payMoney,
  zeroPay,
  accountPayInfo,
  orderDelivery
} from "@/configs/interface.js";
import { addShopCart } from "@/configs/common.js";
import { myStorage } from "@/utils/cache.js";
export default {
  name: "orderdetail",
  data() {
    return {
      // 当前订单的详情
      orderInfo: {},
      // 是否取消订单弹窗
      orderCancel: false,
      // 支付宝的html
      html: "",
      // 退款弹窗是否打开
      orderReturn: false,
      // 当前的积分使用信息
      currentExchange: null,
      // 支付倒计时
      time: 0,
      // 最新的包裹物流信息
      deliveryInfo: ""
    };
  },
  components: {
    cancelorder,
    returnPay
  },
  created() {
    this.getOrderDetail();
    this.getDeliveryList();
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
          this.time = data.leftTime * 1000;
          this.getAccoutUse(data.accountInfoId);
        }
      });
    },
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
          let data = res.data || [];
          const currentDelivery = data[0] && data[0].logistics;
          if (currentDelivery && currentDelivery.logisticsInfos.length == 0) {
            this.deliveryInfo = currentDelivery;
          } else if (
            currentDelivery &&
            currentDelivery.logisticsInfos.length > 0
          ) {
            this.deliveryInfo = currentDelivery.logisticsInfos[0]
              ? currentDelivery.logisticsInfos[0].context
              : "";
          }
        }
      });
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
          const exchangeList = data.filter(item => {
            return item.accountType == 0;
          });
          exchangeList.map(item => {
            if (accountInfoId === item.id) {
              this.currentExchange = item;
            }
          });
          // 专属费用列表
          // const costList = data.filter(item => {
          //   return item.accountType === 1;
          // });
        }
      });
    },
    // 删除订单
    deleteOrder() {
      Dialog.confirm({
        title: "",
        message: "您是否确认删除商品"
      }).then(() => {
        // on confirm
        let data = {
          // 下标：1-取消订单；2-删除订单；3-确认收货
          index: 2,
          // 订单id
          orderId: this.orderInfo.orderId,
          // 订单状态：2-取消订单；7-删除订单；5-确认收货
          orderStatus: 7
        };
        this.$http({
          method: "get",
          url: orderOperation,
          data: data
        }).then(res => {
          if (res.code === 200) {
            Toast("删除订单成功");
            this.$router.push({
              name: "orderManage"
            });
          }
        });
      });
    },
    // 取消订单弹窗
    cancelOrder() {
      this.orderCancel = true;
    },
    // 立即支付
    payNow() {
      if (this.orderInfo.orderAmount == 0) {
        this.zeroPayMoney(this.orderInfo);
      } else {
        this.fastPay(this.orderInfo);
      }
    },
    // 0元支付
    zeroPayMoney(info) {
      this.$http({
        method: "get",
        url: zeroPay,
        data: {
          orderNo: info.orderSn, // 分单后的子单号
          serverName: encodeURI(location.origin + process.env.BASE_URL)
        }
      }).then(res => {
        if (res.code == 200) {
          this.$router.push({
            name: "payResult",
            query: {
              payId: "other"
            }
          });
        }
      });
    },
    // 微信/支付宝支付
    fastPay(info) {
      this.$http({
        method: "get",
        url: payMoney,
        data: {
          orderNo: info.orderSn // 分单后的子单号
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          if (info.payCode == "wxpay_mweb") {
            window.location.href = data.wapUrl;
          } else if (info.payCode == "alipay_wap") {
            this.html = data.wapUrl;
            this.$nextTick(() => {
              document.forms[0].submit();
            });
          }
        }
      });
    },
    // 提醒发货
    alertGoods() {
      this.$http({
        method: "get",
        url: alertDeliver,
        data: {
          orderId: this.orderInfo.orderId
        }
      }).then(res => {
        if (res.code === 200) {
          Toast("提醒发货成功");
        }
      });
    },
    // 确认收货
    confirmGoods() {
      Dialog.confirm({
        title: "",
        message: "您是否已经收到商品"
      })
        .then(() => {
          // on confirm
          let data = {
            // 下标：1-取消订单；2-删除订单；3-确认收货
            index: 3,
            // 订单id
            orderId: this.orderInfo.orderId,
            // 订单状态：2-取消订单；7-删除订单；5-确认收货
            orderStatus: 5
          };
          this.$http({
            method: "get",
            url: orderOperation,
            data: data
          }).then(res => {
            if (res.code === 200) {
              Toast("确认收货成功");
              this.getOrderDetail();
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 再次购买(循环添加)
    buyAgain() {
      // 清空多地址的缓存
      this.$store.commit("common/setMutipleAddress", undefined);
      const orderInfo = this.orderInfo;
      orderInfo.orderGoodsList &&
        orderInfo.orderGoodsList.map((sub, num) => {
          // 请求购物车接口
          addShopCart({
            goodsId: sub.goodsId,
            goodsName: sub.goodsName,
            goodsPrice: sub.goodsPrice,
            goodsSn: sub.goodsSn,
            quantity: sub.quantity,
            skuId: sub.skuId,
            supplierId: orderInfo.supplierId
          }).then(res => {
            // 当到最后一个的时候跳转到购物车
            if (
              res.code === 200 &&
              num == orderInfo.orderGoodsList.length - 1
            ) {
              this.$router.push({
                name: "cart"
              });
            }
          });
        });
    },
    // 申请售后
    applyAftersale(val, data) {
      this.$router.push({
        name: "aftersaletype",
        query: {
          orderSn: val.orderSn, //分单后的子订单号
          skuId: data.skuId //商品skuId
        }
      });
    },
    // 评价晒单
    setComments() {
      if (
        !this.orderInfo.orderGoodsList ||
        this.orderInfo.orderGoodsList.length === 0
      ) {
        Toast("商品已评价");
        this.$router.push({
          name: "orderManage"
        });
        return;
      }
      // 如果多个商品，则跳到评论列表，否则跳到评论页面
      if (this.orderInfo.orderGoodsList.length > 1) {
        this.$router.push({
          name: "commentsList",
          query: {
            orderId: this.orderInfo.orderId
          }
        });
      } else if (this.orderInfo.orderGoodsList.length == 1) {
        let goods = this.orderInfo.orderGoodsList[0];
        // 看是否评论过，没有评论则评论，评论过则追评
        if (goods.commentId && goods.hadComment == 1) {
          this.$router.push({
            name: "commentEdit",
            query: {
              orderId: goods.orderId,
              goodsId: goods.goodsId,
              skuId: goods.skuId,
              commentId: goods.commentId
            }
          });
        } else if (!goods.hadComment) {
          this.$router.push({
            name: "commentEdit",
            query: {
              orderId: goods.orderId,
              goodsId: goods.goodsId,
              skuId: goods.skuId
            }
          });
        }
      }
    },
    // 查看物流, 判断订单有几个包裹，多个跳列表，一个跳详情
    checkDelivery() {
      this.$http({
        method: "get",
        url: orderDelivery,
        data: {
          orderId: this.orderInfo.orderId
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          if (!data || data.length === 0) {
            Toast("暂无物流信息");
            return;
          }
          if (data.length == 1) {
            this.$router.push({
              name: "deliveryDetail",
              query: {
                deliveryId: data[0].deliveryId
              }
            });
          } else if (data.length > 1) {
            this.$router.push({
              name: "deliveryList",
              query: {
                orderId: this.orderInfo.orderId
              }
            });
          }
        }
      });
    },
    getSaleStatus(value) {
      let msg = "";
      switch (value) {
        case 1:
          msg = "已申请售后";
          break;
        case 2:
          msg = "售后处理中";
          break;
        case 3:
          msg = "售后完成";
          break;
        default:
          break;
      }
      return msg;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-orderend {
  height: 100%;
  background-color: $lightColor;
  height: 100vh;
  overflow: auto;
  padding-bottom: 50px;
  .orderend_header {
    width: 100%;
    height: 150px;
    background: url("~assets/images/order/order_end.png") no-repeat;
    background-size: contain;
    .header_nav {
      width: 100%;
      display: flex;
      color: #fff;
      height: 60px;
      align-items: center;
      font-size: 17px;
      padding: 0 15px;
      .right_icon {
        width: 15px;
        height: 15px;
      }
    }
    .complete {
      margin-top: -35px;
      display: flex;
      align-items: center;
      flex-direction: column;
      .complete_img {
        width: 40px;
        height: 40px;
      }
      .complete_text {
        color: #fff;
        text-align: center;
        margin-top: 5px;
      }
    }
  }
  .orderend_content {
    margin-top: -50px;
    padding: 0 10px;
    padding-bottom: 60px;
  }
  .confirm_tip {
    display: flex;
    align-items: center;
    background: #fff;
    width: 100%;
    height: 68px;
    border-radius: 6px;
    padding: 0 12px;
    .bus_icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    .confirm_text {
      flex: 1;
      word-break: break-all;
      margin-right: 24px;
      line-height: 21px;
      font-weight: 500;
      .text_des {
        color: #454545;
        font-size: 13px;
      }
      .time {
        color: #666;
        font-size: 11px;
      }
    }
    .next_icon {
      font-size: 16px;
      color: #333;
    }
  }
  .wait_pay {
    background: #fff;
    width: 100%;
    border-radius: 6px;
    padding: 12px;
    text-align: center;
    .wait_info {
      display: flex;
      align-items: center;
      justify-content: center;
      .pay_num {
        font-size: 16px;
        margin-right: 20px;
      }
      .van-count-down {
        font-size: 20px;
      }
    }
    .van-button.van-button--primary {
      width: 150px;
      margin-top: 15px;
    }
  }
  .person_info {
    margin-top: 10px;
    width: 100%;
    height: 68px;
    display: flex;
    align-items: center;
    line-height: 21px;
    background: #fff;
    padding: 0 12px;
    border-radius: 6px;
    .address_icon {
      width: 21px;
      height: 21px;
      margin-right: 10px;
    }
    .user_phone {
      font-size: 13px;
      .user {
        color: #454545;
        margin-right: 15px;
      }
      .phone {
        color: #999;
      }
    }
    .address_text {
      color: #333;
      font-size: 13px;
    }
  }
  .goods_box {
    margin-top: 13px;
    background: #fff;
    padding: 10px;
  }
  .goods_detail {
    display: flex;
    align-items: center;
    .goods_icon {
      width: 70px;
      height: 70px;
      margin-right: 12px;
    }
    .goods_right {
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
        font-size: 14px;
        line-height: 21px;
        word-break: break-all;
        font-weight: 500px;
      }
      .goods_type {
        color: #999;
      }
    }
    .price {
      margin-left: 35px;
      font-size: 14px;
      line-height: 21px;
      .price_num {
        color: #454545;
      }
      .goods_num {
        color: #999;
        text-align: right;
      }
    }
  }
  .goods_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    padding: 0 5px;
    .store_img {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
    .store_name {
      font-size: 14px;
      color: #454545;
      width: 150px;
    }
    .order_number {
      font-size: 14px;
      color: #999;
    }
  }
  .operation {
    margin-top: 20px;
    text-align: right;
    // 空心灰色按钮样式
    .van-button--default {
      width: 80px;
      background: #fff;
      border: 1px solid #999;
      color: #454545;
    }
  }
  .goods_list {
    margin-top: 20px;
    .sales_status {
      color: #ccc;
    }
  }
  .order_info {
    margin-top: 13px;
    background: #fff;
    .van-divider {
      margin: 0;
    }
    .chunk {
      padding: 10px 0;
      .chunk_item {
        padding: 10px 12px;
        font-size: 13px;
        .name {
          color: #666;
        }
        .info {
          color: 454545;
          font-weight: 500;
        }
      }
    }
  }
  .account {
    background: #fff;
    margin-top: 12px;
    padding: 10px;
    .flex_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      .name {
        color: #666;
        font-size: 13px;
      }
      .num {
        font-size: 14px;
        color: #454545;
      }
    }
  }
  .footer_operation {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    position: fixed;
    bottom: 10px;
    left: 0;
    background: #fff;
    .delete {
      color: #454545;
      font-size: 13px;
    }
    // 空心灰色按钮样式
    .van-button--default {
      width: 80px;
      background: #fff;
      border: 1px solid #999;
      color: #454545;
      margin-right: 10px;
    }
    // 最后一个按钮设置红边框+红字
    .van-button:last-of-type {
      width: 80px;
      background: #fff;
      border: 1px solid #ff3849;
      color: #ff3849;
    }
  }
}
</style>