<template>
  <div class="v-order-content-single">
    <!-- 绑定的地址 -->
    <div v-if="addressData && $route.query.isBindAddress != '1'" class="address_area">
      <img class="area_img" src="~assets/images/order/choose_area.png" />
      <div class="area_right" @click="chooseAddress">
        <div>
          <div class="user_phone">
            <span class="user">{{addressData && addressData.consignee}}</span>
            <span class="phone">{{addressData && addressData.phone}}</span>
          </div>
          <div
            class="address_text two-txt-cut"
          >{{addressData ? (addressData.provinceName + addressData.cityName + addressData.districtName + addressData.address) : ""}}</div>
          <div class="operation">
            <span @click.stop="setDefault">{{addressData.def ? '默认' : '设为默认地址'}}</span>
            <span class="operation_line">丨</span>
            <span @click.stop="editAddress">编辑</span>
          </div>
        </div>
        <van-icon class="icon_right" name="arrow" />
      </div>
    </div>
    <!-- 团购活动绑定的地址 -->
    <div v-if="$route.query.isBindAddress == '1'" class="address_area">
      <img class="area_img" src="~assets/images/order/choose_area.png" />
      <div class="area_right">
        <div>
          <div class="user_phone">
            <span class="user">{{bindAddress && bindAddress.consignee}}</span>
            <span class="phone">{{bindAddress && bindAddress.phone}}</span>
          </div>
          <div
            class="address_text two-txt-cut"
          >{{bindAddress ? (bindAddress.provinceName + bindAddress.cityName + bindAddress.districtName + bindAddress.address) : ""}}</div>
        </div>
      </div>
    </div>
    <div v-if="!addressData" class="add_address" @click="addAddress">添加新地址</div>
    <div class="goods">
      <goods ref="child" :key="index" v-for="(item, index) in allgoods" :data="item" />
    </div>
    <van-cell-group class="modal_box">
      <van-cell is-link @click="showPopup('pay')">
        <template v-slot:title>
          <div class="cell_box">
            <img class="cell_img" src="~assets/images/order/pay.png" />
            <span class="cell_title">支付方式</span>
          </div>
        </template>
        <template v-slot:default>
          <span>{{canMoney() ? (currentPay.payType || '请选择') : "不支持"}}</span>
        </template>
      </van-cell>
      <van-cell is-link @click="showPopup('exchange')">
        <template v-slot:title>
          <div class="cell_box">
            <img class="cell_img" src="~assets/images/order/exchange.png" />
            <span class="cell_title">积分兑换</span>
          </div>
        </template>
        <template v-slot:default>
          <span>{{canIntegral() ? (currentExchange.accountName || "请选择") : "无积分使用"}}</span>
        </template>
      </van-cell>
      <!-- <van-cell is-link @click="showPopup('coupons')">
        <template v-slot:title>
          <div class="cell_box">
            <img class="cell_img" src="~assets/images/order/coupons.png" />
            <span class="cell_title">优惠券</span>
          </div>
        </template>
        <template v-slot:default>
          <span>请选择</span>
        </template>
      </van-cell>-->
      <!-- <van-cell is-link @click="showPopup('redpacket')">
        <template v-slot:title>
          <div class="cell_box">
            <img class="cell_img" src="~assets/images/order/redpacket.png" />
            <span class="cell_title">红包使用</span>
          </div>
        </template>
        <template v-slot:default>
          <span>请选择</span>
        </template>
      </van-cell>-->
    </van-cell-group>
    <div class="footer_operation">
      <div>运费：￥{{orderInfo.shippingFee}}</div>
      <div>
        <span>{{choosegoods.allNum > 100 ? '99+' : (choosegoods.allNum || 0)}}件商品，合计：</span>
        <span class="price_sum">￥{{orderInfo.orderAmount}}</span>
        <van-button round size="small" type="primary" @click="submitOrder">提交订单</van-button>
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
 * 单地址
 */
// 引入需要提交的商品列表
import goods from "@/views/order/content/single/goods.vue";
// 引入支付方式弹窗
import pay from "@/views/order/modal/pay.vue";
// 引入积分兑换弹窗
import exchange from "@/views/order/modal/exchange.vue";
// 引入优惠券弹窗
import coupons from "@/views/order/modal/coupons.vue";
// 引入红包使用弹窗
import redpacket from "@/views/order/modal/redpacket.vue";

// 接口
import {
  findAddressByGroupId,
  orderList,
  submitOrderList,
  addressList,
  setDefaultAddress,
  buyNowOrder,
  accountPayInfo,
  findaccountbyactivity
} from "@/configs/interface.js";
import { Toast, Dialog } from "vant";
import { myStorage } from "@/utils/cache.js";
export default {
  name: "single",
  data() {
    return {
      // 绑定的地址
      bindAddress: {},
      // 使用的积分
      integral: 0,
      // 当前订单的收货地址
      addressData: null,
      // 订单信息
      orderInfo: {},
      // 商品列表
      goodslist: [],
      // 支付列表
      payList: [],
      // 积分列表
      exchangeList: [],
      // 专属费用列表
      costList: [],
      // 是否展示支付弹窗
      showPay: false,
      // 当前选择的支付方式（对象）
      currentPay: {
        payCode: "wxpay_mweb",
        payId: 3,
        payName: "微信H5支付",
        payType: "微信"
      },
      // 是否展示积分兑换弹窗
      showExchange: false,
      // 是否展示优惠券弹窗
      showCoupons: false,
      // 是否展示红包弹窗
      showRedpacket: false,
      // 当前选择的积分兑换
      currentExchange: "",
      // 当前选择的优惠券
      currentCoupons: "",
      // 当前选择的红包
      currentRedpacket: "",
      activityId: "", //活动id
      payWay: "" //0.纯现金支付   1.积分支付   2.积分+现金支付(只有活动商品才做判断,普通商品又是另外一种判断逻辑)
    };
  },
  props: {
    // 待提交订单的信息
    data: {
      default: {}
    }
  },
  watch: {
    // 待提交所有订单的所有信息
    data: {
      handler(newValue) {
        if (newValue) {
          let data = JSON.parse(JSON.stringify(newValue));
          this.orderInfo = data;
          this.goodslist = data.goodsParams || [];
          this.payList = data.payment;
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // 获取当前地址
    let singleAddress = this.$store.state.common.singleAddress;
    if (singleAddress) {
      this.addressData = singleAddress;
    } else {
      this.getAddress();
    }
    // 如果有活动则查询活动所需要的一些账号支付的信息
    if (this.$route.query.activityId) {
      this.activityId = this.$route.query.activityId;
      this.findaccountbyactivity();
    } else {
      // 查询普通商品账户支付的一些信息（专属费用，积分兑换等等）accountType为0表示积分列表， 为1表示专属费用列表
      this.getAccoutUse();
    }
    // 去拼别人的团时，查询发起人的地址，团购的所有商品都将是这个地址
    if (this.$route.query.isBindAddress == "1") {
      this.getAddressByGroupId();
    }
  },
  components: {
    goods,
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
    // 去拼别人的团时，查询发起人的地址，团购的所有商品都将是这个地址
    getAddressByGroupId() {
      this.$http({
        method: "GET",
        url: findAddressByGroupId,
        data: {
          groupId: this.$store.state.common.buyNowData.groupId
        }
      }).then(res => {
        if (res.code === 200) {
          this.bindAddress = res.data || {};
        }
      });
    },
    //获取活动可选的支付方式(活动商品)
    findaccountbyactivity() {
      this.$http({
        method: "GET",
        url: findaccountbyactivity,
        data: {
          activityId: this.activityId
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data || {};
          const list = data.accountInfoReturnVos || [];
          // 积分兑换列表
          this.exchangeList = list.filter(item => {
            return item.accountType == 0;
          });
          // 专属费用列表
          this.costList = list.filter(item => {
            return item.accountType == 1;
          });
          this.payWay = data.payWay;
        }
      });
    },
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
    // 是否可以使用现金，true可以使用,活动商品根据payWay，普通商品一定可以
    canMoney() {
      if (this.$route.query.activityId) {
        if (this.payWay == 1) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    // 是否可以使用积分,true表示可以使用，活动商品根据payWay, 普通商品根据返回exchangeList
    canIntegral() {
      if (this.$route.query.activityId) {
        if (this.payWay == 0) {
          return false;
        } else {
          if (this.exchangeList && this.exchangeList.length > 0) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        if (this.exchangeList && this.exchangeList.length > 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    // 展示各个弹窗
    showPopup(val) {
      switch (val) {
        case "pay":
          if (this.canMoney()) {
            this.showPay = true;
          }
          break;
        case "exchange":
          if (this.canIntegral()) {
            this.showExchange = true;
          }
          break;
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
    // 选择兑换积分的结果
    exchangeResult(data) {
      this.currentExchange = data;
      this.getOrderDetail();
    },
    // 点击编辑地址
    editAddress() {
      // 跳转到编辑页面
      this.$router.push({
        name: "editAddress",
        params: { addressId: this.addressData.addressId }
      });
    },
    // 点击添加地址
    addAddress() {
      this.$router.push({
        name: "addAddress"
      });
    },
    // 去往选择地址列表
    chooseAddress() {
      this.$router.push({
        name: "addressList",
        query: { address: "single" }
      });
    },
    // 设置默认收货地址
    setDefault() {
      // 如果是默认则没反应
      if (this.addressData.def) {
        return;
      }
      const data = this.addressData;
      data.def = true;
      this.$http({
        method: "put",
        url: setDefaultAddress,
        data: data
      }).then(res => {
        if (res.code === 200) {
          Toast("设置默认地址成功");
        }
      });
    },
    // 查询地址并将默认地址存到本地
    getAddress() {
      this.$http({
        method: "get",
        url: addressList,
        params: {}
      }).then(res => {
        if (res.code === 200) {
          let data = res.data || [];
          let flag = 0;
          data.map(item => {
            if (item.def) {
              this.addressData = item;
              flag = 0;
            }
          });
          if (!flag) {
            this.addressData = data && data[0];
          }
        }
      });
    },
    // 查询账户支付的一些信息（专属费用，积分兑换等等）accountType为0表示积分列表， 为1表示专属费用列表(非活动)
    getAccoutUse() {
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
          // 专属费用列表
          this.costList = data.filter(item => {
            return item.accountType == 1;
          });
        }
      });
    },
    // 查询待提交订单的商品列表(如果是购物车的商品则不需要传参数，只有立即购买时需要传)
    getOrderDetail() {
      let data = {};
      // buyNow为1时表示立即购买，为0时表示购物车结算
      if (this.$route.query.buyNow == 1) {
        data = this.$store.state.common.buyNowData;
      }
      // 积分参数
      let score = this.currentExchange.id ? this.currentExchange : {};
      this.$http({
        method: "post",
        url: orderList,
        data: {
          ...data,
          ...score
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          this.orderInfo = data;
          this.goodslist = data.goodsParams || [];
          // this.payList = data.payment;
        }
      });
    },
    // 提交订单
    submitOrder() {
      if (!this.addressData) {
        Toast("请选择地址");
        return;
      }
      if (!this.currentPay) {
        Toast("请选择支付方式");
        return;
      }
      if (this.payWay == 1 && this.orderInfo.orderAmount > 0) {
        Toast("积分不足，无法支付");
        return;
      }
      // 积分
      let exchange = {
        // 积分的id
        accountInfoId: this.currentExchange.id,
        // 修改后的积分
        modifyIntegralNum: this.currentExchange.modifyIntegralNum,
        // 积分的accountId
        accountId: this.currentExchange.accountId,
        // 0表示积分
        accountType: this.currentExchange.accountType,
        // 积分的额度
        balanceCount: this.currentExchange.balanceCount,
        // 是否使用积分
        useIntegral: this.currentExchange.id ? 1 : 0,
        // 接口返回的比例
        exchangeRate: this.orderInfo.exchangeRate
      };
      let data = {
        addressId:
          this.$route.query.isBindAddress == "1"
            ? this.bindAddress.addressId
            : this.addressData.addressId, // 单地址才使用
        applyId: 0, // 产生订单的应用id
        applyIds: 0, // 未知id集合
        bonus: 0, // 红包金额
        bonusId: 0, // 红包的id
        discount: 0, // 折扣价
        distrPrice: 0, // 分销价
        extensionCode: "", // 礼品卡册兑换码
        extensionId: 0, // 礼品卡册兑换码的id
        fromType: "", // 订单来源
        giftCardAmount: 0, // 礼品卡折扣金额
        giftCardIds: "", // 礼品卡的id集合
        goodsAmount: 0, // 商品总金额
        insureFee: 0, // 保价费用,取自shipping表的insure字段 -- 订单金额 X insure(保价百分比) = 保价费用
        integralAmount: 0, // 使用积分后的金额
        integralUseNum: 0, // 使用的积分的数量,取用户使用积分,商品可用积分,用户拥有积分中最小者
        invContent: "", // 发票内容,取值shop_config表的code字段的值为invoice_content的value字段值
        invPayee: "", // 发票抬头,用户页面填写
        invType: "", // 发票类型,取值shop_config表的code字段的值为invoice_type的value字段值
        multipleAddress: this.$route.query.address == 0 ? 0 : 1, // 是否为多地址 0不是，1是
        orderAmount: 0, // 付款金额
        orderRemarks: "", // 用户留言备注
        packFee: 0, // 包装费
        packId: 0, // 包装ID
        packName: "", // 包装名称
        paidAmount: 0, // 已付款金额
        parentId: 0, // 订单的推荐人ID
        payCode: this.currentPay.payCode, // 支付编码
        payFee: 0, // 支付方式费用: 手续费
        payId: this.currentPay.payId, // 支付方式id
        payName: this.currentPay.payName, // 支付方式的名字
        payType: this.currentPay.payType, // 支付方式的类型
        shippingAddressParams: [], // 多地址信息(每个地址会携带商品信息)
        shippingFee: 0, // 配送费用
        shippingId: 0, // 配送方式ID
        shippingName: "", // 配送方式名称：快递公司或者自取
        surplus: 0, // 该订单使用金额的数量,取用户设定余额,用户可用余额,订单金额中最小者
        tax: 0, // 发票税额
        goodsParams: this.goodslist, // 订单的商品
        ...exchange
      };
      this.$http({
        method: "post",
        url: this.$route.query.buyNow == 1 ? buyNowOrder : submitOrderList,
        data: data
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          // 总单号
          const totalOrderNo = data.totalOrderNo;
          this.$router.push({
            name: "payOrder",
            query: {
              orderNo: totalOrderNo,
              type: "single" // 如果是单地址提交则传single
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-order-content-single {
  background: $lightColor;
  padding-bottom: 100px;
  .address_area {
    background: #fff;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .area_img {
      width: 40px;
      height: 40px;
      margin-right: 20px;
    }
    .area_right {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 24px;
      .user_phone {
        font-size: 12px;
        .user {
          color: #131313;
          margin-right: 10px;
        }
        .phone {
          color: #c7c7cc;
        }
      }
      .address_text {
        color: #131313;
        font-size: 13px;
        word-break: break-all;
      }
      .operation {
        font-size: 13px;
        color: #ff3945;
        display: flex;
        align-items: center;
        .operation_line {
          margin: 0 12px;
        }
      }
      .icon_right {
        font-size: 14px;
        color: #c7c7cc;
        margin-left: 18px;
      }
    }
  }
  // 添加地址按钮
  .add_address {
    height: 40px;
    border-radius: 10px;
    margin: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fc332e;
    color: #fff;
    margin-top: 10px;
    font-size: 14px;
  }
  .goods {
    margin-top: 10px;
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
    margin-top: 20px;
    width: 100%;
    .van-button--primary {
      width: 90px;
      margin-left: 10px;
    }
  }
}
</style>

