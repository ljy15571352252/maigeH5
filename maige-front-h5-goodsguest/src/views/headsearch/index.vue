<template>
  <div class="v-headSearch">
    <navbar
      class="navbar"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    >
      <template v-slot:center>
        <div class="search">
          <van-search
            v-model="goodsName"
            :placeholder="placeholder"
            shape="round"
            background="transparent"
            @search="Searchkey"
            @input="onInput"
          ></van-search>
        </div>
      </template>
      <template v-slot:right>
        <span @click="search">搜索</span>
      </template>
    </navbar>
    <div v-if="!goodsName" class="search_tip">
      <div v-if="recentSearchgoodsName.length > 0">
        <div class="lastestSearch">
          <span class="title">最近搜索</span>
          <i @click="clearHistorySearch">
            <img src="~assets/images/headsearch/icon_delete@2x.png" alt />
          </i>
        </div>
        <ul class="clearfix">
          <li
            @click="clickgoodsNameSearch(item)"
            class="item fl"
            v-for="(item, index) in recentSearchgoodsName"
            :key="index"
          >{{item}}</li>
        </ul>
      </div>
      <p class="title">搜索发现</p>
      <ul class="clearfix">
        <li
          @click="clickgoodsNameSearch(item.itemName)"
          class="item fl"
          v-for="(item, index) in searchDiscover"
          :key="index"
        >{{item.itemName}}</li>
      </ul>
    </div>
    <div v-else class="searchContent">
      <ul class="searchList">
        <li
          @click="clickgoodsNameSearch(item.goodsName)"
          c
          class="searchItem"
          v-for="(item, index) in searchList"
          :key="index"
        >{{item.goodsName}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import navbar from "@/components/navbar/nav.vue";
import { myStorage } from "@/utils/cache";
import { findList } from "@/configs/interface";
export default {
  name: "headSearch",
  components: { navbar },
  data() {
    return {
      timer: null, // 定时器
      recentSearchgoodsName: [], // 最近搜索
      placeholder: "", // 提示词
      searchDiscover: [
        // 搜索发现
        { itemName: "电脑数码用品" },
        { itemName: "沙发" },
        { itemName: "榨汁机" },
        { itemName: "苹果" },
        { itemName: "电饭煲" },
        { itemName: "拉杆箱" },
        { itemName: "水壶" }
      ],
      searchList: [], // 搜索列表
      goodsName: "" // 关键词
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化显示
    init() {
      this.initRecentSearch()
      this.initPlaceholder()
    },
    // 初始化最近搜索
    initRecentSearch() {
      if (myStorage.get("recentSearchgoodsName")) {
        this.recentSearchgoodsName = myStorage.get("recentSearchgoodsName");
      } else {
        this.recentSearchgoodsName = [];
      }
    },
    // 初始化搜索提示词
    initPlaceholder() {
      this.placeholder = this.searchDiscover[0].itemName;
    },
    // 将最近搜索的关键词存储到localStorage
    keepRecentSearchgoodsName() {
      // 已经存储了关键词
      if (myStorage.get("recentSearchgoodsName")) {
        let recentSearchgoodsName = myStorage.get("recentSearchgoodsName");
        recentSearchgoodsName = recentSearchgoodsName.filter(item => {
          // 删除重复关键词
          if (this.goodsName && this.goodsName === item) {
            return false;
          } else if (
            !this.goodsName &&
            this.placeholder &&
            this.placeholder === item
          ) {
            return false;
          } else {
            return true;
          }
        });
        recentSearchgoodsName.unshift(this.goodsName || this.placeholder);
        if (recentSearchgoodsName.length > 18) {
          // 最多存18条搜索记录
          recentSearchgoodsName.pop();
        }
        myStorage.set("recentSearchgoodsName", recentSearchgoodsName);
      } else {
        const recentSearchgoodsName = [];
        recentSearchgoodsName.unshift(this.goodsName || this.placeholder);
        myStorage.set("recentSearchgoodsName", recentSearchgoodsName);
      }
    },
    // 清除历史搜索记录
    clearHistorySearch() {
      this.$dialog
        .confirm({
          cancelButtonColor: "#F74854",
          confirmButtonColor: "#333",
          message: "确认要清空内容吗？"
        })
        .then(() => {
          myStorage.remove("recentSearchgoodsName");
          this.initRecentSearch();
        })
        .catch(() => {});
    },
    // 点击关键击搜索
    clickgoodsNameSearch(goodsName) {
      this.goodsName = goodsName;
      this.search();
    },
    // 搜索
    search() {
      this.keepRecentSearchgoodsName(); // 储存搜索的关键词
      this.$router.push({
        name: "searchDetail",
        query: {
          goodsName: this.goodsName || this.placeholder
        }
      });
    },
    // 调用接口搜索关键词
    searchByGoodsName() {
      if (!this.goodsName) return;
      this.$http({
        method: "get",
        url: findList,
        data: {
          goodsName: this.goodsName,
          pageIndex: 1,
          pageSize: 10
        }
      }).then(res => {
        if (res.code === 200) {
          this.searchList = res.data.pageList;
        }
      });
    },
    // 输入框发生变化触发
    onInput() {
      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.searchByGoodsName();
      }, 500);
    },
    // 搜索关键词
    Searchkey() {
      this.searchByGoodsName();
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-headSearch {
  height: 100%;
  background-color: $lightColor;
  padding-top: 60px;
  .navbar {
    background: linear-gradient(
      45deg,
      rgba(255, 58, 67, 1) 0%,
      rgba(255, 49, 98, 1) 100%
    );
    .search {
      position: relative;
      flex: 1;
      /*.van-search__content {
          flex-shrink: 0;
          width:270px;
          background:rgba(255,255,255,1);
          border-radius:20px;
          .van-cell {
            line-height: 1;
          }
        }*/
    }
    .try_scan,
    .header_msg {
      width: 50px;
      text-align: center;

      img {
        width: 16px;
        height: 16px;
      }

      div {
        color: #fff;
      }
    }
  }
  .search_tip {
    background: #fff;
    padding: 16px;
    .lastestSearch {
      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        width: 12px;
      }
    }
    .title {
      font-size: 14px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 12px;
    }
    ul {
      margin-bottom: 20px;
    }
    .item {
      padding: 0 12px;
      height: 22px;
      line-height: 22px;
      background: rgba(245, 248, 252, 1);
      border-radius: 11px;
      text-align: center;
      font-size: 12px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-left: 10px;
      margin-bottom: 10px;
      @include ellipsis;
    }
  }
  .searchList {
    background: #fff;
    padding-left: 12px;
    position: relative;
    .searchItem {
      height: 42px;
      line-height: 42px;
      position: relative;
      padding-right: 12px;
      list-style: none;
      display: block;
      border-bottom: 1px solid #f0f2f5;
      color: #232326;
      @include ellipsis;
    }
  }
}
</style>