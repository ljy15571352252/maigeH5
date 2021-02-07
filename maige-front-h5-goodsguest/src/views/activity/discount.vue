<template>
  <div class="v-activity-discount" ref="wrapper">
    <navbar title="折扣专区" defaultColor="#fff" endColor="#fff" color="#333"></navbar>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="swiper_area">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in banners" :key="item.imgId">
              <img :src="item.imgUrl" />
            </div>
          </div>
          <!-- Add Pagination -->
          <!-- <div class="swiper-pagination"></div> -->
        </div>
      </div>
      <div ref="topTab" class="topTab" :class="{'isFixed': isFixed}">
        <van-tabs type="card" :swipe-threshold="5" @click="handleClick">
          <van-tab title="1-2折"></van-tab>
          <van-tab title="3-4折"></van-tab>
          <van-tab title="5-6折"></van-tab>
          <van-tab title="7-8折"></van-tab>
          <van-tab title="9折商品"></van-tab>
        </van-tabs>
      </div>
      <!--<div class="bannerWrapper">
        <img src="~assets/images/activity/banner@2x.png" alt="">
      </div>-->
      <ul class="list">
        <li
          @click="toDetail(item)"
          class="flex_start item"
          v-for="item in proList"
          :key="item.skuId"
        >
          <i class="proImg">
            <img :src="item.skuImg" alt />
          </i>
          <div style="width: 100%">
            <p class="proName">{{item.goodsName}}</p>
            <!--<p class="proDesc">已被9300人收藏 | 100条评价</p>-->
            <div class="flex_between">
              <span class="price">￥{{item.salePrice}}</span>
              <i class="icon_shoppingcart">
                <img src="~assets/images/activity/icon_shoppingcart@2x.png" alt />
              </i>
            </div>
          </div>
        </li>
      </ul>
    </van-list>
  </div>
</template>

<script>
/*
 * 折扣专区
 */
import navbar from "@/components/navbar/nav.vue";
import { activityGallery, rebateActivityType } from "@/configs/interface.js";
import { getClickCount } from "@/configs/common.js";
import Swiper from "swiper";
export default {
  name: "discount",
  components: { navbar },
  data() {
    return {
      banners: [],
      loading: false,
      finished: false,
      pages: 0, // 总页数
      index: 0, // 切换选项
      proList: [], // 商品列表
      pageNum: 1, // 页码
      offsetTop: 0, // 需要吸顶的栏离顶部的距离
      isFixed: false // 是否悬浮
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.$refs.wrapper.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 初始化
    init() {
      this.initSwiper();
      this.$nextTick(() => {
        this.$refs.wrapper.addEventListener("scroll", this.handleScroll);
        if (this.$refs.topTab) {
          this.offsetTop = this.$refs.topTab.offsetTop;
        }
      });
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
          activityTypeNum: 6
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
          this.banners = res.data;
        }
      });
    },
    // 下滑加载新页面
    onLoad() {
      if (this.pageNum < this.pages) {
        this.getProList(true);
      }
      this.loading = true;
    },
    // 点击切换切卡
    handleClick(index) {
      this.index = index;
      this.getProList();
    },
    // 获取商品列表
    getProList(bool) {
      // 如何bool为true表示是下滑加载
      if (!bool) {
        this.pageNum = 1;
      }
      let rebate = [];
      switch (this.index) {
        case 0:
          rebate = [1, 2];
          break;
        case 1:
          rebate = [3, 4];
          break;
        case 2:
          rebate = [5, 6];
          break;
        case 3:
          rebate = [7, 8];
          break;
        case 4:
          rebate = [9, 10];
          break;
      }
      this.$http({
        method: "post",
        url: rebateActivityType,
        data: {
          pageNum: this.pageNum,
          pageSize: 10,
          activityId: this.$route.query.activityId,
          rebates: rebate
        }
      }).then(res => {
        if (res.code === 200) {
          this.pages = res.data.pages;
          if (bool) {
            this.proList = this.proList.concat(res.data.list);
          } else {
            this.proList = res.data.list;
          }
          this.loading = false;
          this.pageNum++;
          if (this.pageNum >= this.pages) {
            this.finished = true;
            this.loading = false;
          }
        }
      });
    },
    // 切卡吸顶
    handleScroll() {
      let scrollTop = this.$refs.wrapper.scrollTop;
      if (scrollTop - this.offsetTop >= 50) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    // 激活轮播效果
    initSwiper() {
      // swiper轮播图
      let swiper = new Swiper(".swiper-container", {
        slidesPerView: 1,
        centeredSlides: true,
        loop: true,
        observer: true,
        observeParents: false,
        autoplay: true
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-activity-discount {
  height: 100%;
  overflow: auto;
  padding-top: 60px;
  background-color: $lightColor;
  // 悬浮吸顶
  .isFixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 3px 10px #eee;
    z-index: 2;
  }
  // 轮播图组件
  .swiper_area {
    width: 100%;
    height: 150px;
    padding: 0 10px;
    .swiper-container {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
    .swiper-slide {
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 300ms;
      transform: scale(0.95);
      border-radius: 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .swiper-slide-active,
    .swiper-slide-duplicate-active {
      transform: scale(1);
    }
  }
  // 切卡组件
  .topTab {
    padding: 12px 0;
    /*margin-bottom: 20px;*/
    .van-tabs {
      .van-tabs__nav--card {
        border: none;
      }
      .van-tab {
        width: 73px;
        height: 30px;
        border: none;
        color: #333;
        border-radius: 15px;
      }
      .van-tab--active {
        background: linear-gradient(
          180deg,
          rgba(255, 58, 68, 1) 0%,
          rgba(255, 45, 85, 1) 100%
        );
        color: #fff;
      }
    }
  }
  // banner
  .bannerWrapper {
    width: 365px;
    height: 83px;
    margin: 0 auto 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  // 商品列表
  .list {
    padding: 0 10px;
    margin: auto;
    .item {
      padding: 18px 6px 8px;
      border-bottom: 1px solid #e5e5ea;
      .proImg {
        display: inline-block;
        flex-shrink: 0;
        width: 120px;
        height: 120px;
        margin-right: 6px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .proName {
        font-size: 14px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        @include ellipsis2(2);
        margin-bottom: 4px;
      }
      .proDesc {
        font-size: 12px;
        color: rgba(153, 153, 153, 1);
        margin-bottom: 10px;
      }
      .price {
        font-size: 20px;
        font-weight: bold;
        color: rgba(255, 58, 68, 1);
      }
      .icon_shoppingcart {
        display: inline-block;
        width: 18px;
        height: 18px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>