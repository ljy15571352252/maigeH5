<template>
  <div class="v-personal-settings-security-password3">
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
      <i class="icon">
        <img src="~assets/images/setting/success.png" alt />
      </i>
      <p>登录密码修改成功</p>
      <div class="next" @click="nextStep">回到首页</div>
    </div>
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
      show: false,
      value: "",
      userData: {},
      phoneNum: "",
      color: "#fff",
      seconds: 120
    };
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
        name: "home"
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
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-settings-security-password3 {
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
    padding: 55px 14px;
    text-align: center;
    p {
      text-align: center;
      font-size: 16px;
      color: rgba(120, 120, 120, 1);
      line-height: 18px;
      margin-bottom: 36px;
    }
    .icon {
      display: inline-block;
      width: 75px;
      height: 75px;
      margin-bottom: 22px;
      img {
        width: 75px;
        height: 75px;
      }
    }
    .next {
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      font-size: 16px;
      color: #fff;
      width: 180px;
      background: rgba(255, 57, 69, 1);
      margin: auto;
    }
  }
}
</style>