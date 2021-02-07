<template>
  <van-action-sheet class="v-personal-cancelorder" v-model="isCancel" title="取消订单" @close="close">
    <div class="cancelorder_content">
      <!-- <div class="tip_des">
        <div class="tip_title">温馨提示:</div>
        <div class="tip_content">
          <div>1.限时特价、预约资格等购买优惠可能一并取消</div>
          <div>2.支付券不予返还;支付优惠一并取消</div>
          <div>3.订单一旦取消，无法恢复</div>
          <div>4.微信订单返现金额会从退款中扣除</div>
        </div>
      </div>-->
      <div class="refuse_title">请选择取消订单的原因(必选) :</div>
      <van-radio-group class="group_box" v-model="radio">
        <van-cell-group>
          <van-cell
            :title="item.name"
            clickable
            @click="chooseRadio(item)"
            :key="item.value"
            v-for="(item) in radioArr"
          >
            <van-radio slot="right-icon" checked-color="#ff3a44" :name="item.value" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-button class="confirm_btn" size="small" round type="primary" @click="confirmResult">确定</van-button>
    </div>
  </van-action-sheet>
</template>

<script>
/**
 * 取消订单弹窗
 * 参数说明： 1.reload
 */
import { orderOperation } from "@/configs/interface.js";
import { Toast } from "vant";
export default {
  name: "cancelorder",
  data() {
    return {
      // 是否取消订单
      isCancel: false,
      // radio选项的name值
      radio: "",
      // 当前点击的订单的信息
      orderInfo: {},
      // 选项的渲染数组
      radioArr: [
        {
          name: "商品无货",
          value: 1
        },
        {
          name: "不想要了",
          value: 2
        },
        {
          name: "商品信息填写错误",
          value: 3
        },
        {
          name: "地址信息填写错误",
          value: 4
        },
        {
          name: "商品降价",
          value: 5
        },
        {
          name: "其他",
          value: 6
        }
      ]
    };
  },
  props: {
    value: "",
    // 当前点击的订单信息
    order: {
      default: {}
    }
  },
  watch: {
    value(newValue) {
      this.isCancel = newValue;
    },
    order: {
      handler(newValue) {
        if (newValue) {
          const data = JSON.parse(JSON.stringify(newValue));
          this.orderInfo = data;
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    // 选择radio
    chooseRadio(item) {
      this.radio = item.value;
    },
    // 关闭弹窗
    close() {
      this.$emit("close", false);
    },
    // 确定取消订单
    confirmResult() {
      this.$http({
        method: "get",
        url: orderOperation,
        data: {
          // 下标：1-取消订单；2-删除订单；3-确认收货
          index: 1,
          orderId: this.orderInfo.orderId,
          // 订单状态：2-取消订单；7-删除订单；5-确认收货
          orderStatus: 2
        }
      }).then(res => {
        if (res.code === 200) {
          Toast("订单取消成功");
          this.close();
          this.$emit("reload", null);
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-cancelorder {
  background: #fff;
  .cancelorder_content {
    padding: 0 15px 20px 15px;
    .refuse_title {
      margin-top: 24px;
      font-size: 15px;
      font-weight: 500;
      color: #333;
    }
    .group_box {
      font-size: 15px;
      color: #454545;
    }
    .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
      border: 0;
    }
  }
  .confirm_btn {
    width: 100%;
    margin: 0 auto;
  }
}
</style>

