
/**
 * 利用scrollTop实现页面匀速滚动动画
 * @param {DOM} dom 当前页面的dom元素
 * @param {Number} currentY 当前所在的高度
 * @param {Number} targetY 将要达到的目标高度
 * @param {Number} step 步长
 * @param {Number} time 每次执行时间间隔,单位ms
 */
export default function scroll(dom, currentY, targetY, step = 10, time = 0) {
  clearInterval(document.timeID)
  document.timeID = setInterval(function () {
    //  向下运动
    if (currentY < targetY) {
      currentY += step;
      dom.scrollTop = currentY;
      if (currentY > targetY) {  //边界检测
        dom.scrollTop = targetY;
        clearInterval(document.timeID);
      }
      // 向上运动
    } else {
      currentY -= step;
      dom.scrollTop = currentY;
      if (currentY <= targetY) {   //边界检测
        dom.scrollTop = currentY;
        clearInterval(document.timeID);
      }
    }
  }, time)
}
