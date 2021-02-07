<template>
  <div class="v-personal-Settings">
    <navbar
      :title="'账户设置'"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    ></navbar>
    <van-cell value is-link center to="/personal/Settings/information">
      <!-- 使用 title 插槽来自定义标题 -->
      <template slot="title">
        <div class="avatars">
          <img :src="userData.headImgUrl" alt />
          <div class="custom-title">
            <div>{{userData.userName}}</div>
            <div style="display:flex">账号：{{userData.userAccount}}</div>
          </div>
        </div>
      </template>
    </van-cell>
    <van-cell title="地址管理" is-link @click="address" />
    <!-- <van-cell title="账户和安全" is-link to @click="toAccountSecurity" /> -->
    <van-cell title="支付设置" is-link to />
    <van-cell title="员福会员" is-link to class="line" />
    <van-cell title="功能反馈" is-link to />
    <van-cell title="关于员福APP" is-link to value="V1.2.3" />
    <van-button color="white" class="line" size="large" @click="loginOut">退出登录</van-button>
  </div>
</template>

<script>
// 引入nav栏
import navbar from "@/components/navbar/nav";
import { myStorage } from "@/utils/cache.js";
// 接口
import { logout } from "@/configs/interface.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      //用户数据
      userData: ""
    };
  },
  methods: {
    Settings() {},
    //退出登录
    loginOut() {
      //获取用户数据
      const token = myStorage.get("token");
      this.$http({
        method: "DELETE",
        url: logout,
        data: {
          token: token
        }
      }).then(res => {
        if (res.code == 200) {
          Toast.success(res.message);
          this.$router.push({
            path: "/personal/account/login"
          });
          myStorage.remove("token");
          myStorage.remove("userData");
        }
      });
    },
    toAccountSecurity() {
      this.$router.push({
        name: "accountsecurity"
      });
    },
    //地址管理
    address() {
      this.$router.push({
        name: "Settingsadress"
      });
    }
  },
  components: {
    navbar
  },
  mounted() {
    //获取用户数据
    const data = myStorage.get("userData");
    if (data) {
      this.userData = data;
    }
  }
};
</script>

<style  lang="scss">
@import "@/assets/css/local.scss";
.v-personal-Settings {
  background: $lightColor;
  height: 100%;
  padding-top: 60px;
  .avatars {
    display: flex;
    width: 250px;
    div {
      word-break: keep-all;
    }
    img {
      border-radius: 50%;
      width: 45px;
      height: 45px;
    }
    .custom-title {
      margin-left: 10px;
    }
  }
  .van-cell {
    padding: 13px 16px;
  }
  .line {
    margin-top: 10px;
  }
  .line:last-of-type {
    color: rgba(255, 57, 69, 1) !important;
    width: 100%;
  }
}
</style>