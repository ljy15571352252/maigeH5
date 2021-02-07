<template>
  <div class="v-activity-distribution">
    <navbar title="分销专区" defaultColor="#fff" endColor="#fff" color="#333"></navbar>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="banner1 wrap">
        <img class="inherit_size" src="~assets/images/activity/distribution_banner@2x.png" alt />
      </div>
      <div class="wrapper">
        <div class="title flex">
          <i class="line"></i>
          <span>分销专区</span>
          <i class="line"></i>
        </div>
        <p>GROUP BUYING AREA</p>
      </div>
      <ul class="otherProList">
        <li
          @click="toDetail(item)"
          class="item flex_between"
          v-for="item in proList"
          :key="item.defaultSkuId"
        >
          <i class="proImg flex">
            <img :src="item.skuImg" alt />
          </i>
          <div class="right">
            <p class="proName">{{item.goodsName}}</p>
            <div class="flex_between">
              <div>
                <span class="price1">最低价：</span>
                <span class="price2">¥{{item.salePrice}}</span>
              </div>
              <div class="icon">去购买</div>
            </div>
          </div>
        </li>
      </ul>
    </van-list>
  </div>
</template>

<script>
/*
 * 分销专区
 */
import { activityGallery, activityGoodsPage } from "@/configs/interface.js";
import navbar from "@/components/navbar/nav.vue";
export default {
  name: "distribution",
  components: { navbar },
  data() {
    return {
      proList: [], // 商品列表
      pageCount: 0, // 返回页码数
      loading: false, // 商品加载中
      finished: false, // 没有更多商品
      pageIndex: 1 // 页码
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      if (this.$route.query.activityId) {
        this.getActivityDetail();
      }
    },
    // 去到详情页
    toDetail(item) {
      this.$router.push({
        name: "productnormal",
        query: {
          id: item.goodsId,
          activityId: this.$route.query.activityId,
          activityGoodsId: item.activityGoodsId,
          activityTypeNum: 10
        }
      });
    },
    // 下滑加载新页面
    onLoad() {
      if (this.pageIndex <= this.pageCount) {
        this.getActivityDetail();
      }
      this.loading = true;
    },
    // 获取活动详情
    getActivityDetail() {
      this.$http({
        methods: "GET",
        url: activityGoodsPage,
        data: {
          pageIndex: this.pageIndex,
          pageSize: 10,
          activityId: this.$route.query.activityId
        }
      }).then(res => {
        if (res.code === 200) {
          this.pageCount = res.data.page.pageCount || 0;
          this.proList = this.proList.concat(res.data.pageList);
          this.pageIndex++;
          this.loading = false;
          if (this.pageIndex > this.pageCount) {
            this.finished = true;
            this.loading = false;
          }
        } else if (res.code === 203) {
          this.finished = true;
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-activity-distribution {
  height: 100%;
  overflow: auto;
  padding-top: 60px;
  background-color: $lightColor;
  .wrapper {
    .title {
      span {
        font-size: 18px;
        font-weight: bold;
        color: #ff3a44;
        margin: 0 12px;
      }
      .line {
        width: 20px;
        height: 2px;
        background: #ff3a44;
      }
    }
    p {
      text-align: center;
      font-size: 12px;
      color: rgba(255, 58, 68, 1);
      margin-bottom: 22px;
    }
  }
  .seeMore {
    text-align: center;
    font-size: 14px;
    line-height: 50px;
    color: rgba(51, 51, 51, 1);
  }
  .wrap {
    width: 355px;
    margin: 0 auto 10px;
  }
  .banner1 {
    width: 100%;
    // margin-top: 60px;
    height: 168px;
  }
  .banner {
    width: 355px;
    height: 126px;
    margin: auto;
  }
  .interval {
    width: 100%;
    height: 10px;
    background-color: #f5f8fc;
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
  .otherProList {
    width: 350px;
    margin: auto;
    .item {
      background: #fff;
      padding: 20px 12px;
      margin-bottom: 6px;
      border-bottom: 1px solid #e5e5ea;
      .proImg {
        flex-shrink: 0;
        width: 76px;
        height: 76px;
        margin-right: 18px;
        img {
          max-width: 100%;
          height: 100%;
        }
      }
      .right {
        width: 232px;
        .proName {
          @include ellipsis2(2);
          margin-bottom: 20px;
        }
        .p1 {
          color: #ff3945;
        }
        .price1 {
          font-size: 12px;
          color: #ff3a44;
        }
        .price2 {
          font-size: 16px;
          color: #ff3a44;
          font-weight: bold;
        }
        .icon {
          width: 55px;
          height: 24px;
          line-height: 24px;
          background: linear-gradient(
            180deg,
            rgba(255, 58, 68, 1) 0%,
            rgba(255, 45, 85, 1) 100%
          );
          opacity: 1;
          border-radius: 25px;
          text-align: center;
          color: #fff;
        }
        .btn {
          padding: 0 6px;
          height: 18px;
          line-height: 18px;
          background: rgba(255, 58, 68, 1);
          opacity: 1;
          border-radius: 24px;
          color: #fff;
        }
      }
    }
  }
}
</style>