<template>
  <div class="v-personal-account-foundCode2">
    <label for="password1" class="my_input" style="margin-bottom: 30px">
      <img class="icon" src="~assets/images/account/password@2x.png" alt="">
      <input v-model="form.password1" type="password" id="password1" placeholder="请输入您的密码">
    </label>
    <label for="password2" class="my_input" style="margin-bottom: 30px">
      <img class="icon" src="~assets/images/account/password@2x.png" alt="">
      <input v-model="form.password2" type="password" id="password2" placeholder="请再一次输入密码">
    </label>
    <router-link to="/personal/account/foundCode2">
      <div class="login" @click="setSuccess">重置密码</div>
    </router-link>
  </div>
</template>

<script>
  import { Toast } from "vant";
  import { handleCrypt } from '@/utils/handleCrypt'
  import { retrievePwdByShortMessage } from '@/configs/interface'

  export default {
    name: "foundCode2.vue",
    data() {
      return {
        form: {
          password1: '',
          password2: '',
        }
      }
    },
    methods: {
      // 设置密码
      async setSuccess() {
        if ((!this.form.password1) || (!this.form.password2)) {
          Toast('密码不能为空')
          return false
        } else if (this.form.password1 !== this.form.password2) {
          Toast('密码不一致')
          return false
        } else if (!(this.form.password1.length <= 18 && this.form.password1.length >= 6)) {
          Toast('请输入6-18位密码')
          return false
        } else if (!(this.form.password2.length <= 18 && this.form.password2.length >= 6)) {
          Toast('请输入6-18位密码')
          return false
        }
        const captcha = sessionStorage.getItem('findCaptcha')
        const phoneNum = sessionStorage.getItem('findPhoneNum')
        const obj = {
          telephone: phoneNum,
          captcha: captcha,
          password: handleCrypt.encrypt(this.form.password2),
        }
        this.$http({
          method: "put",
          url: retrievePwdByShortMessage,
          data: obj
        }).then((res) => {
          if (res.code === 200) {
            Toast('重置密码成功')
            this.$router.push({
              name: 'login'
            })
          } else {
            Toast(res.message)
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  .v-personal-account-foundCode2 {
    input::-webkit-input-placeholder { /* WebKit browsers */
      color: #CCC;
    }
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #CCC;
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #CCC;
    }
    input:-ms-input-placeholder { /* Internet Explorer 10+ */
      color: #CCC;
    }
    .my_input {
      display: flex;
      align-items: center;
      width:319px;
      height:44px;
      background:rgba(247,250,255,1);
      border-radius:7px;
      box-sizing: border-box;
      padding: 0 10px 0 20px;
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
        margin-right: 6px;
      }
    }
    .login {
      width:319px;
      height:44px;
      line-height:44px;
      background:rgba(255,49,98,1);
      border-radius:22px;
      font-size:17px;
      color:rgba(255,255,255,1);
      text-align: center;
      letter-spacing: 4px;
      margin-bottom: 23px;
    }
    .operate {
      display: flex;
      justify-content: space-between;
      padding: 0 28px;
      a {
        font-size:12px;
        color:rgba(69,69,69,1);
      }
    }
    .sendBtn {
      width:85px;
      height:30px;
      border:1px solid rgba(255,49,98,1);
      border-radius:15px;
      font-size:14px;
      color:rgba(255,49,98,1);
      line-height:30px;
      text-align: center;
    }
    .sentWord {
      font-size: 14px;
      color:#FF3162;
    }
  }
</style>