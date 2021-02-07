<template>
  <div class="v-personal-account-register">
    <label for="account" class="my_input" style="margin-bottom: 15px">
      <img class="icon" src="~assets/images/account/phoneNumber@2x.png" alt="">
      <input v-model="form.phone" type="text" id="account" placeholder="请输入手机号">
    </label>
    <label for="verificationCode" class="my_input" style="margin-bottom: 15px;position: relative">
      <img class="icon" src="~assets/images/account/verificationCode@2x.png" alt="">
      <input v-model="form.captcha" type="text" id="verificationCode" placeholder="请输入验证码">
      <div @click.prevent="sendCaptcha" v-if="!isSendVC" class="sendBtn">发送验证码</div>
      <div v-else class="sentWord">已发送（{{seconds}}s）</div>
    </label>
    <label for="password" class="my_input" style="margin-bottom: 30px">
      <img class="icon" src="~assets/images/account/password@2x.png" alt="">
      <input v-model="form.password" type="password" id="password" placeholder="请设置您的密码">
    </label>
    <div class="login" @click="login">登录</div>
    <div class="operate" style="margin-bottom: 40px">
      <router-link to="/personal/account/login">账号登录</router-link>
      <router-link to="/personal/account/foundCode1">忘记密码</router-link>
    </div>
  </div>
</template>

<script>
  import { handleCrypt } from '@/utils/handleCrypt'
  import { myStorage } from '@/utils/cache'
  import { Toast } from "vant";
  import { sendRegisterCaptchaMessage, registerByShortMessage, login, findSmsSendTime } from '@/configs/interface'
  export default {
    name: "register",
    data() {
      return {
        isSendVC: false,
        seconds: 120,
        form: {
          phone: '',
          captcha: '',
          password: '',
        }
      }
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
      }
    },
    mounted() {
      this.calculateTime()
    },
    methods: {
      // 登录
      login() {
        if (!this.checkPhoneNumber()) {
          return
        }
        if (!this.form.captcha) {
          Toast('请输入验证码')
          return
        } else if (!(/^\d{6}$/.test(this.form.captcha))) {
          Toast('验证码格式错误')
          return
        }
        if (!this.form.password) {
          Toast('密码不能为空')
          return false
        }
        if (!(this.form.password.length <= 18 && this.form.password.length >= 6)) {
          Toast('请输入6-18位密码')
          return false
        }
        const obj = {
          telephone: this.form.phone,
          captcha: this.form.captcha,
          password: handleCrypt.encrypt(this.form.password),
        }
        this.$http({
          method: "post",
          url: registerByShortMessage,
          data: obj
        }).then((res) => {
          if (res.code === 200) {
            // 自动登录
            const formData = new FormData()
            const phoneNum = sessionStorage.getItem('RePhone')
            const password = obj.password
            formData.append('loginMode', 0)
            formData.append('username', phoneNum)
            formData.append('password', password)
            this.$http({
              method: "post",
              url: login,
              data: formData
            }).then((result) => {
              if (result.code === 200) {
                myStorage.set('token', result.data.token)
                myStorage.set('userData', result.data)
                this.$router.push({
                  name: 'personal',
                })
              } else {
                Toast(result.message)
              }
            })
          } else {
            Toast(res.message)
          }
        })
      },
      // 倒计时计算
      calculateTime() {
        if (sessionStorage.getItem('RePhone')) {
          this.form.phone = sessionStorage.getItem('RePhone')
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
            url: sendRegisterCaptchaMessage,
            data: {
              telephone: this.form.phone
            }
          }).then((res) => {
            if (res.code === 200) {
              sessionStorage.setItem('RePhone', this.form.phone)
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
  }
</script>

<style lang="scss">
  .v-personal-account-register {
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
      width: 319px;
      height: 44px;
      background: rgba(247, 250, 255, 1);
      border-radius: 7px;
      box-sizing: border-box;
      padding: 0 4px 0 10px;

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

    .sendBtn {
      width: 85px;
      height: 30px;
      border: 1px solid rgba(255, 49, 98, 1);
      border-radius: 15px;
      font-size: 14px;
      color: rgba(255, 49, 98, 1);
      line-height: 30px;
      text-align: center;
    }

    .sentWord {
      font-size: 14px;
      color: #FF3162;
    }
  }
</style>