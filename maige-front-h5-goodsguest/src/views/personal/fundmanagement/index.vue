<template>
  <div class="v-personal-fundmanagement">
    <div class="bg_header">
      <navbar title="个人资金" color="#fff"></navbar>
    </div>
    <div class="userData">
      <div class="pf-top flex_start">
        <i class="avantar">
          <img class="img_icon" :src="userData.headImgUrl" />
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
          <p class="p1">个人账户余额</p>
          <p class="balance">￥{{personalMoney}}</p>
        </div>
        <div class="recharge">充值</div>
      </div>
    </div>
    <van-cell @click="toIntegral" value="内容" is-link>
      <!-- 使用 title 插槽来自定义标题 -->
      <template slot="title">
        <img class="icon" src="" />
        <span class="custom-title">我的积分</span>
      </template>
      <template slot="default">
        <span></span>
      </template>
    </van-cell>
    <!--<van-cell value="内容" is-link>
      &lt;!&ndash; 使用 title 插槽来自定义标题 &ndash;&gt;
      <template slot="title">
        <i class="iconWrap"><img class="icon"  src="~assets/images/personal/redpacket@2x.png" alt=""></i>
        <span class="custom-title">我的红包</span>
      </template>
      <template slot="default">
        <span>张</span>
      </template>
    </van-cell>
    <van-cell value="内容" is-link>
      &lt;!&ndash; 使用 title 插槽来自定义标题 &ndash;&gt;
      <template slot="title">
        <i class="iconWrap"><img class="icon"  src="~assets/images/personal/integral@2x.png" alt=""></i>
        <span class="custom-title">我的积分</span>
      </template>
      <template slot="default">
        <span>张</span>
      </template>
    </van-cell>-->
  </div>
</template>

<script>
// 头部的标题栏组件
import navbar from "@/components/navbar/nav";
import { myStorage } from "@/utils/cache.js";
export default {
  name: "index",
  components: { navbar },
  data() {
    return {
      // 个人资金余额
      personalMoney: 0,
      // 个人信息
      userData: {}
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.userData = myStorage.get("userData");
    },
    // 去到积分详情
    toIntegral() {
      this.$router.push({
        name: 'integral',
      })
    },
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-fundmanagement {
  height: 100%;
  background-color: $lightColor;
  .van-cell__title {
    display: flex;
  }
  .van-cell {
    margin-bottom: 10px;
  }
  
  .custom-title {
    font-family: PingFang SC;
    color: rgba(23, 23, 23, 1);
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