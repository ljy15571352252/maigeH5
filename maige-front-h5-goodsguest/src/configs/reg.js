/**
 * 正则表达式的校验放在这里
 */
// 邮箱
export function isEmail(s) {
  if (!s) {
    return false;
  }
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

// 手机号码
export function isMobile(s) {
  if (!s) {
    return false;
  }
  return /^1[0-9]{10}$/.test(s)
}

// 电话号码
export function isPhone(s) {
  if (!s) {
    return false;
  }
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

// url地址
export function isURL(s) {
  if (!s) {
    return false;
  }
  return /^http[s]?:\/\/.*/.test(s)
}