<template>
  <div class="v-order-content-more">
    <div class="all_goods">
      <div class="goods_detail" :key="item.supplierId" v-for="(item) in allgoods">
        <!-- <div class="detail_header">
          <img class="store_img" />
          <span class="store_name one-txt-cut">{{item.supplierName}}</span>
          <van-icon class="next_icon" name="arrow" />
        </div>-->
        <div :key="sub.skuId" v-for="(sub) in item.data">
          <div class="detail_content">
            <img class="goods_img" v-lazy="sub.thumbnailImgUrl" />
            <div class="goods_right">
              <div class="main_info">
                <div class="goods_des two-txt-cut">{{sub.goodsName}}</div>
                <div class="goods_type one-txt-cut">
                  <span class="type_text">{{sub.goodsAttr}}</span>
                  <van-icon name="arrow-down" />
                </div>
                <div class="goods_num">
                  <span class="price_num">￥{{sub.specialPrice}}</span>
                  <span class="all_num">X{{sub.quantity}}</span>
                </div>
              </div>
              <div class="others">
                <span class="add_btn" @click.stop="addAddress(sub)">添加多地址</span>
                <div class="remain_num">剩余：{{remainNum(sub)}}</div>
              </div>
            </div>
          </div>
          <van-divider />
          <div
            class="address_list"
            :key="addressItem.addressId"
            v-for="(addressItem, addressIndex) in sub.children"
          >
            <div class="address_top">
              <div>
                <span class="user_name">{{addressItem.consignee}}</span>
                <span class="user_phone">{{addressItem.phone}}</span>
              </div>
              <van-stepper
                v-model="addressItem.quantity"
                integer
                :max="addressGoodsList[sub.skuId] && addressGoodsList[sub.skuId][addressItem.addressId]"
                @change="changeNum(sub)"
              />
            </div>
            <div class="address_bottom">
              <van-icon class="location_icon" name="location" />
              <div
                class="address_des"
              >{{addressItem ? (addressItem.provinceName + addressItem.cityName + addressItem.districtName + addressItem.address) : ""}}</div>
              <van-icon
                class="delete_icon"
                name="delete"
                @click.stop="deleteAddress(sub, addressIndex)"
              />
            </div>
            <van-divider />
          </div>
        </div>
      </div>
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
        <span>{{choosegoods.allNum > 100 ? '99+' : (choosegoods.allNum || 0)}}件商品合计：</span>
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
 * 多地址
 */
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
  orderList,
  submitOrderList,
  buyNowOrder,
  accountPayInfo,
  findaccountbyactivity
} from "@/configs/interface.js";
import { Toast } from "vant";
import { myStorage } from "@/utils/cache.js";

export default {
  name: "single",
  data() {
    return {
      // 订单信息
      orderInfo: {},
      // 待提交订单的商品列表
      goodslist: [],
      // 地址存储的数量信息数组（二维数组）
      addressGoodsList: [],
      // 支付列表
      payList: [],
      // 积分列表
      exchangeList: [],
      // 专属费用列表
      costList: [],
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
    // 待提交订单商品的所有信息
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
    // 如果有活动则查询活动所需要的一些账号支付的信息
    if (this.$route.query.activityId) {
      this.activityId = this.$route.query.activityId;
      this.findaccountbyactivity();
    } else {
      this.getAccoutUse();
    }
  },
  components: {
    pay,
    exchange,
    coupons,
    redpacket
  },
  computed: {
    // 将接口返回的数据按所在店铺分组
    allgoods() {
      const list = this.$store.state.common.assignAddress;
      // 每次重置并遍历记录地址的可用数量信息
      this.addressGoodsList = [];
      list &&
        list.map(sub => {
          this.initNumber(sub);
        });
      return this.changeGoods(list);
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
    //获取活动可选的支付方式
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
    // 添加多地址
    addAddress(sub) {
      if (this.remainNum(sub) <= 0) {
        Toast("商品数量已达最大值");
        return;
      }
      // 将当前选择的商品信息存入仓库
      this.$store.commit("common/setCurrentGoods", sub);
      this.$router.push({ name: "addressList", query: { address: "more" } });
    },
    // 修改数量
    changeNum(sub) {
      // 初始化
      this.initNumber(sub);
      if (this.remainNum(sub) <= 0) {
        Toast("商品数量已达最大值");
      }
      if (this.remainNum(sub) >= 0) {
        // 更新仓库中的商品数据
        let list = this.$store.state.common.assignAddress;
        list.map(goods => {
          if (goods.skuId === sub.skuId) {
            goods = sub;
          }
        });
        this.$forceUpdate();
        this.$store.commit("common/setMutipleAddress", list);
      }
    },
    // 传入当前商品返回剩余数量
    remainNum(sub) {
      // 当前商品总数
      let totalNum = sub.quantity;
      // 当前商品下面所有地址遍历相加得到的数量
      let childNum = 0;
      sub.children &&
        sub.children.map(address => {
          childNum += address.quantity;
        });
      // 剩余数量
      let otherNum = totalNum - childNum;
      return otherNum;
    },
    // 传入当前商品返回当前地址可分配的数量, goods当前商品
    assignNum(sub, addressItem) {
      // 当前商品总数
      let totalNum = sub.quantity;
      // 除了当前地址上以外的已分配数
      let childNum = 0;
      sub.children &&
        sub.children.map(address => {
          if (address.addressId != addressItem.addressId) {
            childNum += address.quantity;
          }
        });
      // 剩余数量
      let otherNum = totalNum - childNum;
      return otherNum;
    },
    // 遍历商品的地址信息初始数量限制 data当前商品信息
    initNumber(data) {
      data.children &&
        data.children.map(addressItem => {
          let arr = this.addressGoodsList[data.skuId] || [];
          arr[addressItem.addressId] = this.assignNum(data, addressItem);
          this.addressGoodsList[data.skuId] = arr;
        });
    },
    // 删除当前地址
    deleteAddress(sub, addressIndex) {
      // 从仓库获取已分配多地址的商品信息
      let list = this.$store.state.common.assignAddress;
      // 当前的点击的商品
      let currentGoods = JSON.parse(JSON.stringify(sub));
      if (currentGoods.children) {
        currentGoods.children.splice(addressIndex, 1);
      }
      list.map((goods, num) => {
        if (goods.skuId === sub.skuId) {
          list.splice(num, 1);
          list.push(currentGoods);
        }
      });
      this.$store.commit("common/setMutipleAddress", list);
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
          // this.payList = data.payment;
        }
      });
    },
    // 查询账户支付的一些信息（专属费用，积分兑换等等）accountType为0表示积分列表， 为1表示专属费用列表
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
            return item.accountType === 1;
          });
        }
      });
    },
    // 将待提交的商品地址分配信息(商品里面插入地址)转换成提交订单需要的格式(地址里面插入商品)
    changeData() {
      const list = JSON.parse(
        JSON.stringify(this.$store.state.common.assignAddress)
      );
      // 暂时对象存储，用来判断是否存在这个addressId
      let newObj = {};
      // 最终需要的数组格式
      let newArr = [];
      list &&
        list.map(item => {
          item.children &&
            item.children.map(child => {
              if (!newObj[child.addressId]) {
                let data = JSON.parse(JSON.stringify(item));
                let params = JSON.parse(JSON.stringify(child));
                data.quantity = child.quantity;
                delete data.children;
                delete params.quantity;
                newArr.push({
                  ...params,
                  addressGoodsParams: [data]
                });
                newObj[child.addressId] = item;
              } else {
                newArr &&
                  newArr.map((sub, num) => {
                    if (sub.addressId === child.addressId) {
                      let data = JSON.parse(JSON.stringify(item));
                      data.quantity = child.quantity;
                      delete data.children;
                      sub.addressGoodsParams.push(data);
                    }
                  });
              }
            });
        });
      return newArr;
    },
    // 提交订单
    submitOrder() {
      // if (!this.addressData) {
      //   Toast("请选择地址");
      //   return;
      // }
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
        addressId: "", // 单地址才使用
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
        shippingAddressParams: this.changeData() || [], // 多地址信息(每个地址会携带商品信息)
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
              type: "more" // 如果是多地址提交则传more
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
.v-order-content-more {
  background: $lightColor;
  padding-bottom: 100px;
  // 所有商品显示
  .all_goods {
    margin-top: 10px;
    background: #fff;
    .goods_detail {
      margin-top: 15px;
      padding: 12px;
    }
    .detail_header {
      display: flex;
      align-items: center;
      white-space: nowrap;
      .store_img {
        width: 15px;
        height: 15px;
        margin-right: 6px;
      }
      .store_name {
        color: #131313;
        font-size: 14px;
        margin-right: 12px;
      }
      .next_icon {
        color: #131313;
        font-size: 15px;
      }
    }
    .detail_content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      .goods_img {
        width: 68px;
        height: 68px;
        margin-right: 15px;
      }
      .goods_right {
        display: flex;
        flex: 1;
        height: 68px;
        justify-content: space-between;
        align-items: center;
      }
      .main_info {
        flex: 1;
        margin-right: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .goods_des {
          color: #131313;
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
        }
        .goods_type {
          color: #ccc;
          font-size: 11px;
          line-height: 15px;
        }
        .price_num {
          color: #ff3a44;
          font-size: 15px;
          margin-right: 10px;
        }
        .all_num {
          color: #999;
          font-size: 12px;
        }
      }
      .others {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        .add_btn {
          color: #ff4957;
          font-size: 12px;
        }
        .remain_num {
          color: #999;
          font-size: 12px;
        }
      }
    }
    .address_list {
      margin-top: 10px;
      .address_top {
        display: flex;
        justify-content: space-between;
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
        margin-top: 15px;
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
        .delete_icon {
          color: #ccc;
          font-size: 20px;
        }
      }
    }
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
    width: 100%;
    .van-button--primary {
      width: 90px;
      margin-left: 10px;
    }
  }
}
</style>

