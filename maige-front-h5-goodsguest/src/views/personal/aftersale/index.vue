<template>
  <div class="v-personal-aftersale">
    <navbar
      class="navbar"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    >
      <template v-slot:center>
        <van-dropdown-menu class="drop_menu" active-color="#fff">
          <van-dropdown-item title="售后" ref="item">
            <div class="dropdownWrapper">
              <p class="title">
                下单时间
                <i class="line"></i>
              </p>
              <ul class="times">
                <li
                  @click="chooseTime(index)"
                  :class="{ selected: timeRange === index}"
                  v-for="(item, index) in orderTimes"
                  :key="index"
                >{{item}}</li>
              </ul>
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </template>
    </navbar>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-tabs class="tabs" v-model="active" :swipe-threshold="5" @change="handleTapChange">
        <van-tab title="所有售后"></van-tab>
        <van-tab title="处理中"></van-tab>
        <van-tab title="升级客诉"></van-tab>
        <van-tab title="已取消"></van-tab>
        <van-tab title="申请记录"></van-tab>
      </van-tabs>
      <van-search
        background="transparent"
        v-model="goodsName"
        placeholder="请输入商品名称"
        show-action
        shape="round"
        @search="onSearch"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <component
        :is="dataArr[active].name"
        ref="children"
        :goodsName="goodsName"
        :timeRange="timeRange"
      ></component>
    </van-pull-refresh>
    <!-- 回到顶部组件 -->
    <back-top />
  </div>
</template>

<script>
//引入 tabar
import navbar from "components/navbar/nav";
import apply from "./routercomponents/apply"; //所有售后
import processing from "./routercomponents/processing"; //进行中售后
import upgrade from "./routercomponents/upgrade"; //售后升级客诉
import rate from "./routercomponents/rate"; //已取消售后
import record from "./routercomponents/record"; //申请记录
export default {
  name: "index",
  components: {
    navbar,
    apply,
    processing,
    upgrade,
    rate,
    record
  },
  data() {
    return {
      goodsName: "", // 搜索关键词
      active: 0, // 切卡激活索引
      loading: false, //下拉刷新
      dataArr: [
        { name: apply },
        { name: processing },
        { name: upgrade },
        { name: rate },
        { name: record }
      ],
      timeRange: 0,
      orderTimes: [
        "全部",
        "1个月内",
        "1-3个月",
        "3-6个月",
        "6个月至1年",
        "1年以上"
      ]
    };
  },
  mounted() {},
  watch: {},
  methods: {
    // 下拉调用此函数
    onRefresh() {
      window.setTimeout(() => {
        // 这里等请求成功之后isLoading设为false
        this.$refs.children.pageIndex = 1;
        this.$refs.children.pageSize = 10;
        const that = this;
        setTimeout(function() {
          that.loading = false;
          that.$refs.children.getAllafters();
        });
      }, 1000);
    },
    //点击切换
    handleTapChange(val) {
      this.goodsName = "";
      this.active = val;
    },
    // 选择时间
    chooseTime(index) {
      console.log(index);
      this.timeRange = index;
      this.$refs.item.toggle(); //关闭下拉
      this.$refs.children.getAllafters();
    },
    // 搜索售后
    onSearch() {
      this.$refs.children.getAllafters();
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-aftersale {
  height: 100%;
  background-color: $lightColor;
  overflow: auto;
  padding-top: 60px;
  .drop_menu .van-dropdown-item {
    height: 100vh;
  }
  // 头部下拉
  .van-dropdown-menu {
    background: transparent;
    .van-ellipsis {
      font-size: 16px;
      color: #fff;
    }
    .van-dropdown-menu__title::after {
      border-color: transparent transparent #fff #fff;
      opacity: 1;
    }
    .van-popup {
      width: 100%;
      height: 174px;
      border-radius: 0 0 10px 10px;
      overflow: hidden;
      .dropdownWrapper {
        padding: 26px 16px 34px;
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: rgba(153, 153, 153, 1);
          margin-bottom: 20px;
          .line {
            margin-left: 26px;
            display: block;
            width: 260px;
            height: 1px;
            background: rgba(247, 250, 255, 1);
          }
        }
        .times {
          display: flex;
          flex-shrink: 0;
          flex-wrap: wrap;
          justify-content: space-between;
          li {
            width: 108px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            background: rgba(247, 250, 255, 1);
            border-radius: 18px;
            margin-bottom: 9px;
            font-size: 12px;
            color: rgba(69, 69, 69, 1);
          }
          .selected {
            background: #ff3849;
            color: #fff;
          }
        }
      }
    }
  }
  [class*="van-hairline"]::after {
    border: none;
  }
  // 切卡
  .tabs {
    padding: 10px 0 8px;
    background: #fff;
    .van-dropdown-menu {
      height: 43px;
      .van-ellipsis {
        font-size: 14px;
      }
    }
    .van-tabs__line {
      height: 14px;
      background: url("~assets/images/home/huxian.png") no-repeat;
      background-size: 18px 6px;
      background-position: center;
    }
    .van-ellipsis {
      color: #333;
    }
    .van-tab--active {
      .van-ellipsis {
        color: #f74854;
      }
      .van-dropdown-menu__title::after {
        border-color: transparent transparent #f74854 #f74854;
      }
    }
  }
  // 搜索
  .van-search {
    padding: 12px 16px;
    .van-search__content {
      background: #fff;
    }
    .van-search__action {
      color: #666;
      margin-left: 16px;
    }
  }
}
</style>