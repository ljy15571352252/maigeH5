<template>
  <div class="v-personal-account-registerAgreement">
    <navbar
      :showLeft="false"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    >
      <template v-slot:left>
        <span @click="$router.go(-1)" style="color: #fff; font-size: 26px" class="back">
          <van-icon name="arrow-left" />
        </span>
      </template>
      <template v-slot:center>
        <span style="color: #fff">注册协议</span>
      </template>
    </navbar>
    <div id="agreement">
      <p class="fontSize margin1 strong">[审慎阅读]</p>
      <p class="fontSize grey margin1">您在申请注册流程中点击同意前应当认真阅读以下协议。请您务必审慎阅读、充分理解协议 中相关条款内容，其中包括:</p>
      <div class="margin1">
        <p class="fontSize strong indent1 underline margin0">1、与您约定免除或限制责任的条款；</p>
        <p class="fontSize strong indent1 underline margin0">2、与您约定法律话用和管辖的条款；</p>
        <p class="fontSize strong indent1 underline margin0">3、其他以粗体下划线标识的重要条款。</p>
      </div>
      <p class="margin2 fontSize">如您对协议有任何疑问，可向平台客服咨询。</p>
      <p class="margin1 strong fontSize">[特别提示]</p>
      <p class="margin2 grey fontSize">
        当您按照注册页面提示填写信息、阅读并同意协议且完成全部注册程序后，即表示您已充分
        阅读、理解并接受协议的全部内容。如您因平台服务与商城发生争议的，适用《商城平台服务协议》处
        理。如您在使用平台服务过程中与其他用户发生争议的，依您与其他用户达成的协议处理。
      </p>
      <p class="fontSize strong underline margin2">阅读协议的过程中，如果您不同意相关协议或其中任何条款约定，您应立即停止注册程序。</p>
      <router-link to="/personal/agreementDetail">
        <a style="display: block" class="link strong red indent1 margin1 fontSize">《 用户注册协议 》</a>
      </router-link>
    </div>
  </div>
</template>

<script>
import navbar from "components/navbar/nav";
export default {
  name: "agreement",
  components: { navbar },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-account-registerAgreement {
  height: 100%;
  background-color: $lightColor;
  padding-top: 60px;
  // 协议样式
  #agreement {
    line-height: 1.5;
    padding: 24px;
    .margin0 {
      margin-bottom: 4px;
    }
    .margin1 {
      margin-bottom: 8px;
    }
    .margin2 {
      margin-bottom: 16px;
    }
    .strong {
      font-weight: bold;
    }
    .underline {
      text-decoration: underline;
    }
    .indent1 {
      text-indent: 1em;
    }
    .indent2 {
      text-indent: 2em;
    }
    .red {
      color: #ff3262;
    }
    .grey {
      color: #68696b;
    }
    .fontSize {
      font-size: 16px;
    }
  }
}
</style>