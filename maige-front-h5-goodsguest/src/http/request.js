
import axios from 'axios';
import configs from '@/configs/env';
import { Toast } from 'vant';
import { myStorage } from '@/utils/cache.js';
import { clearLoginInfo } from '@/configs/common.js';
import router from '@/router/router.js';
import { goodsClickNum } from "@/configs/interface.js";

// 定义loading变量(这里的loading为单例模式，如果不是单例则需要封装变成单例模式)
let loading;

// 开始loading
export function startLoading() {
  loading = Toast.loading({
    message: '加载中...',
    forbidClick: true,
    loadingType: 'spinner'
  });
}

// 结束loading
export function endLoading() {
  if (loading) {
    loading.clear();
  }
}

// 实例化一个axios实例(本实例不支持传输表单数据)
const http = axios.create({
  baseURL: configs.baseURL,
  timeout: 1000 * 10,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// 配置不需要loading的请求接口
const NoLoadingRouter = [
  "/api/open/c/b2b2c/orderservice/order/checkPayStatus.json"
]

/**
 * @param {Object} config 表示axios的参数处理
 * 最终返回一个新的config配置
 */
function handleConfig(config) {
  let defaults = {
    't': new Date().getTime()
  }
  // true则表示添加默认参数，false表示不添加默认参数
  const openDefault = config.openDefault || false;
  // 参数类型: json表示传json数据, none表示不做任何处理
  const dataType = config.dataType || "none";
  // 是否合并默认参数
  const data = openDefault ? Object.assign(defaults, config.data) : config.data;
  if (config.method == 'get' || config.method == 'delete') {
    // let keys = Object.keys(data);
    // keys && keys.map((key) => {
    //   if (data[key]) {
    //     data[key] = encodeURI(data[key]);
    //   }
    // })
    config.params = data;
  } else {
    if (dataType === 'json') {
      config.data = JSON.stringify(data);
    } else {
      config.data = data;
    }
  }
  return config;
}

/**
 * 响应状态异常的处理
 * @param {Number} status 表示响应状态码
 * @param {String} msg 表示响应的信息
 */
function errorHandle(status, msg) {
  switch (status) {
    case 401:
      msg = '请先登录';
      clearLoginInfo();
      router.push({ name: "login" });
      break;
    case 403:
      msg = '请登录访问';
      router.push({ name: "login" });
      clearLoginInfo();
      break;
    // case 404: msg = '请求错误,未找到该资源'
    //   break;
    case 405: msg = '请求方法未允许'
      break;
    case 408: msg = '请求超时'
      break;
    case 502: msg = '网络连接错误，请稍后再试'
      break;
    case 503: msg = '服务不可用'
      break;
    case 504: msg = '网络超时'
      break;
    case 505: msg = 'http版本不支持该请求'
      break;
    default: msg = msg
  }
  if (status) {
    Toast(msg);
  }
}

/**
 * 响应成功后返回的数据的code处理
 * @param {Number} code 表示后台返回的code
 * @param {String} msg 表示后台返回的信息
 */
function responseHandle(code, msg) {
  switch (code) {
    case 401:
      msg = '请先登录';
      clearLoginInfo();
      router.push({ name: "login" });
      break;
    case 403:
      msg = '请登录访问';
      router.push({ name: "login" });
      clearLoginInfo();
      break;
    case 10101:
      msg = '账号已过期, 请重新登录!';
      clearLoginInfo();
      router.push({ name: "login" });
      break;
    case 10102:
      msg = '登录信息错误，请重新登录';
      clearLoginInfo();
      router.push({ name: "login" });
      break;
    // default: msg = `${msg}(${code})`;
    default: msg = msg;
  }
  if (code) {
    Toast(msg);
  }
}

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['token'] = myStorage.get('token')
  if (NoLoadingRouter.indexOf(config.url)) {
    // startLoading();
  }
  config = handleConfig(config);
  return config
}, error => {
  // endLoading();
  return Promise.reject(error)
})

// 响应拦截(返回值如果是json字符串自动进行了json转换)
http.interceptors.response.use(response => {
  if (response == null || response === undefined) {
    return null;
  }
  // endLoading();
  // 返回值处理
  let code = response.data.code;
  let msg = response.data.message;
  // 当前接口的路径(去掉域名)
  const current = response.config.url && response.config.url.replace(configs.baseURL, "");
  // 不提示错误的接口数组集合
  const arr = [goodsClickNum];
  if (code !== 200 && arr.indexOf(current) == -1) {
    responseHandle(code, msg);
  }
  return response.data;
}, error => {
  // endLoading();
  let msg = error.response && error.response.data && error.response.data.message;
  const status = error.response && error.response.status;
  // 当前接口的路径(去掉域名)
  const current = error.response.config.url && error.response.config.url.replace(configs.baseURL, "");
  // 不提示错误的接口数组集合
  const arr = [goodsClickNum];
  // 错误处理
  if (arr.indexOf(current) == -1) {
    errorHandle(status, msg);
  }
  return Promise.reject(error);
})

export default http;