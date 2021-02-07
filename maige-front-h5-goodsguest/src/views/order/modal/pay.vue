<template>
  <van-popup class="v-order-modal-pay" v-model="show" round position="bottom" @close="close">
    <div class="header_title">支付方式</div>
    <van-radio-group v-model="chooseId">
      <van-cell-group>
        <van-cell clickable :key="index" v-for="(item, index) in payList" @click="choose(item)">
          <template v-slot:title>
            <div class="cell_box">
              <!-- <img class="cell_img" src="~assets/images/order/weixin.png" /> -->
              <span class="cell_title">{{item.payType}}</span>
            </div>
          </template>
          <van-radio slot="right-icon" :name="item.payId" checked-color="#ff3a44" />
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </van-popup>
</template>

<script>
/**
 * 支付方式
 * 参数说明: 1. v-model="" 表示弹出层打开或关闭
 *          2. 关闭弹出层事件 close
 *          3. payResult 选择结果的自定义事件
 *          4. currentPay 当前的支付方式
 *          5. list 支付方式列表
 */
export default {
  name: "pay",
  data() {
    return {
      // 是否展示弹窗
      show: this.value,
      // 选择的radio
      chooseId: 3,
      // 支付列表
      payList: []
    };
  },
  props: {
    // 父组件v-model传过来控制弹窗开启关闭的
    value: {
      default: false
    },
    // 当前支付方式
    currentPay: {
      default: null
    },
    // 支付列表
    list: {
      default: []
    }
  },
  watch: {
    // 监听value更新show
    value(newValue, oldValue) {
      this.show = newValue;
    },
    // 当前支付方式
    currentPay: {
      handler(newValue) {
        const data = JSON.parse(JSON.stringify(newValue));
        this.chooseId = data.payId;
      },
      deep: true,
      immediate: true
    },
    // 支付列表
    list: {
      handler(newValue) {
        this.payList = JSON.parse(JSON.stringify(newValue));
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  components: {},
  methods: {
    // 关闭弹出层时触发
    close() {
      this.show = false;
      this.$emit("close", this.show);
    },
    // 选择某个单选项
    choose(item) {
      this.chooseId = item.payId;
      this.$emit("payResult", item);
      this.close();
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-order-modal-pay {
  .header_title {
    padding: 17px 0;
    padding-bottom: 40px;
    text-align: center;
    font-size: 16px;
    color: #424242;
    font-weight: bold;
  }
  .van-cell-group {
    padding-bottom: 40px;
  }
  .cell_box {
    display: flex;
    align-items: center;
    .cell_img {
      width: 15px;
      height: 15px;
      margin-right: 12px;
    }
    .cell_title {
      color: #131313;
    }
  }
}
</style>

