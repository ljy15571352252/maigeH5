<template>
  <div class="v-activity-goodfirst">
    <navbar title="好货抢先购" defaultColor="#fff" endColor="#fff" color="#333"></navbar>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide banner" v-for="item in banners" :key="item.imgId">
          <img :src="item.imgUrl" alt />
        </div>
      </div>
      <!-- Add Pagination -->
      <div class="swiper-pagination"></div>
    </div>
    <div class="tab_search">
      <van-tabs
        v-model="currentActive"
        :border="false"
        @click="clickTab"
        :animated="true"
        :offset-top="55"
        sticky
      >
        <van-tab :name="index" :key="item.activityGoodsTypeId" v-for="(item, index) in proList">
          <div slot="title">
            <div class="big_title">{{item.goodsTypeName}}</div>
            <div class="small_title">{{item.goodsTypeImgDesc}}</div>
          </div>
          <div class="tab_content" slot="default">
            <div
              class="product-cell"
              @click="toDetail(data)"
              v-for="data in item.activityHomepageGoodsReturns"
              :key="data.skuId"
            >
              <img v-lazy="data.skuImg" alt />
              <div>
                <h3 class="product_des">{{data.goodsName}}</h3>
                <div class="price_info">
                  <div class="flex_start">
                    <div class="pricenow">¥{{data.salePrice}}</div>
                    <del class="priceever">¥{{data.ustomaryPrice}}</del>
                  </div>
                  <!--<span class="find_icon" @click.stop="findSimilar(data)">找相似</span>-->
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
/*
 * 好货抢先购
 */
import { activityGallery, discountActivity } from "@/configs/interface.js";
import { getClickCount } from "@/configs/common.js";
import navbar from "@/components/navbar/nav.vue";
import Swiper from "swiper";
export default {
  name: "goodfirst",
  components: { navbar },
  data() {
    return {
      banners: [], // 头部banner
      proList: [], // 商品列表
      pageNum: 1, // 页码
      currentActive: 0, // 精选当前的tab栏
      isUpLoading: false, // 是否已经加载，默认为false
      upFinished: false // 是否已经加载完成，默认为false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.initSwiper();
      this.getProList();
      this.getBanner();
    },
    // 去到详情页
    toDetail(item) {
      // 统计点击
      getClickCount(item.goodsId);
      this.$router.push({
        name: "productnormal",
        query: {
          id: item.goodsId,
          activityId: this.$route.query.activityId,
          activityGoodsId: item.activityGoodsId,
          activityTypeNum: 9
        }
      });
    },
    // 点击切换
    clickTab() {
      // console.log(index)
    },
    // 获取Banner
    getBanner() {
      this.$http({
        methods: "get",
        url: activityGallery,
        data: {
          activityId: this.$route.query.activityId
        }
      }).then(res => {
        if (res.code === 200) {
          this.banners = res.data;
        }
      });
    },
    // 获取商品列表
    getProList() {
      this.$http({
        methods: "get",
        url: discountActivity,
        data: {
          activityId: this.$route.query.activityId,
          pageNum: this.pageNum,
          pageSize: 10
        }
      }).then(res => {
        if (res.code === 200) {
          this.proList = res.data;
        }
      });
    },
    // 激活轮播效果
    initSwiper() {
      // swiper轮播图
      let swiper = new Swiper(".swiper-container", {
        slidesPerView: 1,
        centeredSlides: true,
        loop: false,
        observer: true,
        observeParents: false,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-activity-goodfirst {
  height: 100%;
  overflow: auto;
  background-color: $lightColor;
  .swiper-container {
    width: 100%;
    height: 130px;
    margin-top: 60px;
    .banner {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .tab_search {
    background-color: #f5f8fc;

    .van-tabs__nav {
      background: #f5f8fc;
    }

    .van-sticky--fixed {
      box-shadow: 0 0 10px #ccc;
    }
  }
  .swiper-pagination-bullet {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(112, 112, 112, 1);
    border-radius: 50%;
    opacity: 0.4;
  }
  .swiper-pagination-bullet-active {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 1);
    border-radius: 50%;
    border-color: #fff;
    opacity: 1;
  }
  // tab标签样式修改
  // 未选中tab
  .van-tabs--line .van-tabs__wrap {
    padding: 4px 0;
    height: 72px;
    background: #f5f8fc;
    .big_title {
      font-size: 14px;
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
    .product-cell {
      width: 173px;
      height: 280px;
      background: #fff;
      padding: 10px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      img {
        max-width: 100%;
        height: 177px;
      }
      .product_des {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        margin-top: 15px;
        font-size: 13px;
        color: #333;
      }
      .price_info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
      }
      .pricenow {
        color: $mainColor;
        font-size: 14px;
        margin-right: 10px;
      }
      .priceever {
        color: #666;
      }
      .find_icon {
        padding: 2px 5px;
        font-size: 9px;
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 8px;
      }
    }
    .product-cell:nth-of-type(2n) {
      margin-left: 10px;
    }
  }
  // 已选中tab
  .van-tab.van-tab--active {
    .big_title {
      color: #ff3945;
      font-size: 16px;
      font-weight: bold;
    }
    .small_title {
      color: #ff3945;
    }
  }
  .van-tabs__nav--line {
    height: auto;
  }
  .van-tabs__line {
    position: absolute;
    bottom: -10px;
    left: 2px;
    z-index: 1;
    width: 17px;
    height: 20px;
    background-color: transparent;
    background: url("~assets/images/home/huxian.png") no-repeat;
    background-position: center 0;
  }
  .van-tab__pane {
    margin: 10px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>