<template>
  <div class="v-category-index">
    <navbar
      class="navbar"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    >
      <template v-slot:center>
        <div class="search">
          <van-search
            placeholder="请输入搜索关键词"
            shape="round"
            background="transparent"
            @click="$router.push('/headsearch')"
          ></van-search>
        </div>
      </template>
      <!--<template v-slot:right>
        <span>···</span>
      </template>-->
    </navbar>
    <div class="ca_content">
      <div class="wrapper wrapper1">
        <van-sidebar v-model="activeKey" @change="handleSidebarChange">
          <van-sidebar-item v-for="item in topCategory" :title="item.barName" :key="item.barId" />
        </van-sidebar>
      </div>
      <div class="wrapper wrapper2">
        <div class="list">
          <!--<div class="banner"><img src="" alt=""></div>-->
          <ul class="item" v-for="item in secondaryCategory" :key="item.barId">
            <li class="classifications">
              <h4 class="title">{{item.barName}}</h4>
              <ul class="types clearfix">
                <li
                  @click="toSearchDetail(item2)"
                  class="type fl"
                  v-for="item2 in item.children"
                  :key="item2.barId"
                >
                  <!--<div class="img_wrap"><img :src="item.imgUrl" alt=""></div>-->
                  <p class="type_name" style="text-align: left">{{item2.barName}}</p>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <!-- 回到顶部组件 -->
        <back-top />
      </div>
    </div>
  </div>
</template>

<script>
import { tree } from "@/configs/interface.js";
// 头部nav栏
import navbar from "@/components/navbar/nav.vue";
export default {
  naem: "category",
  components: { navbar },
  data() {
    return {
      color: "#fff",
      keyWords: "", // 搜索关键词
      activeKey: 0,
      topCategory: [], // 一级分类
      secondaryCategory: [] // 次级分类
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      // 获取一级分类
      this.getTopCategory(1);
    },
    // 一级分类切换获取下级分类
    handleSidebarChange(index) {
      this.secondaryCategory =
        this.topCategory[index] && this.topCategory[index].children;
    },
    // 去搜索详情
    toSearchDetail(item2) {
      this.$router.push({
        name: "searchDetail",
        query: {
          catId: item2.catId,
          barId: item2.barId,
          parentId: item2.parentId
        }
      });
    },
    // 获取分类
    getTopCategory(parentId) {
      this.$http({
        method: "get",
        url: tree,
        data: { parentId }
      }).then(res => {
        if (res.code === 200) {
          this.topCategory = res.data;
          this.handleSidebarChange(0);
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-category-index {
  height: 100%;
  width: 100%;
  padding-top: 60px;
  // 头部操作栏
  .navbar {
    .nav_right span {
      font-weight: bold;
      font-size: 24px;
    }
    .search {
      position: relative;
      flex: 1;
    }
  }

  .ca_content {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .wrapper {
      flex-shrink: 0;
      overflow-y: auto;
      padding-bottom: 60px;
    }
    .wrapper1 {
      padding-right: 9.5px;
      box-sizing: border-box;
      background: #f5f8fc;
      flex-shrink: 0;
      .van-sidebar {
        width: 106px;
        .van-sidebar-item {
          padding-left: 0;
          background: #fff;
          .van-sidebar-item__text {
            padding-left: 17.5px;
            line-height: 16px;
          }
        }
        .van-sidebar-item--select {
          color: #ff215d;
          background: #f5f8fc;
          border: none;
          .van-sidebar-item__text {
            border-left: 3px solid #ff215d;
          }
        }
      }
    }
    // 侧边导航
    .wrapper2 {
      .list {
        padding: 16px 10px;
        .banner {
          width: 240px;
          height: 90px;
          background: #f6f6f6;
          margin-bottom: 10px;
          border-radius: 2.5px;
        }
        .item {
          width: 240px;
          margin-bottom: 10px;
          border-radius: 2.5px;
          box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 0.3);
          padding: 20px 10px 0 10px;
          box-sizing: border-box;
          .classifications {
            .title {
              font-size: 14px;
              font-family: Microsoft YaHei;
              color: #333;
              margin-bottom: 10px;
              font-weight: bold;
            }
            .type {
              margin-bottom: 20px;
              .img_wrap {
                width: 60px;
                height: 60px;
                background: #f6f6f6;
                margin-bottom: 7px;
              }
              .type_name {
                width: 61px;
                text-align: center;
                font-size: 12px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                @include ellipsis;
              }
            }
            .type:not(:nth-of-type(3n)) {
              margin-right: 18px;
            }
          }
        }
      }
    }
  }
}
</style>