<template>
  <van-popup class="v-order-modal-exchange" v-model="show" round position="bottom" @close="close">
    <div class="header_title">积分兑换</div>
    <p
      v-if="chooseRadio !== 0"
      style="text-align: center;padding-bottom: 6px; color: red"
    >此商品当前积分账户最大可用积分： {{maxCanUseIntegral}}</p>
    <van-radio-group v-model="chooseRadio">
      <van-cell-group>
        <van-cell @click="noUseIntegral">
          <template v-slot:title>
            <div class="cell_box">
              <span class="cell_title">不使用</span>
            </div>
          </template>
          <van-radio slot="right-icon" :name="0" checked-color="#ff3a44" />
        </van-cell>
        <van-cell
          clickable
          :key="index"
          v-for="(item, index) in exchangeList"
          @click="chooseAccount(item)"
        >
          <template v-slot:title>
            <div class="cell_box">
              <img class="account_img" :src="item.accountLogo" />
              <span class="cell_title">{{item.accountName}}({{item.balanceCount}})</span>
            </div>
          </template>
          <div class="flex_start" v-if="chooseRadio === item.id">
            <span>使用积分：</span>
            <van-stepper v-model="value2" :min="0" :max="maxCanUseIntegral" />
          </div>
          <van-radio slot="right-icon" :name="item.id" checked-color="#ff3a44" />
        </van-cell>
        <div class="confirm_btn">
          <van-button @click="choose" type="primary" size="small">确定</van-button>
        </div>
      </van-cell-group>
    </van-radio-group>
  </van-popup>
</template>

<script>
/**
 * 积分兑换
 */
// 接口
import { orderList } from "@/configs/interface.js";

export default {
  name: "exchange",
  data() {
    return {
      // 选中的积分账户
      currentExchange: {},
      // 使用的积分
      value2: 0,
      // 最大可用积分
      maxCanUseIntegral: 0,
      // 是否展示弹窗
      show: this.value,
      // 选择的当前id值为0
      chooseRadio: 0,
      // 列表数据
      exchangeList: []
    };
  },
  props: {
    // 父组件v-model传过来控制弹窗开启关闭的
    value: {
      default: false
    },
    // 积分列表
    list: {
      default: null
    },
    // 当前选择的项
    current: {
      default: null
    }
  },
  created() {},
  components: {},
  watch: {
    // 监听value更新show
    value(newValue, oldValue) {
      this.show = newValue;
    },
    // 积分列表
    list: {
      handler(newValue) {
        if (newValue) {
          this.exchangeList = JSON.parse(JSON.stringify(newValue));
        }
      },
      deep: true,
      immediate: true
    },
    // 当前选择的项
    current: {
      handler(newValue) {
        if (newValue) {
          const newRadio = JSON.parse(JSON.stringify(newValue));
          this.chooseRadio = newRadio.id;
        } else {
          this.chooseRadio = 0;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 不使用积分账户
    noUseIntegral() {
      this.chooseRadio = 0;
      this.currentExchange = {};
    },
    // 选择积分账户
    chooseAccount(item) {
      this.chooseRadio = item.id || 0;
      this.currentExchange = item.id ? item : {};
      this.getMaxIntergral();
    },
    // 获取最大值
    getMaxIntergral() {
      let data = {};
      // buyNow为1时表示立即购买，为0时表示购物车结算
      if (this.$route.query.buyNow == 1) {
        data = this.$store.state.common.buyNowData;
      }
      // 积分参数
      let score = this.currentExchange.id ? this.currentExchange : {};
      this.$http({
        method: "post",
        url: orderList,
        data: {
          ...data,
          ...score
        }
      }).then(res => {
        if (res.code == 200) {
          this.maxCanUseIntegral = res.data.maxUseNum;
          // 如果数量为零则初始化一个最大值
          if (!this.value2) {
            this.value2 = this.maxCanUseIntegral;
          }
        }
      });
    },
    // 关闭弹出层时触发
    close() {
      this.$emit("close", false);
    },
    // 选择某个单选项
    choose() {
      if (this.currentExchange.id) {
        this.currentExchange.modifyIntegralNum = this.value2;
      }
      this.$emit("exchangeResult", this.currentExchange);
      this.close();
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-order-modal-exchange {
  padding-bottom: 20px;
  .header_title {
    padding: 15px 0;
    text-align: center;
    font-size: 16px;
    color: #424242;
    font-weight: bold;
  }
  .cell_box {
    display: flex;
    align-items: center;
    .account_img {
      width: 25px;
      height: 25px;
    }
    .cell_title {
      color: #131313;
    }
  }
  .confirm_btn {
    padding: 0 15px;
    .van-button {
      width: 100%;
      border-radius: 4px;
    }
  }
}
</style>

