
/**
 * 
 * @param {String} attr 属性名
 * @param {bool} asc // 表示升序或降序，默认true升序
 * 使用方式 数组.sort(sortBy('属性名'))
 */
export function sortBy(attr, asc) {
  //第二个参数没有传递 默认升序排列
  if (asc == undefined) {
    asc = 1;
  } else {
    asc = (asc) ? 1 : -1;
  }
  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return asc * -1;
    }
    if (a > b) {
      return asc * 1;
    }
    return 0;
  }
}