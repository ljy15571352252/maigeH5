<template>
  <van-popup class="v-order-modal-redpacket" v-model="show" round position="bottom" @close="close">
    <div class="header_title">红包</div>
    <div v-if="false" class="content_none">
      <img src="~assets/images/order/blank.png" alt />
      <div class="none_des">暂无红包</div>
    </div>
    <div class="content" v-if="true">
      <van-radio-group v-model="chooseRadio">
        <van-cell-group>
          <van-cell clickable @click="choose('1')">
            <template v-slot:title>
              <div class="cell_box">
                <div class="packet_des">600大礼包-1500减150</div>
                <div class="packet_content">
                  <div class="price">
                    <div>
                      <span class="price_unit">￥</span>
                      <span class="price_num">50</span>
                    </div>
                    <div class="price_des">满199元可用</div>
                  </div>
                  <div class="info">
                    <div class="date_end">2020.01.02到期</div>
                    <div class="goods_area">指定商品使用-分类商品适用</div>
                  </div>
                </div>
              </div>
            </template>
            <van-radio slot="right-icon" name="1" />
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
  name: "redpacket",
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
.v-order-modal-redpacket {
  padding-bottom: 40px;
  .header_title {
    padding: 17px 0;
    text-align: center;
    font-size: 16px;
    color: #424242;
    font-weight: bold;
    background: #fff;
  }
  .content{
    margin-top: -20px;
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
  .van-cell {
    margin: 0 10px;
    height: 106px;
    padding: 0;
    background: url("~assets/images/order/red_packet.png") no-repeat;
    background-size: contain;
    margin-top: 20px;
    .van-cell__title {
      color: #fff;
      .packet_des {
        margin-left: 16px;
        border-bottom: 1px dashed #fff;
      }
      .packet_content{
        display: flex;
        height: 75px;
        .price{
          width: 98px;
          border-right: 1px dashed #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding-top: 10px;
          .price_unit{
            font-size: 25px;
          }
          .price_num{
            font-size: 40px;
          }
          .price_des{
            font-size: 11px;
          }
        }
        .info{
          margin-left: 16px;
          padding-top: 15px;
        }
      }
    }
    // 右边图标样式重写
    .van-radio {
      margin-right: 25px;
      // 选中时的图标样式
      .van-radio__icon--checked .van-icon {
        color: #ff3a44;
        background-color: #fff;
        border-color: #fff;
      }
    }
  }
}
</style>