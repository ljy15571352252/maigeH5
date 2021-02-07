<template>
  <div class="v-personal">
    <div class="bg_header">
      <div class="message">
        <span class="Customer">
          <img src="~assets/images/personal/Customer.png" alt />
          客服中心
        </span>
        <span class="phone">
          <img src="~assets/images/personal/phone.png" alt />
          400-666-999
        </span>
        <span class="msg">
          <img src="~assets/images/personal/message.png" alt />
          消息
        </span>
      </div>
      <div class="portrait">
        <img :src="userData.headImgUrl" alt class="title_img" @click="Settings" v-if="userData" />
        <img
          src="~assets/images/personal/portrait.png"
          alt
          class="title_img"
          v-else
          @click="Settings"
        />
        <div class="title-name" @click="Settings" v-if="userData">
          <span>{{userData.userName}}</span>
          <div>
            <img src="~assets/images/personal/garden.png" alt />
            升级会员
            <span class="arrow"></span>
          </div>
        </div>
        <div class="gologin" @click="Settings" v-else>你好！请登录~</div>
        <div class="upgrade">
          <img src="~assets/images/personal/rockets.png" />
          <span class="people">升级个人账户</span>
        </div>
      </div>
      <!-- <router-link to="/personal/myOrder">
        我的订单
      </router-link>
      <router-link to="/personal/account">
        账户
      </router-link>-->
    </div>

    <div class="content-div">
      <!-- 操作栏 -->
      <div class="top-operation">
        <ul>
          <li v-for="(item,index) in personalData" :key="index">
            <img :src="item.url" alt />
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <!-- 资金管理 -->
      <div class="money" v-if="myAccountTopTwo.length > 0">
        <div class="money-titile">
          <span>个人资金管理</span>
         <router-link :to="{name: 'fundmanagement'}">
            <span class="right-span">
              更多<span class="arrow"></span>
            </span>
          </router-link>
        </div>
        <div class="money-tent">
          <ul>
            <li v-for="item in myAccountTopTwo" :key="item.accountId">
              <img :src="item.accountLogo" alt="">
              <div>
                <span>{{item.balanceCount}}</span>
                <span>{{item.accountName}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 企业资金管理 -->
      <!-- <div class="money">
        <div class="money-titile">
          <span>企业资金管理</span>
          <span class="right-span">
            001/销售部/杨军/销售总监
            <span class="arrow"></span>
          </span>
        </div>
        <div class="acquisition">
          <ul>
            <li v-for="(item,index) in enterpriseArr" :key="index">
              <img :src="item.url" alt="">
              <span>{{item.name}}</span>
              <span>{{item.num}}</span>
            </li>
          </ul>
        </div>
      </div>-->

      <!-- 待办事项 -->
      <div class="money">
        <div class="money-titile">
          <span>待办事项</span>
          <span class="right-span">
            更多
            <span class="arrow"></span>
          </span>
        </div>
        <div class="todo">
          <ul>
            <li v-for="(item,index) in todoArr" :key="index">
              <img :src="item.url" alt />
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 订单中心 -->
      <div class="money order">
        <div class="money-titile">
          <span>订单中心</span>
          <span class="right-span" @click="ordercenter">
            查看订单中心
            <span class="arrow"></span>
          </span>
        </div>
        <div class="todo">
          <ul>
            <li
              @click.stop="orderLinkTo(item.value)"
              v-for="(item,index) in orderArr"
              :key="index"
              class="order-li"
            >
              <img :src="item.url" alt />
              <span>{{item.name}}</span>
            </li>
            <li @click.stop="toAfterSale()" class="order-li">
              <img src="~assets/images/personal/aftersales.png" />
              <span>售后</span>
            </li>
          </ul>
        </div>
        <!-- <div class="logistics">
          <div class="latest">
            <span>最新物流</span>
            <span>2019-10-17 16:50:25</span>
          </div>
          <div class="information">
            <img src="~/assets/images/personal/favorites.png" />
            <div class="ordernumber">
              <div>
                订单号：66668888999912
                <span class="status">已签收</span>
              </div>
              <span class="describe">已签收，签收人凭取货码签收。</span>
            </div>
          </div>
        </div>-->
      </div>

      <!-- 我的工具 -->
      <div class="money">
        <div class="money-titile">
          <span>我的工具</span>
          <span class="right-span">
            更多
            <span class="arrow"></span>
          </span>
        </div>
        <div class="todo">
          <ul>
            <li v-for="(item,index) in todoArr" :key="index">
              <img :src="item.url" alt />
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="tab_search">
      <selecttab />
    </div>
    <!-- 回到顶部组件 -->
    <back-top />
  </div>
</template>

<script>
// 精选商品
import productcell from "views/home/content/productcell.vue";
import { myStorage } from "@/utils/cache.js";
import selecttab from "@/views/home/content/selecttab.vue";
import { findUserAllAccountInfo } from "@/configs/interface.js";
export default {
  data() {
    return {
      myAccountTopTwo: [], // 我的前两个账户
      //用户信息
      userData: "",
      // 精选当前的tab栏
      currentTab: 1,
      personalData: [
        {
          name: "收藏夹",
          url: require("@/assets/images/personal/favorites.png")
        },
        {
          name: "关注店铺",
          url: require("@/assets/images/personal/focuson.png")
        },
        {
          name: "浏览记录",
          url: require("@/assets/images/personal/record.png")
        },
        {
          name: "红包卡卷",
          url: require("@/assets/images/personal/envelope.png")
        }
      ],
      enterpriseArr: [
        {
          name: "营销品余额",
          url: require("@/assets/images/personal/yingxiao.png"),
          num: 3650
        },
        {
          name: "福利余额",
          url: require("@/assets/images/personal/fuli.png"),
          num: 2688
        },
        {
          name: "办公用品余额",
          url: require("@/assets/images/personal/bangongyongpin.png"),
          num: 1988
        }
      ],
      todoArr: [
        {
          name: "我的申请",
          url: require("@/assets/images/personal/shenqing.png")
        },
        {
          name: "我的审批",
          url: require("@/assets/images/personal/shenpi.png")
        },
        {
          name: "我的考勤",
          url: require("@/assets/images/personal/kaoqin.png")
        },
        {
          name: "我的客户",
          url: require("@/assets/images/personal/kehu.png")
        }
      ],
      orderArr: [
        {
          name: "待付款",
          url: require("@/assets/images/personal/payment.png"),
          value: 1
        },
        {
          name: "待发货",
          url: require("@/assets/images/personal/dropshipping.png"),
          value: 2
        },
        {
          name: "待收货",
          url: require("@/assets/images/personal/collecting.png"),
          value: 3
        },
        {
          name: "已完成",
          url: require("@/assets/images/personal/complete.png"),
          value: 5
        },
        {
          name: "已取消",
          url: require("@/assets/images/personal/cancel.png"),
          value: 8
        }
      ],
      toolArr: [
        {
          name: "促销优惠",
          url: require("@/assets/images/personal/cuxiaoyouhui.png")
        },
        {
          name: "领卷中心",
          url: require("@/assets/images/personal/lingquanzhongxin.png")
        },
        {
          name: "新品需求",
          url: require("@/assets/images/personal/xinpinxuqiu.png")
        },
        {
          name: "申请开票",
          url: require("@/assets/images/personal/shenqingkaipiao.png")
        }
      ],
      // tab栏渲染数组
      tabData: [
        { title: "精选", subtitle: "猜你喜欢", id: 1 },
        { title: "生活", subtitle: "居家日用", id: 2 },
        { title: "电器", subtitle: "3C电器", id: 3 },
        { title: "时尚", subtitle: "美妆穿搭", id: 4 },
        { title: "办公", subtitle: "上班专用", id: 5 },
        { title: "食品", subtitle: "精选食品", id: 6 }
      ]
    };
  },
  methods: {
    // 获取账户资金信息
    findUserAllAccountInfo(userId) {
      this.$http({
        method: 'GET',
        url: findUserAllAccountInfo,
        data: {userId}
      }).then((res) => {
        if (res.code === 200) {
          if (res.data) {
            if (res.data.length > 1) {
              this.myAccountTopTwo = res.data.slice(0, 2)
            } else {
              this.myAccountTopTwo = res.data
            }
          }
        }
      })
    },
    // 点击切换tab栏时的变化函数
    tabsClick(name, title) {
      this.currentTab = name;
    },
    // 订单中心链接跳转
    orderLinkTo(value) {
      this.$router.push({
        name: "orderManage",
        query: {
          tabValue: value
        }
      });
    },
    // 去往售后
    toAfterSale() {
      this.$router.push("/personal/aftersale");
    },
    //个人资料
    Settings() {
      if (this.userData) {
        this.$router.push({
          name: "personalSettings"
        });
      } else {
        this.$router.push({
          path: "/personal/account"
        });
      }
    },
    //订单
    ordercenter() {
      this.$router.push({
        name: "orderManage"
      });
    },
    // 点击商品跳转详情页
    toDetail(item) {
      this.$router.push({
        name: "productnormal",
        query: {
          id: item.id,
          type: "buy"
        }
      });
    },
    // 点击找相似操作
    findSimilar(item) {
      console.log(item);
    }
  },
  mounted() {
    const data = myStorage.get("userData");
    if (data) {
      this.userData = data;
      this.findUserAllAccountInfo(this.userData.userId) // 获取用户账户信息
    }
  },
  components: {
    productcell,
    selecttab
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal {
  height: 100%;
  background-color: $lightColor;
  overflow: auto;
  .bg_header {
    width: 100%;
    height: 168px;
    background: url("~assets/images/home/red_bgc.png") no-repeat;
    background-size: contain;
    background-position: center;
    .message {
      padding: 0 10px;
      padding-top: 10px;
      display: flex;
      color: white;
      align-items: center;
      position: relative;
      .Customer {
        display: flex;
        img {
          width: 14px;
          height: 16px;
          margin-right: 5px;
        }
      }
      .phone {
        margin-left: 10px;
        display: flex;
        img {
          width: 15px;
          height: 12px;
          margin-right: 5px;
        }
      }
      .msg {
        display: flex;
        position: absolute;
        right: 10px;
        img {
          margin-right: 5px;
          width: 13px;
          height: 16px;
        }
      }
    }
    .portrait {
      margin-top: 24px;
      padding-left: 20px;
      display: flex;
      position: relative;
      align-items: center;
      .title_img {
        width: 64px;
        height: 64px;
        margin-right: 15px;
        border-radius: 50%;
      }
      .title-name {
        display: flex;
        flex-direction: column;
        span {
          color: #ffffff;
          font-size: 11px;
        }
        span:first-of-type {
          font-size: 18px;
          margin-bottom: 14px;
        }
        div {
          color: #ffffff;
          display: flex;
          align-items: center;
          width: 80px;
          height: 15px;
          text-align: center;
          background: #d93043;
          img {
            width: 15px;
            height: 15px;
            margin-right: 4px;
          }
          .arrow {
            width: 5px;
            height: 5px;
            border-top: 1px solid #ffffff;
            border-right: 1px solid #ffffff;
            transform: rotate(45deg);
            position: relative;
            top: 6px;
            left: 2px;
          }
        }
      }
      .gologin {
        color: #ffffff;
        font-size: 18px;
      }
      .upgrade {
        width: 97px;
        height: 23px;
        background: linear-gradient(
          270deg,
          rgba(255, 50, 96, 1) 0%,
          rgba(255, 102, 127, 1) 99%
        );
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -11.5px;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        .people {
          transform: scale(0.9);
        }
        img {
          width: 10px;
          height: 14px;
          margin-right: 2px;
        }
      }
    }
  }
  .content-div {
    padding: 0 10px;
    position: relative;
    top: -40px;
    .top-operation {
      width: 100%;
      height: 68px;
      background: white;
      border-radius: 6px;
      ul {
        display: flex;
        height: 100%;
        li {
          width: 25%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            width: 14px;
            height: 14px;
          }
          span {
            margin-top: 6.5px;
            color: #454545;
          }
        }
      }
    }
    .money {
      height: 126px;
      margin-top: 10px;
      background: white;
      border-radius: 6px;
      padding: 0 13px;
      position: relative;
      .money-titile {
        height: 43px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ededed;
        font-size: 14px;
        .right-span {
          position: absolute;
          right: 13px;
          color: #b3b3b3;
          .arrow {
            display: inline-block;
            width: 5px;
            height: 5px;
            border-top: 1px solid #b3b3b3;
            border-right: 1px solid #b3b3b3;
            transform: rotate(45deg);
            position: relative;
            top: -3px;
          }
        }
      }
      .money-tent {
        display: flex;
        ul {
          display: flex;
          width: 100%;
          height: 82px;
          li {
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 47px;
              height: 36px;
            }
            div {
              display: flex;
              flex-direction: column;
              margin-left: 16px;
              span:first-child {
                font-size: 15px;
              }
              span:last-of-type {
                font-size: 11px;
                color: #999999;
                margin-top: 3px;
              }
            }
          }
        }
      }
      .acquisition {
        display: flex;
        ul {
          display: flex;
          width: 100%;
          height: 82px;
          li {
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            img {
              width: 24px;
              height: 24px;
            }
            span:first-of-type {
              margin-top: 4px;
            }
            span:last-of-type {
              margin-top: 10px;
              font-size: 15px;
              color: #ff3849;
              font-weight: Medium;
            }
          }
        }
      }
      .todo {
        display: flex;
        ul {
          display: flex;
          width: 100%;
          height: 82px;
          li {
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            img {
              width: 25px;
              height: 25px;
            }
            span:first-of-type {
              margin-top: 11px;
            }
          }
          .order-li {
            img {
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }
    .order {
      height: auto;
      background: white;
      padding-bottom: 13px;
      .logistics {
        padding: 0 14px;
        height: 71px;
        background: #f7faff;
        .latest {
          margin-top: 3px;
          color: #999999;
          span:last-of-type {
            float: right;
          }
        }
        .information {
          margin-top: 10px;
          display: flex;
          img {
            width: 35px;
            height: 35px;
          }
          .ordernumber {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin-left: 7px;
            div {
              position: relative;
              font-size: 12px;
              color: #333333;
              .status {
                position: absolute;
                right: 0;
                color: #ff3849;
              }
              .describe {
                font-size: 11px;
              }
            }
          }
        }
      }
    }
  }
  // 尾部tab栏模块
  .tab_search {
    margin-top: -30px;
    .van-sticky.van-sticky--fixed {
      top: 0 !important;
      background: #fff;
    }
    // tab标签样式修改
    // 未选中tab
    .van-tabs--line .van-tabs__wrap {
      height: 65px;
      .big_title {
        font-size: 12px;
        font-weight: bold;
        color: #333;
        line-height: 30px;
      }
      .small_title {
        font-size: 10px;
        color: #666;
        line-height: 15px;
      }
      //背景颜色
      .van-tabs__nav {
        background: none;
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
    .van-tabs__line {
      position: absolute;
      bottom: 10px;
      left: 2px;
      z-index: 1;
      width: 17px;
      height: 20px;
      background-color: transparent;
      background: url("~assets/images/home/huxian.png") no-repeat;
    }
    .van-tab__pane {
      margin: 10px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>