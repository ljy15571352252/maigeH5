<template>
  <div class="v-personal-order">
    <navbar
      title="我的订单"
      :showLeft="false"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    >
      <template v-slot:left>
        <van-icon @click="() => $router.push({name: 'personal'})" name="arrow-left" />
      </template>
      <template v-slot:right>
        <img class="search_icon" src="~assets/images/order/search.png" @click="toSearch" />
        <!-- <img class="msg_icon" src="~assets/images/order/msg.png" /> -->
      </template>
    </navbar>
    <van-tabs v-model="currentActive" :border="false" :offset-top="55" sticky>
      <van-tab :title="tab.name" :name="tab.value" :key="tab.value" v-for="(tab) in tabData">
        <!-- <img class="activity_img" src="~assets/images/order/zhouzhou.png" /> -->
        <searchcontent :current="currentActive" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
/**
 * 订单管理
 */
// 头部nav栏
import navbar from "@/components/navbar/nav.vue";
import searchcontent from "@/views/personal/order/content/searchcontent.vue";
export default {
  name: "ordermanager",
  data() {
    return {
      // 当前激活的选项
      currentActive: this.$route.query.tabValue || 0,
      // tab栏的信息
      // 请求查询列表的参数 (1-待付款；2-待发货；3-待收货；4-待评价；5-已完成；6-售后服务；8-已取消；9-已评价；10-我的兑换
      tabData: [
        {
          name: "全部",
          value: 0
        },
        {
          name: "待付款",
          value: 1
        },
        {
          name: "待发货",
          value: 2
        },
        {
          name: "待收货",
          value: 3
        },
        {
          name: "待评价",
          value: 4
        },
        {
          name: "已完成",
          value: 5
        },
        {
          name: "已取消",
          value: 8
        }
        // {
        //   name: "售后",
        //   value: 6
        // }
      ]
    };
  },
  components: {
    navbar,
    searchcontent
  },
  methods: {
    // 去往搜索页
    toSearch() {
      this.$router.push({
        name: "orderSearch"
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-order {
  height: 100%;
  background-color: $lightColor;
  height: 100vh;
  overflow: auto;
  .search_icon {
    width: 18px;
    height: 18px;
    margin-right: 16px;
  }
  .msg_icon {
    width: 18px;
    height: 18px;
  }
  .van-tabs__wrap {
    height: 60px;
  }
  // 修改active样式
  .van-tabs__line {
    position: absolute;
    bottom: 10px;
    left: 0px;
    z-index: 1;
    height: 20px;
    background-color: transparent;
    background: url("~assets/images/home/huxian.png") no-repeat;
  }
  .van-tab {
    color: #454545;
    line-height: 60px;
  }
  .van-tab--active {
    color: #f74854;
  }
  .activity_img {
    margin: 10px;
    width: 357px;
    height: 50px;
  }
  .van-tab__pane {
    padding-top: 60px;
  }
}
</style>