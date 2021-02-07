<template>
  <div class="v-cart-modal-clearmodal">
    <van-dialog v-model="isClear" title="快速清理" :show-confirm-button="false">
      <div class="clear_content">
        <div class="clear_tip">现在有20件商品，建议清理较早的商品</div>
        <div class="product_item" :key="item.createTime" v-for="(item, index) in timegoods">
          <div class="show_time">
            <span class="create_time">{{item.createTime}}</span>
            <span class="all_choose" @click="chooseAll(item,index)">全选</span>
          </div>
          <div class="clear_item">
            <div
              @click="chooseItem(sub, num)"
              class="img_box active"
              :key="sub.skuId"
              v-for="(sub, num) in item.data"
            >
              <img class="img_brief" v-lazy="sub.thumbnailImgUrl" />
            </div>
          </div>
        </div>
        <div class="footer_btn">
          <van-button round size="small" type="default">移入收藏夹</van-button>
          <van-button round size="small" type="primary">删除</van-button>
        </div>
        <img class="close_icon" @click="closeModal" src="~assets/images/cart/close_icon.png" alt />
      </div>
    </van-dialog>
  </div>
</template>

<script>
/**
 * 购物车的清理弹窗
 * 参数说明： 1. isCLear 控制弹窗显示或者关闭
 *           2. close关闭的自定义事件，用于子组件点击关闭弹窗
 */
import { getDayDiff } from "@/utils/timediff.js";
export default {
  name: "clearmodal",
  data() {
    return {};
  },
  props: {
    isClear: {
      default: true
    },
    goodslist: {
      default: []
    }
  },
  created() {},
  computed: {
    // 将接口返回的数据按创建时间分组
    timegoods() {
      return this.changeGoods(this.goodslist);
    }
  },
  components: {},
  methods: {
    getDayDiff,
    // 将接口返回的数据按创建时间分组
    changeGoods(listArr) {
      // 先将传过来的数据的时间戳转换成xx时间前
      let list = JSON.parse(JSON.stringify(listArr));
      list &&
        list.map((item, index) => {
          item.createTime = this.getDayDiff(item.createTime);
        });
      // 暂时对象存储，用来判断是否存在这个createTime
      let newObj = {};
      // 最终需要的数组格式
      let newArr = [];
      list &&
        list.map((item, index) => {
          if (!newObj[item.createTime]) {
            newArr.push({
              createTime: item.createTime,
              groupName: item.groupName,
              groupIcon: item.groupIcon,
              data: [item]
            });
            newObj[item.createTime] = item;
          } else {
            newArr &&
              newArr.map((sub, num) => {
                if (sub.createTime === item.createTime) {
                  sub.data.push(item);
                }
              });
          }
        });
      return newArr;
    },
    // 关闭弹窗
    closeModal() {
      this.$emit("close", false);
    },
    // 全选当前的项
    chooseAll(item, index) {},
    // 点击选择某项
    chooseItem(sub, num) {}
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-cart-modal-clearmodal {
  // 弹窗修改样式
  .van-dialog {
    background: transparent;
    overflow: visible;
    .van-dialog__header {
      padding-top: 13px;
      padding-bottom: 13px;
      background: $mainColor;
      color: #fff;
      font-size: 17px;
      border-radius: 20px 20px 0px 0px;
    }
    .van-dialog__content {
      background: #fff;
      font-size: 12px;
      border-radius: 0 0 20px 20px;
    }
  }
  .close_icon {
    position: absolute;
    bottom: -46px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 36px;
  }
  .clear_content {
    padding: 12px 12px 100px 12px;
    height: 400px;
    overflow: auto;
    .clear_tip {
      font-size: 12px;
      color: #c7c7cc;
      text-align: center;
    }
    .product_item {
      .show_time {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        color: #131313;
        font-size: 12px;
        .all_choose {
          color: #ff3a44;
        }
      }
      .clear_item {
        display: flex;
        flex-wrap: wrap;
        .img_box {
          position: relative;
          width: 95px;
          height: 98px;
          margin-bottom: 5px;
          .img_brief {
            width: 100%;
            height: 100%;
          }
        }
        .img_box:nth-of-type(3n + 2) {
          margin-left: 5px;
          margin-right: 5px;
        }
        .img_box.active {
          border: 2px solid #ff3a44;
        }
        .active:after {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          right: -1.5px;
          top: 0;
          display: inline-block;
          background: url("~assets/images/cart/active.png") no-repeat;
          background-size: cover;
        }
      }
    }
    // 按钮
    .footer_btn {
      padding: 10px 10px;
      width: 100%;
      position: absolute;
      bottom: 0px;
      left: 0;
      background: 100%;
      display: flex;
      justify-content: space-between;
      background: #fff;
      border-radius: 0 0 20px 20px;
    }
  }
}
</style>

