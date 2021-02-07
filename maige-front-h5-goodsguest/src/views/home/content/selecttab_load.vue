<template>
  <div class="v-home-content-select">
    <van-list v-model="isUpLoading" :finished="upFinished" finished-text="没有更多了" @load="onLoad">
      <van-tabs
        v-model="currentActive"
        :border="false"
        @click="clickTab"
        :animated="true"
        :offset-top="58"
        sticky
      >
        <van-tab
          :name="index"
          :key="item.title"
          :title="item.title"
          v-for="(item, index) in tabData"
        >
          <div slot="title">
            <div class="big_title">{{item.title}}</div>
            <div class="small_title">{{item.subtitle}}</div>
          </div>
          <div class="tab_content" slot="default">
            <productcell
              :key="num"
              v-for="(sub, num) in productData"
              :item="sub"
              @toDetail="toDetail"
              @findSimilar="findSimilar"
            />
          </div>
        </van-tab>
      </van-tabs>
    </van-list>
  </div>
</template>

<script>
/**
 * 员工福利-首页精选tab（通过滚动加载数据）
 */
// 精选商品
import productcell from "views/home/content/productcell.vue";
import { findList, tree } from "@/configs/interface.js";
export default {
  name: "selecttab",
  data() {
    return {
      // tab栏渲染数组
      tabData: [
        {
          title: "精选",
          subtitle: "猜你喜欢",
          id: 0,
          catId: "",
          parentId: "",
          barId: "",
          goodsName: "节日"
        },
        {
          title: "食品",
          subtitle: "精选食品",
          id: 5,
          // catId: "212657030060576768",
          parentId: 1,
          barId: "197418999305211904"
        },
        {
          title: "生活",
          subtitle: "家具厨具",
          id: 1,
          // catId: "212656903921078272",
          parentId: 1,
          barId: "197418995404509184"
        },
        {
          title: "电器",
          subtitle: "家用电器",
          id: 2,
          // catId: "212593206229996830",
          parentId: 1,
          barId: "197418993668067328"
        },
        {
          title: "时尚",
          subtitle: "美妆护肤",
          id: 3,
          // catId: "212656927107190784",
          parentId: 1,
          barId: "197418996880904192"
        }
        // {
        //   title: "办公",
        //   subtitle: "上班专用",
        //   id: 4,
        //   // catId: "212656882366550016",
        //   parentId: 1,
        //   barId: "197418995001856000"
        // },
      ],
      // tab栏商品渲染数组
      productData: [],
      // 精选当前的tab栏
      currentActive: 0,
      // 当前的item
      currentItem: {},
      // 是否已经加载，默认为false
      isUpLoading: false,
      // 是否已经加载完成，默认为false
      upFinished: false,
      pageSize: 20,
      pageIndex: 1
    };
  },
  props: {},
  components: {
    productcell
  },
  created() {
    // this.getTabs();
  },
  methods: {
    // 点击tab切换
    clickTab(name, title) {
      this.currentItem = this.tabData[name];
      this.isUpLoading = true;
      this.upFinished = false;
      this.pageIndex = 1;
      this.pageSize = 4;
      this.$http({
        method: "get",
        url: findList,
        data: {
          catId: this.currentItem.catId,
          parentId: this.currentItem.parentId,
          goodsName: this.currentItem.goodsName,
          barId: this.currentItem.barId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.isUpLoading = false;
        if (res.code === 200) {
          const list = res.data.pageList || [];
          this.productData = list;
          if (list.length <= 0) {
            this.upFinished = true;
          }
        }
      });
    },
    // 上拉刷新
    upload() {
      this.currentItem = this.tabData[this.currentActive];
      this.isUpLoading = true;
      this.upFinished = false;
      if (this.pageIndex == 1) {
        this.pageIndex = this.pageIndex + 1;
      }
      this.$http({
        method: "get",
        url: findList,
        data: {
          catId: this.currentItem.catId,
          parentId: this.currentItem.id,
          barId: this.currentItem.barId,
          goodsName: this.currentItem.goodsName,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.isUpLoading = false;
        if (res.code === 200) {
          const list = res.data.pageList || [];
          this.productData = this.productData.concat(list);
          this.pageIndex = this.pageIndex + 1;
          this.$forceUpdate();
          if (list.length <= 0) {
            this.upFinished = true;
          }
        }
      });
    },
    // 异步更新查询商品的数据
    onLoad() {
      setTimeout(() => {
        this.upload();
      }, 1000);
    },
    // 点击商品跳转详情页
    toDetail(item) {
      this.$router.push({
        name: "productnormal",
        query: {
          id: item.goodsId,
          type: "buy"
        }
      });
    },
    // 点击找相似操作
    findSimilar(item) {
      // console.log(item);
    },
    // 查找精选的tab标签栏
    getTabs() {}
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-home-content-select {
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
  }
  .tab_content {
    display: flex;
    flex-wrap: wrap;
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
</style>