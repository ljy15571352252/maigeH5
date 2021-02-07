<template>
  <van-action-sheet class="v-product-addrmodal" v-model="showmodal" @close="hide" title="配送至">
    <div class="addr_box">
      <div
        @click="chooseAddr(item)"
        :class="currentAddr.addressId === item.addressId ? 'addr_item' : 'addr_item gray_color'"
        :key="item.addressId"
        v-for="(item) in addrData"
      >
        <img
          class="addr_icon"
          v-if="currentAddr.addressId === item.addressId"
          src="~assets/images/product/dingwei.png"
          alt
        />
        <img
          class="addr_icon"
          v-if="currentAddr.addressId != item.addressId"
          src="~assets/images/product/dingwei_gray.png"
          alt
        />
        <span
          class="addr_text one-txt-cut"
        >{{item.provinceName + item.cityName + item.districtName + item.address}}</span>
      </div>
      <div v-if="!addrData || addrData.length === 0" class="address_none">
        <img class="no_icon" src="~assets/images/address/address_none.png" />
        <div class="none_des">暂无地址哦~</div>
      </div>
    </div>
    <div class="confirm_btn" @click="confirmAddr">选择其他地址</div>
  </van-action-sheet>
</template>

<script>
/**
 * 选择地址弹窗
 * 使用方式：引入注册，实例化 <addrmodal />
 * 参数说明：1. v-model="" 控制弹窗开启关闭
 *          2. hide 关闭弹窗的自定义事件
 *          3. addrChange选择地址改变的change事件
 */
import { getAddressList } from "@/configs/common.js";
export default {
  name: "addrmodal",
  data() {
    return {
      // 控制弹窗开启关闭
      showmodal: this.value,
      // 当前选择的地址对象
      currentAddr: {},
      // 地址列表
      addrData: []
    };
  },
  props: {
    // 弹窗是否关闭 true表示打开
    value: {
      default: false
    }
  },
  watch: {
    value(newValue) {
      this.showmodal = newValue;
    }
  },
  created() {
    this.getList();
    let currentAddr = this.$store.state.common.singleAddress;
    if (currentAddr) {
      this.currentAddr = currentAddr;
    }
  },
  methods: {
    // 自定义关闭事件
    hide() {
      this.$emit("hide", false);
    },
    // 选择地址事件
    chooseAddr(item) {
      this.currentAddr = item;
      this.$emit("addrChange", item);
      this.$store.commit("common/setSingle", item);
      this.hide();
    },
    // 选择其他地址
    confirmAddr() {
      this.hide();
      this.$router.push({
        name: "addressList",
        query: { address: "single" }
      });
    },
    // 获取用户的所有地址
    getList() {
      getAddressList().then(res => {
        if (res.code == 200) {
          let data = res.data || [];
          this.addrData = data;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.v-product-addrmodal {
  padding: 0px 30px 30px 30px;
  .addr_box {
    height: 250px;
    overflow: auto;
    .address_none {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .no_icon {
        width: 223px;
        height: 134px;
      }
      .none_des {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #333;
      }
    }
    .addr_item {
      padding: 11px 0;
      display: flex;
      align-items: center;
      .addr_icon {
        width: 12px;
        height: 15px;
        vertical-align: middle;
        margin-right: 6px;
      }
      .addr_text {
        font-size: 14px;
      }
    }
  }
  .gray_color {
    color: #999;
  }
  .confirm_btn {
    padding: 10px 134px;
    background: #ff3945;
    border-radius: 5px;
    color: #fff;
    white-space: nowrap;
  }
}
</style>
