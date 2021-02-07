<template>
  <div class="v-personal-settings-security-bindPhone2">
    <navbar
      class="navbar"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    >
      <template v-slot:center>
        <span>修改号码</span>
      </template>>
    </navbar>
    <div class="wrapper">
      <p class="p1">绑定新号码</p>
      <input class="phoneNum" v-model="phoneNum" type="text" placeholder="请输入手机号" />
      <p class="p1">短信验证码</p>
      <div class="flex_between" style="margin-bottom: 32px">
        <van-field readonly clickable :value="value" @touchstart.native.stop="show = true" />
        <div
          @click="sendCaptcha"
          v-if="!isSend"
          class="btn"
          :style="{backgroundColor: backgroundColor2}"
        >{{btnWord}}</div>
        <div v-else class="btn" style="backgroundColor: #E6E6E6">重新获取({{seconds}})s</div>
      </div>
      <div class="next" @click="nextStep" :style="{backgroundColor: backgroundColor}">确定</div>
    </div>
    <van-number-keyboard v-model="value" :show="show" :maxlength="6" @blur="show = false" />
  </div>
</template>

<script>
import navbar from "components/navbar/nav";
import { myStorage } from "@/utils/cache.js";
export default {
  name: "index",
  components: { navbar },
  data() {
    return {
      canSend: false, // 是否能够发送验证码
      backgroundColor2: "#E6E6E6",
      isSend: false, // 是否发送验证码
      btnWord: "发送验证码", // 按钮文字
      backgroundColor: "#CCC", // 下一步按钮颜色
      show: false,
      value: "",
      userData: {},
      phoneNum: "",
      color: "#fff",
      seconds: 120
    };
  },
  watch: {
    phoneNum(newVal) {
      if (
        newVal.length < 11 ||
        newVal.length > 11 ||
        !/^1[3456789]\d{9}$/.test(newVal)
      ) {
        this.backgroundColor2 = "#E6E6E6";
        this.canSend = false;
      } else {
        this.backgroundColor2 = "#FF3945";
        this.canSend = true;
      }
    },
    value(val) {
      if (String(val).length === 6) {
        this.backgroundColor = "#FF3945";
      } else {
        this.backgroundColor = "#CCC";
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getUserdata();
    },
    // 下一步
    nextStep() {
      this.$router.push({
        name: "changeBindPhone3"
      });
    },
    // 发送验证码
    sendCaptcha() {
      if (!this.canSend) return;
      this.isSend = true;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-settings-security-bindPhone2 {
  height: 100%;
  background-color: #fff;
  overflow: auto;
  padding-top: 60px;
  .navbar {
    background: linear-gradient(
      45deg,
      rgba(255, 58, 67, 1) 0%,
      rgba(255, 49, 98, 1) 100%
    );
  }
  .wrapper {
    padding: 18px 14px;
    .phoneNum {
      width: 100%;
      height: 38px;
      line-height: 38px;
      padding: 0 10px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(229, 229, 229, 1);
      border-radius: 4px;
      margin-right: 10px;
      margin-bottom: 26px;
    }
    .p1 {
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
      line-height: 1;
      margin-bottom: 12px;
    }

    .p2 {
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
      line-height: 1;
      margin-bottom: 18px;
    }
    .btn {
      padding: 0 16px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      color: #fff;
      font-size: 16px;
      border-radius: 4px;
    }
    .van-cell {
      width: 190px;
      height: 38px;
      line-height: 38px;
      padding: 0 10px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(229, 229, 229, 1);
      border-radius: 4px;
      margin-right: 10px;
    }
    .next {
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: rgba(255, 57, 69, 1);
      border-radius: 4px;
      font-size: 16px;
      color: #fff;
    }
  }
}
</style>