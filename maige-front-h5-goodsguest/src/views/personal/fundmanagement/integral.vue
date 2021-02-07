<template>
  <div class="v-personal-fundmanagement-integral">
    <div class="bg_header">
      <navbar title="我的积分" color="#fff"></navbar>
    </div>
    <div class="userData">
      <div class="pf-top flex_start">
        <i class="avantar">
          <img class="img_icon" :src="userData.headImgUrl" alt />
        </i>
        <div>
          <p class="userName">{{userData.userName}}</p>
          <p
            class="userPhone"
          >{{userData.telephone && userData.telephone.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')}}</p>
        </div>
      </div>
      <div class="pf-bottom flex_between">
        <div class="pf-left">
          <p class="p1">当前积分</p>
          <p class="balance">￥{{selectedAccount.balanceCount}}</p>
        </div>
        <div class="recharge">去兑换</div>
      </div>
    </div>
    <div class="accountList flex_start">
      <div class="accountItem" @click="selectAccount(item, index)" :class="{selectedItem: itemIndex === index}" v-for="(item, index) in myAccounts" :key="item.id">
        <i class="label"></i>
        <i class="iconWrap"><img class="iconImg" :src="item.accountLogo" alt=""></i>
        <p class="accountName">{{item.accountName}}</p>
      </div>
    </div>
    <div class="banner">
      <img class="img" src="~assets/images/personal/integral_banner@2x.png" alt />
    </div>
    <van-tabs :border="false" @click="clickTab">
      <van-tab title="积分列表"></van-tab>
      <van-tab title="积分记录"></van-tab>
    </van-tabs>
    <ul class="integralList" v-if="recordList.length > 0">
      <li class="flex_between integralItem">
        <div>
          <p class="source">登陆注册</p>
          <p class="time">有效期：2019.08.20-2020.04.15</p>
        </div>
        <p class="number">+2000</p>
      </li>
    </ul>
    <div class="noRecord" v-else>
      <img class="img" src="~assets/images/personal/zanwuneirong@2x.png" alt="">
      <p class="p1">没有记录</p>
    </div>
  </div>
</template>

<script>
/**
 * 我的积分
 */
// 头部的标题栏组件
import navbar from "@/components/navbar/nav";
import { myStorage } from "@/utils/cache.js";
import { findUserAllAccountInfo } from "@/configs/interface.js";
export default {
  name: "integral",
  components: { navbar },
  data() {
    return {
      recordList: [], // 记录列表
      selectedAccount: {}, // 选中的账户
      itemIndex: 0, // 选中的账户索引
      // 我的积分账户
      myAccounts: [],
      // 用户信息
      userData: {}
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化数据
    init() {
      this.userData = myStorage.get("userData");
      this.findUserAllAccountInfo(this.userData.userId);
    },
    // 选中账户
    selectAccount(item, index) {
      this.selectedAccount = item
      console.log(this.selectedAccount)
      this.itemIndex = index
    },
    // 切换
    clickTab(index) {
      if (index === 0) { // 积分列表
        this.recordList = []
      }
    },
    // 跳转账户明细页
    toAccountDetail(item) {
      this.$router.push({
        name: "integral",
        query: {
          accountId: item.accountId,
          balanceType: item.accountType,
          balanceCount: item.balanceCount
        }
      });
    },
    // 获取账户资金信息
    findUserAllAccountInfo(userId) {
      this.$http({
        method: "GET",
        url: findUserAllAccountInfo,
        data: { userId }
      }).then(res => {
        if (res.code === 200) {
          this.myAccounts = res.data;
          this.selectedAccount = this.myAccounts.length > 0 ? this.myAccounts[0] : {}
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-fundmanagement-integral {
  height: 100%;
  background-color: $lightColor;
  overflow-x: hidden;
  overflow-y: auto;
  .accountList::-webkit-scrollbar {
    display: none;
  }
  .accountList {
    width:355px;
    min-height:78px;
    padding: 12px 0;
    margin: 0 auto 12px;
    background:rgba(255,255,255,1);
    opacity:1;
    border-radius:5px;
    box-sizing: border-box;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    .accountItem:not(:last-of-type) {
      border-right: 1px solid #EDEDED;
    }
    .accountItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 24px;
      position: relative;
      .label {
        display: inline-block;
        position: absolute;
        left: 24px;
        top: 6px;
        width:6px;
        height:6px;
        background:rgba(255,48,81,1);
        box-shadow:0px 1px 2px rgba(255,48,81,0.9);
        border-radius:50%;
        visibility: hidden;
      }
      .iconWrap {
        display: inline-block;
        width: 42px;
        height: 42px;
        margin-bottom: 4px;
        .iconImg {
          width: 100%;
          height: 100%;
        }
      }
      .accountName {
        width:72px;
        text-align: center;
        font-family:PingFang SC;
        color:#333;
        @include ellipsis();
      }
    }
    // 选中的样式
    .selectedItem {
      .accountName {
        color: #FF3849;
      }
      .label {
        visibility: visible;
      }
    }
  }
  .integralList {
    width: 352px;
    margin: 0 auto;
  }
  .integralItem {
    background: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    padding: 12px;
    border-radius: 10px;
    margin-bottom: 10px;
    .source {
      font-family: PingFang SC;
      margin-bottom: 4px;
      color: rgba(19, 19, 19, 1);
    }
    .time {
      font-size: 12px;
      font-family: PingFang SC;
      color: rgba(204, 204, 204, 1);
    }
    .number {
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(255, 53, 74, 1);
    }
  }
  .noRecord {
    width: 200px;
    margin: auto;
    .img {
      width: 100%;
    }
    .p1 {
      color: #333;
      text-align: center;
    }
  }
  // 已选中tab
  .van-tab.van-tab--active {
    .big_title {
      color: #ff3945;
      font-size: 14px;
    }
    .small_title {
      color: #ff3945;
    }
  }
  .van-tabs__nav {
    background: transparent;
  }
  .van-tab {
    font-family: PingFang SC;
    color: rgba(51, 51, 51, 1);
  }
  .van-tab--active {
    color: #ff3945;
  }
  .van-tabs__line {
    position: absolute;
    bottom: 20px;
    left: 2px;
    z-index: 1;
    width: 22px !important;
    height: 8px;
    background-color: transparent;
    background: url("~assets/images/home/huxian.png") no-repeat;
    background-size: 100% 100%;
    background-position: center;
  }
  .van-tab__pane {
    margin: 10px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .banner {
    width: 348px;
    height: 90px;
    margin: 0 auto 12px;
    .img {
      width: 100%;
      height: 100%;
    }
  }
  .van-cell__title {
    display: flex;
  }
  .van-cell {
    margin-bottom: 10px;
  }
  .bg_header {
    width: 100%;
    height: 168px;
    background: url("~assets/images/home/red_bgc.png") no-repeat;
    background-size: contain;
    background-position: center;
  }
  .userData {
    width: 355px;
    height: 150px;
    padding: 16px 12px 16px 18px;
    margin: -105px auto 10px;
    background: rgba(255, 255, 255, 1);
    opacity: 1;
    border-radius: 10px;
    .pf-top {
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(221, 228, 236, 1);
      margin-bottom: 12px;
    }
  }
  .avantar {
    width: 54px;
    height: 54px;
    margin-right: 12px;
    border-radius: 50%;
    background: #eee;
    .img_icon {
      width: 54px;
      height: 54px;
      border-radius: 50%;
    }
  }
  .userName {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(19, 19, 19, 1);
    margin-bottom: 4px;
  }
  .userPhone {
    width: 75px;
    font-family: PingFang SC;
    font-size: 12px;
    color: rgba(19, 19, 19, 1);
  }
  .pf-bottom {
    padding: 0 6px;
  }
  .pf-left {
    .p1 {
      font-size: 12px;
      font-family: PingFang SC;
      color: rgba(19, 19, 19, 1);
    }
  }
  .balance {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #ff3847;
    opacity: 1;
  }
  .recharge {
    width: 66px;
    height: 28px;
    line-height: 28px;
    background: rgba(255, 53, 74, 1);
    opacity: 1;
    border-radius: 25px;
    color: #fff;
    text-align: center;
  }
}
</style>