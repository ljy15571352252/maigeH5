<template>
  <div class="v-cart-content-recommend">
    <van-list
      v-model="isUpLoading"
      :finished="upFinished"
      :offset="-200"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-tabs
        v-model="currentActive"
        :border="false"
        @change="tabChange"
        @click="clickTab"
        :animated="true"
        :offset-top="55"
        sticky
      >
        <van-tab :name="3" title="为你推荐">
          <div class="content_box">
            <div class="recommend_content">
              <recommenditem :item="item" :key="index" v-for="(item, index) in tabData" />
            </div>
            <div v-if="!isUpLoading && !upFinished" class="load_more" @click="onLoad">查看更多</div>
          </div>
        </van-tab>
        <van-tab :name="1" title="看了又看">
          <div class="content_box">
            <div class="recommend_content">
              <recommenditem :item="item" :key="index" v-for="(item, index) in tabData" />
            </div>
            <div v-if="!isUpLoading && !upFinished" class="load_more" @click="onLoad">查看更多</div>
          </div>
        </van-tab>
        <van-tab :name="2" title="猜你喜欢">
          <div class="content_box">
            <div class="recommend_content">
              <recommenditem :item="item" :key="index" v-for="(item, index) in tabData" />
            </div>
            <div v-if="!isUpLoading && !upFinished" class="load_more" @click="onLoad">查看更多</div>
          </div>
        </van-tab>
      </van-tabs>
    </van-list>
  </div>
</template>

<script>
/**
 * 为你推荐/热销排行/猜你喜欢功能模块
 */
// 接口
import { threeModule } from "@/configs/interface.js";
import recommenditem from "@/views/cart/content/recommenditem.vue";
export default {
  name: "recommend",
  data() {
    return {
      // 渲染商品
      tabData: [],
      // 当前激活的选项为为你推荐（同类排行）
      currentActive: 3,
      isUpLoading: false, // 上拉加载
      upFinished: false, //上拉加载完毕
      showNumber: 4 // 最终加载的数据条数
    };
  },
  props: {},
  created() {},
  components: {
    recommenditem
  },
  methods: {
    // 激活的标签改变时的函数
    tabChange(name, title) {},
    // 点击tab标签时的函数
    clickTab(name, title) {
      if (title) {
        // 如果是点击tab则重置showNumber
        this.showNumber = 4;
      }
      this.isUpLoading = true;
      this.upFinished = false;
      this.$http({
        method: "get",
        url: threeModule,
        data: {
          catId: "",
          goodsName: "",
          showNumber: this.showNumber,
          typeCode: name
        }
      }).then(res => {
        this.isUpLoading = false;
        this.tabData = res;
        this.showNumber = this.showNumber + 4;
        if (this.tabData.length <= 0) {
          this.upFinished = true;
        }
      });
    },
    // 上拉调用此函数
    onLoad() {
      this.isUpLoading = true;
      this.upFinished = false;
      window.setTimeout(() => {
        this.clickTab();
      }, 1000);
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-cart-content-recommend {
  padding-bottom: 20px;
  .van-tabs__wrap {
    height: 50px;
  }
  .van-tabs__content{
    overflow: initial;
  }
  // 修改active样式
  .van-tabs__line {
    position: absolute;
    bottom: 10px;
    left: 11px;
    z-index: 1;
    height: 20px;
    background-color: transparent;
    background: url("~assets/images/home/huxian.png") no-repeat;
  }
  .van-tab--active {
    color: #f74854;
  }
  .recommend_content {
    width: 355px;
    margin: 10px auto 0;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    color: #333;
  }
  .load_more {
    width: 100vw;
    padding: 10px 0;
    text-align: center;
    color: #999;
    margin-bottom: -20px;
    font-size: 14px;
  }
}
</style>

