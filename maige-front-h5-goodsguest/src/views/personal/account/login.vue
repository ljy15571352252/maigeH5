<template>
  <div class="v-personal-account-login">
    <label for="account" class="my_input" style="margin-bottom: 15px">
      <img class="icon" src="~assets/images/account/avantar_small@2x.png" alt />
      <input v-model="form.phone" type="text" id="account" placeholder="请输入您的手机号" />
    </label>
    <label for="password" class="my_input" style="margin-bottom: 30px">
      <img class="icon" src="~assets/images/account/password@2x.png" alt />
      <input v-model="form.password" type="password" id="password" placeholder="请输入您的密码" />
    </label>
    <div class="login" @click="login">登录</div>
    <div class="operate" style="margin-bottom: 40px">
      <router-link to="/personal/account/register">注册帐号</router-link>
      <router-link to="/personal/account/foundCode1">忘记密码</router-link>
    </div>
    <div class="login_title" style="margin-bottom: 25px">
      <i></i>
      <span>第三方账号登录</span>
      <i></i>
    </div>
    <div class="thirdParty" style="margin-bottom: 50px">
      <a href>
        <img src="~assets/images/account/wechat@2x.png" alt />
      </a>
      <a href>
        <img src="~assets/images/account/QQ@2x.png" alt />
      </a>
    </div>
    <p class="agreement">
      登录即代表阅读并同意
      <router-link to="/personal/registerAgreement">《注册协议》</router-link>
    </p>
  </div>
</template>

<script>
import { handleCrypt } from "@/utils/handleCrypt";
import { myStorage } from "@/utils/cache";
import { login } from "@/configs/interface";
import { Toast } from "vant";
export default {
  name: "login",
  data() {
    return {
      form: {
        phone: "",
        password: ""
      }
    };
  },
  methods: {
    // 登录
    login() {
      const formData = new FormData();
      if (
        this.form.phone.length < 11 ||
        this.form.phone.length > 11 ||
        !/^1[3456789]\d{9}$/.test(this.form.phone)
      ) {
        Toast("手机号格式不正确");
        return;
      }
      if (!this.form.password.replace(/^\s/g, "")) {
        Toast("请输入密码");
        return;
      }
      formData.append("loginMode", 0);
      formData.append("username", this.form.phone);
      formData.append("password", handleCrypt.encrypt(this.form.password));
      this.$http({
        method: "post",
        url: login,
        data: formData
      }).then(result => {
        if (result.code === 200) {
          myStorage.set("token", result.data.token);
          myStorage.set("userData", result.data);
          const fromPath = myStorage.get("fromPath");
          if (fromPath) {
            this.$router.push(fromPath);
            myStorage.remove("fromPath");
          } else {
            this.$router.push("/");
          }
        } else {
          Toast(result.message);
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-account-login {
  input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #ccc;
  }
  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ccc;
  }
  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ccc;
  }
  input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #ccc;
  }
  .my_input {
    display: flex;
    align-items: center;
    width: 319px;
    height: 44px;
    background: rgba(247, 250, 255, 1);
    border-radius: 7px;
    box-sizing: border-box;
    padding: 0 20px;
    .icon {
      width: 14px;
      margin-right: 20px;
    }
    input {
      line-height: 16px;
      border: none;
      background: transparent;
      font-size: 14px;
      color: #333;
    }
  }
  .login {
    width: 319px;
    height: 44px;
    line-height: 44px;
    background: rgba(255, 49, 98, 1);
    border-radius: 22px;
    font-size: 17px;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    letter-spacing: 4px;
    margin-bottom: 23px;
  }
  .operate {
    display: flex;
    justify-content: space-between;
    padding: 0 28px;
    a {
      font-size: 12px;
      color: rgba(69, 69, 69, 1);
    }
  }
  .login_title {
    display: flex;
    justify-content: space-between;
    padding: 0 28px;
    align-items: center;
    i {
      display: inline-block;
      width: 73px;
      height: 1px;
      background: rgba(204, 204, 204, 1);
    }
    span {
      font-size: 12px;
      color: rgba(204, 204, 204, 1);
    }
  }
  .thirdParty {
    display: flex;
    justify-content: space-between;
    padding: 0 102px;
    align-items: center;
    img {
      width: 32px;
    }
  }
  .agreement {
    text-align: center;
    font-size: 12px;
    color: rgba(102, 102, 102, 1);
    a {
      color: #ff3162;
    }
  }
}
</style>