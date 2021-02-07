<template>
  <div class="v-personal-settings-security-password">
    <navbar
      class="navbar"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    >
      <template v-slot:center>
        <span>修改密码</span>
      </template>>
    </navbar>
    <div class="wrapper">
      <p class="p1">请完成以下认证</p>
      <p class="p2">请输入{{phoneNum}}收到的短信验证码</p>
      <div class="flex_start" style="margin-bottom: 32px">
        <van-field readonly clickable :value="value" @touchstart.native.stop="show = true" />
        <div
          @click="sendCaptcha"
          v-if="!isSend"
          class="btn"
          style="backgroundColor: #FF3945"
        >{{btnWord}}</div>
        <div v-else class="btn" style="backgroundColor: #E6E6E6">重新获取({{seconds}})s</div>
      </div>
      <div class="next" @click="nextStep" :style="{backgroundColor: backgroundColor}">下一步</div>
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
        name: "changepassword2"
      });
    },
    // 发送验证码
    sendCaptcha() {
      this.isSend = true;
    },
    // 获取用户信息
    getUserdata() {
      this.userData = myStorage.get("userData");
      this.phoneNum = this.userData.telephone;
      if (Number(this.phoneNum) && String(this.phoneNum).length === 11) {
        const reg = /^(\d{3})\d{4}(\d{4})$/;
        this.phoneNum = this.phoneNum.replace(reg, "$1****$2");
      }
    },
    // 去到修改密码
    toChangePassword() {
      this.$router.push({
        name: "changepassword"
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-settings-security-password {
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

    .p1 {
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
      line-height: 1;
      margin-bottom: 22px;
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