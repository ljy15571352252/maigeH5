
import axios from 'axios';
import configs from '@/configs/env';
import { Toast } from 'vant';
import { myStorage } from '@/utils/cache.js';
import { clearLoginInfo } from '@/configs/common.js';
import router from '@/router/router.js';

// 实例化一个axios实例(本实例只用于上传操作)
const upload = axios.create({
  baseURL: configs.baseURL,
  timeout: 1000 * 10,
  withCredentials: true
})

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
  // 请求参数对象
  let data = config.data;
  // 如果是formdata数据且需要添加默认参数则遍历添加默认参数
  if (openDefault && (data instanceof FormData)) {
    let keys = Object.keys(defaults);
    keys && keys.map(item => {
      data.append(item, defaults[item]);
    });
  }
  // 有type="file"上传控件时需要设置这个
  config.headers['Content-Type'] = 'multipart/form-data; charset=utf-8';
  // 没有type=file上传控件时需要设置这个
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
  // 配合application/x-www-form-urlencoded请求头使用
  // data = qs.stringify(data);
  config.data = data;
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
    case 404: msg = '请求错误,未找到该资源'
      break;
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
    default: msg = `${msg}(${code})`
  }
  if (code) {
    Toast(msg);
  }
}

/**
 * 请求拦截
 */
upload.interceptors.request.use(config => {
  config.headers['token'] = myStorage.get('token')
  config = handleConfig(config);
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截(返回值如果是json字符串自动进行了json转换)
upload.interceptors.response.use(response => {
  if (response == null || response === undefined) {
    return null;
  }
  // 返回值处理
  let code = response.data.code;
  let msg = response.data.message;
  if (code !== 200) {
    responseHandle(code, msg);
  }
  return response.data;
}, error => {
  let msg = error.response && error.response.data && error.response.data.message;
  const status = error.response && error.response.status;
  // 错误处理
  errorHandle(status, msg);
  return Promise.reject(error)
})

/**
 * 上传表单请求导出
 * @param {String} url 接口地址
 * @param {FormData} data formdata表单数据
 */
export default function postform(url, data = {}) {
  return new Promise((resolve, reject) => {
    upload.post(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}
