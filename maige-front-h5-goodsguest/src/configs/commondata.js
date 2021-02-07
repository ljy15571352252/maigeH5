/**
 * 公共的一些前端数据（比如遍历数据）写在这里统一管理
 */

// 根据value取name
export function getTarget(value) {
  let result = "";
  if (value == null || value == undefined || value == "") {
    return result;
  }
  this.stateArr &&
    this.stateArr.map(item => {
      if (item.value == value) {
        result = item.name;
      }
    });
  return result;
}


// 订单-支付方式(h5支付)
export const payWay = [{
  payName: '微信H5支付',
  payType: "微信",
  payId: 3,
  icon: require('assets/images/order/weixin.png'),
  payCode: "wxpay_mweb"
}, {
  payName: '支付宝H5支付',
  payType: "支付宝",
  payId: 4,
  icon: require('assets/images/order/weixin.png'),
  payCode: "alipay_wap"
}]

// 订单管理-快递状态映射数组
// 支付方式(h5支付)
export const deliveryStateArr = [{
  name: "在途",
  value: 0
}, {
  name: "揽收",
  value: 1
}, {
  name: "疑难",
  value: 2
}, {
  name: "签收",
  value: 3
}, {
  name: "退签",
  value: 4
}, {
  name: "派件",
  value: 5
}, {
  name: "退回",
  value: 6
}]

// 首页活动专区的映射
export const homeActivity = [{
  name: "限时秒杀",
  value: 1,
  routerName: 'seckill'
}, {
  name: "周周精选",
  value: 2,
  routerName: 'weekly'
}, {
  name: "生日专区",
  value: 3,
  routerName: 'birthday'
}, {
  name: "节日专区",
  value: 4,
  routerName: 'festival'
}, {
  name: "特惠专区",
  value: 5,
  routerName: 'preferential'
}, {
  name: "折扣专区",
  value: 6,
  routerName: 'discount'
}, {
  name: "拼团专区",
  value: 7,
  routerName: 'assemble'
}, {
  name: "团购专区",
  value: 8,
  routerName: 'groupbuying'
}, {
  name: "好货抢先购",
  value: 9,
  routerName: 'goodfirst'
}, {
  name: "有奖回馈",
  value: 10,
  routerName: 'distribution'
}]