<template>
  <div class="v-product-content-recommend">
    <van-tabs
      v-model="currentActive"
      :border="false"
      @change="tabChange"
      @click="clickTab"
      :animated="true"
    >
      <van-tab :name="3" title="为你推荐">
        <recommendcontent :tabData="tabData" />
      </van-tab>
      <van-tab :name="1" title="看了又看">
        <recommendcontent :tabData="tabData" />
      </van-tab>
      <van-tab :name="2" title="猜你喜欢">
        <recommendcontent :tabData="tabData" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
/**
 * 为你推荐/热销排行/猜你喜欢功能模块
 * 参数说明: paramter 父组件传过来的商品信息
 */
// 商品区域（带轮播）
import recommendcontent from "@/views/product/content/recommendcontent.vue";
// 接口
import { threeModule } from "@/configs/interface.js";
export default {
  name: "recommend",
  data() {
    return {
      // 渲染商品
      tabData: [],
      // 当前激活的选项为为你推荐（同类排行）
      currentActive: 3,
      // 商品的信息(父组件传过来)
      goodsData: {}
    };
  },
  props: {
    paramter: {
      default: {}
    }
  },
  watch: {
    paramter: {
      handler(newValue) {
        this.goodsData = JSON.parse(JSON.stringify(newValue));
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.clickTab(this.currentActive);
  },
  components: {
    recommendcontent
  },
  methods: {
    // 激活的标签改变时的函数
    tabChange(name, title) {},
    // 点击tab标签时的函数
    clickTab(name) {
      this.$http({
        method: "get",
        url: threeModule,
        data: {
          catId: this.goodsData.catId,
          goodsName: this.goodsData.goodsName,
          showNumber: 6,
          typeCode: name
        }
      }).then(res => {
        this.tabData = res;
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-product-content-recommend {
  .van-tabs__wrap {
    height: 50px;
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
}
</style>

