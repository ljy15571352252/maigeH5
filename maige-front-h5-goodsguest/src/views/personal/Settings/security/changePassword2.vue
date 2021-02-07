<template>
  <div class="v-personal-settings-security-password2">
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
      <p class="p1">设置新的登录密码</p>
      <div class="password flex_between">
        <input ref="input" v-model="password" type="password" placeholder="8-20位数字/字母/字符组合" />
        <i @click="showPassword" v-show="!show" class="icon">
          <img src="~assets/images/setting/eyeOpen.png" alt />
        </i>
        <i @click="hidePassword" v-show="show" class="icon">
          <img src="~assets/images/setting/eyeClose.png" alt />
        </i>
      </div>
      <div class="next" @click="nextStep" :style="{backgroundColor: backgroundColor}">确定</div>
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
      canConfirm: false, // 能否点击确定
      show: false, // 显示密码
      password: "", // 密码
      isSend: false, // 是否发送验证码
      btnWord: "发送验证码", // 按钮文字
      backgroundColor: "#CCC", // 下一步按钮颜色
      value: "",
      userData: {},
      phoneNum: "",
      color: "#fff",
      seconds: 120
    };
  },
  watch: {
    password(val) {
      this.password = val.replace(/\s+/g, "");
      this.password = this.password.substring(0, 20);
      if (this.password.length >= 8) {
        this.backgroundColor = "#FF3945";
        this.canConfirm = true;
      } else {
        this.backgroundColor = "#CCC";
        this.canConfirm = false;
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
    // 显示密码
    showPassword() {
      this.$refs.input.type = "text";
      this.show = true;
    },
    //  隐藏密码
    hidePassword() {
      this.$refs.input.type = "password";
      this.show = false;
    },
    // 下一步
    nextStep() {
      if (!this.canConfirm) return;
      this.$router.push({
        name: "changepassword3"
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
.v-personal-settings-security-password2 {
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
    .password {
      position: relative;
      width: 345px;
      height: 37px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(229, 229, 229, 1);
      border-radius: 4px;
      box-sizing: border-box;
      padding: 0 12px;
      margin-bottom: 40px;
      input {
        width: 300px;
        height: 34px;
        border: none;
      }
      .icon {
        display: inline-block;
        width: 15px;
        height: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
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