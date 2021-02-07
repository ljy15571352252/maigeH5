<template>
  <van-popup class="v-order-modal-coupons" v-model="show" round position="bottom" @close="close">
    <div class="header_title">优惠券</div>
    <div v-if="false" class="content_none">
      <img src="~assets/images/order/blank.png" alt />
      <div class="none_des">暂无优惠券</div>
    </div>
    <div v-if="true">
      <div class="header_tip">
        <span>已选中推荐优惠，使用优惠券1张，共抵扣</span>
        <span class="focus_color">￥50.00元</span>
      </div>
      <van-radio-group v-model="chooseRadio">
        <van-cell-group>
          <van-cell clickable @click="choose('1')">
            <template v-slot:title>
              <div class="cell_box">
                <div class="cell_img">
                  <img src="~assets/images/order/bgc_coupons.png" />
                  <div class="price">
                    <div>
                      <span class="price_unit">￥</span>
                      <span class="price_num">50</span>
                    </div>
                    <div class="price_des">满199元可用</div>
                  </div>
                </div>
                <div class="cell_title">
                  <div class="title_name">全场通用优惠券</div>
                  <div class="title_des">仅限新用户收单使用有效期至2019-12-12</div>
                </div>
              </div>
            </template>
            <van-radio slot="right-icon" name="1" checked-color="#ff3a44" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </van-popup>
</template>

<script>
/**
 * 优惠券
 * 参数说明: 1. v-model="" 表示弹出层打开或关闭
 *          2. 关闭弹出层事件 close
 */
export default {
  name: "coupons",
  data() {
    return {
      // 是否展示弹窗
      show: this.value,
      // 选择的radio
      chooseRadio: ""
    };
  },
  props: {
    // 父组件v-model传过来控制弹窗开启关闭的
    value: {
      default: false
    }
  },
  watch: {
    // 监听value更新show
    value(newValue, oldValue) {
      this.show = newValue;
    }
  },
  created() {},
  components: {},
  methods: {
    // 关闭弹出层时触发
    close() {
      this.$emit("close", this.show);
    },
    // 选择某个单选项
    choose(val) {
      this.chooseRadio = val;
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-order-modal-coupons {
  background: $lightColor;
  padding-bottom: 40px;
  .header_title {
    padding: 17px 0;
    text-align: center;
    font-size: 16px;
    color: #424242;
    font-weight: bold;
    background: #fff;
  }
  .content_none {
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    img {
      width: 195px;
      height: 170px;
    }
    .none_des {
      color: #424242;
    }
  }
  .header_tip {
    color: #424242;
    padding: 0 17px;
    background: #fff;
    .focus_color {
      color: #ff3846;
    }
  }
  .cell_box {
    display: flex;
    align-items: center;
    margin-right: 50px;
    .cell_img {
      width: 150px;
      height: 92px;
      margin-right: 12px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .price {
        position: absolute;
        width: 100%;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        color: #fff;
        text-align: center;
        .price_unit {
          font-size: 20px;
        }
        .price_num {
          font-size: 30px;
        }
        .price_des {
          font-size: 13px;
        }
      }
    }
    .cell_title {
      color: #131313;
      .title_name {
        font-size: 16px;
        color: #424242;
      }
      .title_des {
        color: #999;
        font-size: 13px;
      }
    }
  }
}
</style>

