/**
 * 公共的一些业务方法或请求放到这里
 */

import { myStorage } from '@/utils/cache.js';
import http from "@/http/request.js";
// 接口
import { addressList, addCart, shopCartNum, goodsClickNum } from "@/configs/interface.js";


// 清空用户信息和token
export function clearLoginInfo() {
  myStorage.remove('token');
  myStorage.remove('userData');
}

// 判断是否登录
export function isLogin() {
  let userData = myStorage.get("userData");
  if (userData) {
    return true;
  } else {
    return false;
  }
}

// 隐藏手机号中间的四位数并返回结果
export function hideTelephone(phone) {
  phone = "" + phone;
  let reg = /(\d{3})\d{4}(\d{4})/;
  return phone.replace(reg, "$1****$2");
}

// 查询我的地址列表
export function getAddressList() {
  return http({
    method: "get",
    url: addressList,
    data: {}
  })
}

// 加入购物车(参数会根据商品类型的而不同传的参数也不一样)
export function addShopCart(data) {
  return http({
    method: "post",
    url: addCart,
    data: data
  })
}

// 查询加入购物车的商品数量
export function getShopCartNum() {
  return http({
    method: "get",
    url: shopCartNum,
    data: {}
  })
}

// 查询点击商品详情
export function getClickCount(param) {
  http({
    method: "get",
    url: goodsClickNum,
    data: {
      goodsId: param
    }
  })
}