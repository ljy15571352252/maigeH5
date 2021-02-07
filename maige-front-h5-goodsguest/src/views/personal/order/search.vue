<template>
  <div class="v-personal-ordersearch">
    <div class="nav">
      <van-icon class="left_icon" name="arrow-left" @click="$router.go(-1)" />
      <van-search
        class="search_bar"
        v-model="result"
        placeholder="商品名称/商品编号/订单号"
        shape="round"
        left-icon="search"
        background="transparent"
        @search="onSearch"
        @focus="focusChange"
        clearable
        :show-action="showSearch"
      >
        <div v-if="showSearch" class="search_text" slot="action" @click="onSearch">搜索</div>
      </van-search>
    </div>
    <div v-if="showSearch">
      <div class="search_title">
        <span>最近搜索</span>
        <img class="delete_icon" @click="clearSearch" src="~assets/images/order/delete.png" />
      </div>
      <div class="search_content">
        <div :key="index" v-for="(item, index) in searchHistory" @click="chooseItem(item, index)">
          <div class="search_item one-txt-cut">{{item}}</div>
          <van-divider :style="{ margin: '0' }" />
        </div>
      </div>
    </div>
    <div v-if="!showSearch" class="show_search">
      <searchcontent :keyWordValue="result" />
    </div>
    <!-- 回到顶部组件 -->
    <back-top />
  </div>
</template>

<script>
/**
 * 搜索订单的页面
 */
import { myStorage } from "@/utils/cache.js";
import searchcontent from "@/views/personal/order/content/searchcontent.vue";
// 搜索的订单列表
export default {
  name: "ordersearch",
  data() {
    return {
      // 搜索结果
      result: "",
      // 搜索历史数组
      searchHistory: [],
      // 是否展示搜索页面
      showSearch: true
    };
  },
  created() {
    this.searchHistory = myStorage.get("searchHistory") || [];
  },
  components: {
    searchcontent
  },
  methods: {
    // 确认搜索结果
    onSearch() {
      if (!this.searchHistory.includes(this.result)) {
        this.searchHistory.unshift(this.result);
      } else {
        let index = this.searchHistory.indexOf(this.result);
        this.searchHistory.splice(index, 1);
        this.searchHistory.unshift(this.result);
      }
      myStorage.set("searchHistory", this.searchHistory);
      this.showSearch = false;
    },
    // 清空搜索结果
    clearSearch() {
      this.searchHistory = [];
      myStorage.set("searchHistory", []);
    },
    // 选择某个选项
    chooseItem(item, index) {
      this.result = item;
      this.searchHistory.splice(index, 1);
      this.searchHistory.unshift(item);
      myStorage.set("searchHistory", this.searchHistory);
      this.showSearch = false;
    },
    // 输入框捕捉焦点时隐藏商品
    focusChange() {
      this.showSearch = true;
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-ordersearch {
  background: #fff;
  padding-top: 60px;
  height: 100vh;
  overflow: auto;
  .nav {
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: linear-gradient(
      45deg,
      rgba(255, 58, 67, 1) 0%,
      rgba(255, 49, 98, 1) 100%
    );
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 999;
    .left_icon {
      font-size: 17px;
      color: #fff;
    }
    .search_bar {
      flex: 1;
      .search_text {
        color: #fff;
        font-size: 15px;
      }
    }
  }
  .search_title {
    padding: 17px 15px;
    background: #f7faff;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .delete_icon {
      width: 15px;
      height: 15px;
    }
  }
  .search_content {
    padding-left: 15px;
    height: calc(100vh - 110px);
    .search_item {
      padding: 16px 0;
      color: #666;
      font-size: 14px;
    }
  }
  .show_search {
    margin-top: 15px;
  }
}
</style>

