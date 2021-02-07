<template>
  <div class="v-personal-searchcontent">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="isUpLoading" :finished="upFinished" finished-text="没有更多了" @load="onLoad">
        <div
          class="goods_item"
          :key="index"
          v-for="(item, index) in orderList"
          @click="checkDetail(item)"
        >
          <div class="goods_title">
            <!-- <div>
              <img
                class="store_img"
                src="http://bsyimages.oss-cn-hangzhou.aliyuncs.com/images/201705/goods_img/88525_P_1493832168049.jpg"
              />
              <div class="store_name one-txt-cut">{{item.supplierName}}</div>
            </div>-->
            <div class="order_number">
              <span>
                <span>订单号：</span>
                <span>{{item.orderSn}}</span>
              </span>
              <van-button
                size="small"
                round
                type="default"
                @click.stop="applyAftersale(item)"
                v-if="item.payStatus == 2 &&  item.shippingStatus != 0 && item.afterSaleStatus == 0"
              >批量售后</van-button>
            </div>
          </div>
          <div :key="sub.skuId" v-for="(sub) in item.orderGoodsList">
            <div class="goods_detail">
              <img class="detail_img" :src="sub.thumbnailImgUrl" />
              <div class="detail_right">
                <div>
                  <div class="goods_des">{{sub.goodsName}}</div>
                  <div class="type_des">{{sub.goodsAttr}}</div>
                </div>
                <div class="price">
                  <div class="price_num">￥{{sub.specialPrice}}</div>
                  <div class="goods_num">x{{sub.quantity}}</div>
                </div>
              </div>
            </div>
            <div class="after_sales">
              <span class="sales_status">{{sub.afterSaleStatus != 0 ? getSaleStatus(sub.afterSaleStatus) : ""}}</span>
              <!-- 付款之后和发货之后申请售后 -->
              <van-button
                size="small"
                round
                type="default"
                @click.stop="applyAftersale(item, sub)"
                v-if="item.payStatus == 2 &&  item.shippingStatus != 0 && sub.afterSaleStatus == 0"
              >申请售后</van-button>
            </div>
          </div>
          <div class="count">
            <div class="create_date">{{item.createTime}}</div>
            <div>
              <span class="count_des">共计 {{item.goodsNumber}} 件商品，合计:</span>
              <span class="count_num">￥{{item.orderAmount}}</span>
            </div>
          </div>
          <div class="operation_btn">
            <span class="status">{{item.statusMsg}}</span>
            <div>
              <!-- <van-button size="small" round type="default">修改地址</van-button> -->
              <!-- 只有没有付款，且没取消过的订单才可以取消 -->
              <van-button
                size="small"
                v-if="item.orderStatus != 2 && item.payStatus == 0"
                round
                type="default"
                @click.stop="cancelOrder(item)"
              >取消订单</van-button>
              <!-- 未付款且没有取消的订单才可以付款 -->
              <van-button
                size="small"
                v-if="item.orderStatus != 2 && item.payStatus == 0"
                round
                type="default"
                @click.stop="payNow(item)"
              >立即付款</van-button>
              <!-- 付过钱但是没有完全发货的才需要提醒发货 -->
              <van-button
                v-if="item.payStatus == 2 && (item.shippingStatus == 0 || item.shippingStatus == 4) && item.orderStatus == 1"
                size="small"
                round
                type="default"
                @click.stop="alertGoods(item)"
              >提醒发货</van-button>
              <!-- 只有发货之后且付款之后并且没有售后才可以查看物流 -->
              <van-button
                v-if="item.orderStatus != 2 && item.shippingStatus && item.shippingStatus != 0"
                size="small"
                round
                type="default"
                @click.stop="checkDelivery(item)"
              >查看物流</van-button>
              <!-- 只有已经付款后且发货的才可以确认收货 -->
              <van-button
                v-if="item.orderStatus == 1 && item.shippingStatus == 1"
                size="small"
                round
                type="default"
                @click.stop="confirmGoods(item)"
              >确认收货</van-button>
              <!-- <van-button v-if="(item.orderStatus == 5 || item.orderStatus == 4)" size="small" round type="default">申请开票</van-button> -->
              <!-- 已完成确认收货 -->
              <!-- <van-button v-if="(item.orderStatus == 5 || item.orderStatus == 4)" size="small" round type="default">评价晒单</van-button> -->
              <!-- 付款之后发货之前且已确认的订单可以申请退款 -->
              <van-button
                v-if="item.shippingStatus == 0 && item.payStatus == 2 && item.orderStatus == 1"
                size="small"
                round
                type="default"
                @click.stop="onlyReturnPay(item)"
              >退款</van-button>
              <!-- 已取消订单时且付过钱时的退款明细 -->
              <!-- <van-button
                v-if="item.orderStatus == 2 && item.payStatus == 2"
                size="small"
                round
                type="default"
                @click="returnPayInfo(item)"
              >退款明细</van-button>-->
              <!-- 只有未付款的和付过款没有进一步操作的不可以删除 -->
              <van-button
                v-if="item.orderStatus && item.orderStatus != 0 && item.orderStatus != 1 && item.orderStatus != 4"
                size="small"
                round
                type="default"
                @click.stop="deleteOrder(item)"
              >删除订单</van-button>
              <!-- 只有付款之后才会出现再次购买按钮 -->
              <van-button
                v-if="item.orderStatus && item.orderStatus != 0"
                size="small"
                round
                type="default"
                @click.stop="buyAgain(item)"
              >再次购买</van-button>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <div v-html="html" v-show="false">{{html}}</div>
    <cancelorder
      v-model="orderCancel"
      :order="currentOrder"
      @reload="refreshTab"
      @close="value => orderCancel = value"
    />
    <returnPay
      v-model="orderReturn"
      :order="returnPayOrder"
      @reload="refreshTab"
      @close="value => orderReturn = value"
    />
    <!-- 回到顶部组件 -->
    <back-top />
  </div>
</template>

<script>
/**
 * 搜索订单的内容
 * 返回值的含义：
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
  orderManageList,
  orderOperation,
  alertDeliver,
  payMoney,
  zeroPay,
  orderDelivery,
  returnMoney
} from "@/configs/interface.js";
import { addShopCart } from "@/configs/common.js";
export default {
  name: "searchcontent",
  data() {
    return {
      // 当前tab栏
      currentActive: this.current,
      // 当前点击的取消订单信息
      currentOrder: null,
      // 订单列表
      orderList: [],
      // 是否取消订单弹窗
      orderCancel: false,
      // 当前点击退款的订单信息
      returnPayOrder: null,
      // 是否展示退款弹窗
      orderReturn: false,
      // 支付宝的html
      html: "",
      isLoading: false, // 下拉刷新
      isUpLoading: false, // 上拉加载
      upFinished: false, //上拉加载完毕
      pageIndex: 1, // 加载的哪一页
      pageSize: 10 // 每页加载多少条数据
    };
  },
  props: {
    // 当前激活的tab选项
    current: {
      default: 0
    },
    // 搜索关键词
    keyWordValue: {
      default: false
    }
  },
  watch: {
    // 监听传过来的current
    current(newValue) {
      this.currentActive = newValue;
    }
  },
  created() {},
  components: {
    cancelorder,
    returnPay
  },
  methods: {
    // 下拉调用此函数
    onRefresh() {
      window.setTimeout(() => {
        this.isLoading = true;
        this.refreshTab();
      }, 1000);
    },
    // 上拉调用此函数
    onLoad() {
      window.setTimeout(() => {
        this.upload();
      }, 1000);
    },
    // 刷新订单列表
    refreshTab() {
      this.pageIndex = 1;
      this.pageSize = 10;
      // 判断是不是搜索页面，传入不同的公共参数
      let data = {};
      if (this.keyWordValue) {
        data = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          requestStatus: this.currentActive,
          // 下面两个参数表示搜索条件下生效的
          keyWordType: 1,
          keyWordValue: this.keyWordValue
        };
      } else {
        data = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          requestStatus: this.currentActive
        };
      }
      this.$http({
        method: "post",
        url: orderManageList,
        data: data
      }).then(res => {
        this.isLoading = false;
        if (res.code == 200) {
          let data = res.data || {};
          this.orderList = data.pageList;
        }
      });
    },
    // 上拉调用函数
    upload() {
      this.isUpLoading = true;
      this.upFinished = false;
      // 判断是不是搜索页面，传入不同的公共参数
      let data = {};
      if (this.keyWordValue) {
        data = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          requestStatus: this.currentActive,
          // 下面两个参数表示搜索条件下生效的
          keyWordType: 1,
          keyWordValue: this.keyWordValue
        };
      } else {
        data = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          requestStatus: this.currentActive
        };
      }
      this.$http({
        method: "post",
        url: orderManageList,
        data: data
      }).then(res => {
        this.isUpLoading = false;
        this.isLoading = false;
        if (res.code == 200) {
          let data = res.data || {};
          // 累加数据
          this.orderList = this.orderList.concat(data.pageList);
          this.pageIndex = this.pageIndex + 1;
          if (data.pageList.length < 10) {
            this.upFinished = true;
          }
        }
      });
    },
    // 查看商品详情
    checkDetail(item) {
      this.$router.push({
        name: "orderDetail",
        query: {
          orderId: item.orderId
        }
      });
    },
    // 申请售后
    applyAftersale(val, data) {
      this.$router.push({
        name: "aftersaletype",
        query: {
          orderSn: val.orderSn, // 分单后的子订单号
          skuId: data && data.skuId || '' // 商品skuId
        }
      });
    },
    // 取消订单弹窗
    cancelOrder(item) {
      this.currentOrder = item;
      this.orderCancel = true;
    },
    // 立即支付
    payNow(item) {
      if (item.orderAmount == 0) {
        this.zeroPayMoney(item);
      } else {
        this.fastPay(item);
      }
    },
    // 0元支付
    zeroPayMoney(item) {
      this.$http({
        method: "get",
        url: zeroPay,
        data: {
          orderNo: item.orderSn // 分单后的子单号
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
    fastPay(item) {
      this.$http({
        method: "get",
        url: payMoney,
        data: {
          orderNo: item.orderSn, // 分单后的子单号
          serverName: encodeURI(location.origin + process.env.BASE_URL)
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          if (item.payCode == "wxpay_mweb") {
            window.location.href = data.wapUrl;
          } else if (item.payCode == "alipay_wap") {
            this.html = data.wapUrl;
            this.$nextTick(() => {
              document.forms[0].submit();
            });
          }
        }
      });
    },
    // 提醒发货
    alertGoods(item) {
      this.$http({
        method: "get",
        url: alertDeliver,
        data: {
          orderId: item.orderId
        }
      }).then(res => {
        if (res.code === 200) {
          Toast("提醒发货成功");
        }
      });
    },
    // 确认收货
    confirmGoods(item) {
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
            orderId: item.orderId,
            // 订单状态：2-取消订单；7-删除订单；5-确认收货
            orderStatus: 5
          };
          this.$http({
            method: "get",
            url: orderOperation,
            data: data
          }).then(res => {
            if (res.code === 200) {
              this.checkDetail(item);
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 删除订单
    deleteOrder(item) {
      Dialog.confirm({
        title: "",
        message: "您是否确认删除商品"
      }).then(() => {
        // on confirm
        let data = {
          // 下标：1-取消订单；2-删除订单；3-确认收货
          index: 2,
          // 订单id
          orderId: item.orderId,
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
            this.refreshTab();
          }
        });
      });
    },
    // 再次购买(循环添加)
    buyAgain(item) {
      // 清空多地址的缓存
      this.$store.commit("common/setMutipleAddress", undefined);
      item.orderGoodsList &&
        item.orderGoodsList.map((sub, num) => {
          // 请求购物车接口
          addShopCart({
            goodsId: sub.goodsId,
            goodsName: sub.goodsName,
            goodsPrice: sub.goodsPrice,
            goodsSn: sub.goodsSn,
            quantity: sub.quantity,
            skuId: sub.skuId,
            supplierId: item.supplierId
          }).then(res => {
            // 当到最后一个的时候跳转到购物车
            if (res.code === 200 && num == item.orderGoodsList.length - 1) {
              this.$router.push({
                name: "cart"
              });
            }
          });
        });
    },
    // 退款明细
    returnPayInfo(item) {},
    // 查看物流, 判断订单有几个包裹，多个跳列表，一个跳详情
    checkDelivery(item) {
      this.$http({
        method: "get",
        url: orderDelivery,
        data: {
          orderId: item.orderId
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
                orderId: item.orderId
              }
            });
          }
        }
      });
    },
    // 付款之后发货之前退款的弹窗
    onlyReturnPay(item) {
      this.returnPayOrder = item;
      this.orderReturn = true;
    },
    // 已完成或待评价下如果申请售后返回状态文字
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
.v-personal-searchcontent {
  background: $lightColor;
  height: calc(100vh - 110px);
  overflow: auto;
  padding-bottom: 60px;
  // 商品列表
  .goods_item {
    padding: 8px;
    background: #fff;
    .goods_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
      padding: 0 5px;
      position: relative;
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
        height: 30px;
        .van-button--default{
          position: absolute;
          right:0;
        }
      }
    }
    .goods_detail {
      margin-top: 20px;
      display: flex;
      align-items: center;
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
        .goods_des {
          color: #454545;
          line-height: 20px;
        }
        .type_des {
          color: #999;
        }
        .price {
          margin-left: 34px;
        }
        .price_num {
          font-size: 16px;
          color: #454545;
        }
        .goods_num {
          text-align: right;
          color: #999;
        }
      }
    }
    .after_sales {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      .sales_status{
        color: #ccc;
      }
      // 空心灰色按钮样式
      .van-button--default {
        width: 80px;
        background: #fff;
        border: 1px solid #999;
        color: #454545;
      }
    }
    .count {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 25px;
      .create_date {
        color: #b3b3b3;
      }
      .count_des {
        color: #666;
      }
      .count_num {
        color: #ff3849;
        font-size: 16px;
      }
    }
    .operation_btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 25px;
      .status {
        color: #b3b3b3;
        font-size: 13px;
        white-space: nowrap;
      }
      // 空心灰色按钮样式
      .van-button--default {
        width: 80px;
        background: #fff;
        border: 1px solid #999;
        color: #454545;
      }
      // 实心按钮颜色样式
      .van-button--primary {
        width: 80px;
      }
      .van-button {
        margin-left: 11px;
        margin-bottom: 10px;
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
  .goods_item:nth-of-type(n + 2) {
    margin-top: 10px;
  }
}
.v-personal-ordertab:nth-of-type(n + 2) {
  margin-top: 10px;
}
</style>