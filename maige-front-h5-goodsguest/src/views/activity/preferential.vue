<template>
  <div class="v-activity-preferential">
    <navbar title="特惠专区" defaultColor="#fff" endColor="#fff" color="#333"></navbar>
    <div class="banner_wrapper">
      <img :src="banner.imgUrl" alt />
    </div>
    <div class="recommend">
      <div class="flex_start title">
        <i>
          <img src="~assets/images/activity/start@2x.png" alt />
        </i>
        <h2>特惠推荐</h2>
      </div>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in recommendArr" :key="index">
            <ul class="recommendList flex_between">
              <li
                @click="toDetail(data)"
                class="recommendItem"
                v-for="data in item"
                :key="data.skuId"
              >
                <div class="label">特惠</div>
                <div class="recommendProImg flex">
                  <img :src="data.skuImg" alt />
                </div>
                <p class="recommendProName">{{data.goodsName}}</p>
                <p class="price">￥{{data.salePrice}}</p>
              </li>
            </ul>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
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
 * 特惠专区
 */
import {
  activityGallery,
  activityGoodsSaleSort,
  discountActivity
} from "@/configs/interface.js";
import { getClickCount } from "@/configs/common.js";
import navbar from "@/components/navbar/nav.vue";
import Swiper from "swiper";
export default {
  name: "preferential",
  components: { navbar },
  data() {
    return {
      banner: {}, // 首页banner
      recommends: [], // 特惠推荐
      proList: [], // 商品列表
      pageNum: 1, // 页码
      currentActive: 0, // 精选当前的tab栏
      list: [] // 轮播商品列表
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    recommendArr() {
      return this.convertToTwoDimensionArray(this.recommends, 3);
    }
  },
  methods: {
    // 初始化
    init() {
      this.initSwiper();
      this.getProList();
      this.getRecommend();
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
          activityTypeNum: 5
        }
      });
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
          this.banner = res.data && res.data[0];
        }
      });
    },
    // 转换二维数组
    convertToTwoDimensionArray(originArr, len) {
      let arr1 = [];
      const arr2 = [];
      if (!(originArr instanceof Array)) return;
      originArr.forEach(item => {
        if (arr1.length < len) {
          arr1.push(item);
        }
        if (arr1.length === len) {
          arr2.push(arr1);
          arr1 = [];
        }
      });
      if (arr1.length > 0) {
        arr2.push(arr1);
      }
      return arr2;
    },
    // 点击切换
    clickTab() {
      // console.log(this.recommendArr)
    },
    // 获取特惠推荐
    getRecommend() {
      this.$http({
        methods: "get",
        url: activityGoodsSaleSort,
        data: {
          rankType: 0,
          activityId: this.$route.query.activityId,
          pageNum: this.pageNum,
          pageSize: 9
        }
      }).then(res => {
        if (res.code === 200) {
          this.recommends = res.data.list;
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
.v-activity-preferential {
  height: 100%;
  overflow: auto;
  background-color: $lightColor;
  // banner
  .banner_wrapper {
    width: 100%;
    height: 130px;
    margin-top: 60px;
    margin-bottom: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  // 特惠推荐
  .recommend {
    width: 345px;
    margin: auto;
    .title {
      margin-bottom: 10px;
      i {
        display: inline-block;
        width: 22px;
        height: 18px;
        margin-right: 6px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      h2 {
        font-size: 18px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
    }
    .swiper-container {
      width: 100%;
      height: 190px;
      .recommendList {
        .recommendItem {
          position: relative;
          width: 109px;
          height: 164px;
          border: 1px solid rgba(112, 112, 112, 0.2);
          border-radius: 4px;
          .label {
            position: absolute;
            top: 4px;
            left: 4px;
            width: 36px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            background: linear-gradient(
              180deg,
              rgba(253, 101, 83, 1) 0%,
              rgba(255, 58, 67, 1) 100%
            );
            border-radius: 4px 4px 4px 0px;
            color: #fff;
          }
          .recommendProImg {
            width: 84px;
            height: 84px;
            margin: 12px auto;
            img {
              height: 84px;
            }
          }
          .recommendProName {
            padding: 0 4px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            @include ellipsis2(2);
          }
          .price {
            padding: 0 4px;
            font-size: 14px;
            color: rgba(255, 58, 68, 1);
            text-align: center;
          }
        }
      }
      .swiper-pagination-bullet {
        width: 10px;
        height: 4px;
        background: rgba(207, 207, 207, 1);
        border-radius: 4px;
        opacity: 1;
        margin: 0 2px;
      }
      .swiper-pagination-bullet-active {
        width: 16px;
        height: 4px;
        background: rgba(253, 73, 66, 1);
        border-radius: 4px;
      }
    }
  }
  .tab_search {
    padding-top: 10px;
    background-color: #f5f8fc;
    .van-tabs__nav {
      background: #f5f8fc;
    }
    .van-sticky--fixed {
      box-shadow: 0 0 10px #ccc;
    }
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