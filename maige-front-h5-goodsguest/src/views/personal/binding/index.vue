<template>
  <div class="v-personal-account-binding">
      <navbar
      class="cart_header"
      title="绑定手机号码"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    >
    </navbar>
    <div class="v-personal-account">
      <label for="account" class="my_input" style="margin-bottom: 15px">
        <img class="icon" src="~assets/images/personal/icon_phone.png" alt="">
        <input v-model="form.phone" :maxlength="11" type="text" id="account" placeholder="请输入您的手机号">
      </label>
      <label for="verificationCode" class="my_input" style="margin-bottom: 30px;position: relative">
        <img class="icon" src="~assets/images/personal/icon_captcha.png" alt="">
        <input v-model="form.captcha" :maxlength="6" type="text" id="verificationCode" placeholder="请输入验证码">
        <div @click.prevent="sendCaptcha" v-if="!isSendVC" class="sendBtn">获取验证码</div>
        <div v-else class="sentWord">已发送（{{seconds}}）</div>
      </label>
      <div class="login" @click="checkNextStep">确定</div>
    </div>
  </div>
</template>

<script>
// 头部nav栏
import { Toast } from "vant";
import { editTelephone, sendEditTelephoneCaptchaMessage, findSmsSendTime } from '@/configs/interface'
import navbar from "@/components/navbar/nav";
export default {
  name: "login",
  components: {
    navbar,
  },
  data() {
    return {
      isSendVC: false,
      seconds: 120,
      form: {
        phone: '',
        captcha: '',
      }
    };
  },
  watch: {
    isSendVC(newVal) {
      if (newVal) {
        const timer = setInterval(() => {
          this.seconds = this.seconds - 1
          if (this.seconds === 0) {
            clearInterval(timer)
            this.isSendVC = false
            this.seconds = 120
          }
        }, 1000)
      }
    },
  },
  mounted() {
    this.calculateTime()
  },
  methods: {
    // 确定登录
    async checkNextStep() {
      if (this.form.phone.length < 11 || this.form.phone.length > 11 || !(/^1[3456789]\d{9}$/.test(this.form.phone))) {
        Toast('手机号格式不正确')
        return
      }
      if (!this.form.captcha) {
        Toast('请输入验证码')
        return
      } else if (!(/^\d{6}$/.test(this.form.captcha))) {
        Toast('验证码格式错误')
        return
      }
      this.$http({
        method: "PUT",
        url: `${editTelephone}?telephone=${this.form.phone}&captcha=${this.form.captcha}`,
        data: {}
      }).then((res) => {
        if (res.code === 200) {
          this.$router.push({
            name: 'home',
          })
        } else {
          Toast(res.message)
        }
      })
    },
    // 倒计时计算
    calculateTime() {
      if (sessionStorage.getItem('bindPhoneNum')) {
        this.form.phone = sessionStorage.getItem('bindPhoneNum')
        this.$http({
          method: "get",
          url: findSmsSendTime,
          data: {
            telephone: this.form.phone
          }
        }).then((res) => {
          if (res.code === 200) {
            const currentTime = Date.parse(new Date(res.data.currentTime)) / 1000
            const sendTime = Date.parse(new Date(res.data.sendTime)) / 1000
            if (currentTime - sendTime < 120) {
              this.isSendVC = true
              this.seconds = 120 - currentTime + sendTime
            }
          }
        })
      }
    },
    // 发送验证码
    sendCaptcha() {
      const tf = this.checkPhoneNumber()
      if (!tf) {
        return false
      }
      try {
        this.$http({
          method: "get",
          url: sendEditTelephoneCaptchaMessage,
          data: {
            telephone: this.form.phone
          }
        }).then((res) => {
          if (res.code === 200) {
            sessionStorage.setItem('bindPhoneNum', this.form.phone)
            this.isSendVC = true
          } else {
            Toast(res.message)
          }
        })
      } catch (e) {
        Toast('操作频繁，请稍后重试')
      }
    },
    // 检验手机
    checkPhoneNumber() {
      if (!this.form.phone) {
        Toast('请输入手机号')
        return false
      } else if (!(/^1[3456789]\d{9}$/.test(this.form.phone)) || (this.form.phone.length != 11 && this.form.phone)) {
        Toast('手机号格式不正确')
        return false
      }
      return true
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-account-binding {
  height: 100%;
  .v-personal-account {
    width: 320px;
    margin: 80px auto 0;
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
}
</style>