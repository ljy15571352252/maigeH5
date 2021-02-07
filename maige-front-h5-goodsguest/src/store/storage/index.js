/**
 * 这里创建保存本地/读取本地/更新（增加，删除，更新）并保存每条数据的方法
 */

import { mySession } from "@/utils/cache.js";

// 获取待提交订单的多地址商品信息列表（商品下面插入地址）
export function getMutipleAddress() {
  return mySession.get('mutipleAddressGoods');
}

// 存储待提交订单的多地址商品信息列表（商品下面插入地址）
export function setMutipleAddress(data) {
  mySession.set('mutipleAddressGoods', data);
  return data;
}

// 立即购买的商品
export function getBuyNowData() {
  return mySession.get('buyNowGoods')
}
// 存储并返回立即购买的商品
export function setBuyNowData(data) {
  mySession.set('buyNowGoods', data);
  return data;
}

export function setsaleData(data){
  mySession.set('setsaleAdress', data);
  return data;
}