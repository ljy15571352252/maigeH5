<template>
  <div class="v-personal-settings-security">
    <navbar
      class="navbar"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    >
      <template v-slot:center>
        <span>账户安全</span>
      </template>>
    </navbar>
    <ul class="list">
      <!--<li class="item flex_between">
        <div>
          <p class="itemName">实名认证</p>
          <p class="itemDesc">完成实名认证，尊享更多服务</p>
        </div>
        <van-icon name="arrow" />
      </li>
      <li class="item flex_between">
        <div>
          <p class="itemName">账号关联</p>
          <p class="itemDesc">可使用手机微信或QQ快速登录员福APP</p>
        </div>
        <van-icon name="arrow" />
      </li>-->
      <li class="item flex_between" @click="toChangePassword">
        <div>
          <p class="itemName">修改登录密码</p>
          <p class="itemDesc">建议您定期更改密码以保护账户安全</p>
        </div>
        <van-icon name="arrow" />
      </li>
      <li class="item flex_between" @click="toChangeBindPhone">
        <div>
          <p class="itemName">修改手机号码</p>
          <p class="itemDesc">若手机更换请尽快修改</p>
        </div>
        <div class="flex">
          <p class="itemDesc">{{phoneNum}}</p>
          <van-icon name="arrow" />
        </div>
      </li>
      <!--<li class="item flex_between">
        <div>
          <p class="itemName">关联邮箱设置</p>
          <p class="itemDesc">可用于账号登录/身份认证等</p>
        </div>
        <van-icon name="arrow" />
      </li>
      <li class="item flex_between">
        <div>
          <p class="itemName">设备管理</p>
          <p class="itemDesc">管理您近期登录过的设备记录</p>
        </div>
        <van-icon name="arrow" />
      </li>-->
    </ul>
    <!--<ul class="list">
      <li class="item flex_between">
        <p class="itemName">帮助中心</p>
        <van-icon name="arrow" />
      </li>
      <li class="item flex_between">
        <p class="itemName">账户申诉</p>
        <div class="flex">
          <p class="itemDesc">无法验证身份？试试自助申诉</p>
          <van-icon name="arrow" />
        </div>
      </li>
      <li class="item flex_between">
        <p class="itemName">注销服务</p>
        <div class="flex">
          <p class="itemDesc">签到免费送积分</p>
          <van-icon name="arrow" />
        </div>
      </li>
      <li class="item flex_between">
        <p class="itemName">会员俱乐部</p>
        <van-icon name="arrow" />
      </li>
    </ul>-->
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
      userData: {},
      phoneNum: "",
      color: "#fff"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getUserdata();
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
    // 去到修改绑定帐户
    toChangeBindPhone() {
      this.$router.push({
        name: "changeBindPhone"
      });
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
.v-personal-settings-security {
  height: 100%;
  background-color: $lightColor;
  overflow: auto;
  padding-top: 60px;
  .navbar {
    background: linear-gradient(
      45deg,
      rgba(255, 58, 67, 1) 0%,
      rgba(255, 49, 98, 1) 100%
    );
  }
  .list {
    margin-bottom: 10px;
    .item:not(:last-of-type) {
      border-bottom: 1px solid #eee;
    }
    .item {
      padding: 12px;
      background: #fff;
      .van-icon {
        color: #bbb;
        font-size: 18px;
      }
      .itemName {
        color: #333;
        font-size: 14px;
        margin-bottom: 2px;
      }
      .itemDesc {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>