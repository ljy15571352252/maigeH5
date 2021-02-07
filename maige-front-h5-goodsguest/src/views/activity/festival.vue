<template>
  <div class="v-activity-festival">
    <navbar title="节日专区" defaultColor="#fff" endColor="#fff" color="#333"></navbar>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="bannerWrapper1">
        <img :src="banner.imgUrl" alt />
      </div>
      <ul class="hotSaleList">
        <li class="item" @click="toDetail(hotList[0])">
          <div class="content flex_between">
            <div class="left">
              <div class="label">热销爆款</div>
              <p class="proDesc1">{{hotList[0]&&hotList[0].goodsBrief}}</p>
              <p class="proDesc2">{{hotList[0]&&hotList[0].goodsName}}</p>
              <div class="btn flex_between">
                <span class="price">价 格：￥{{hotList[0]&&hotList[0].salePrice}}</span>
                <span class="flex">
                  立即购买
                  <img
                    style="margin-left: 2px"
                    src="~assets/images/activity/festival_rightarrow.png"
                    alt
                  />
                </span>
              </div>
            </div>
            <div class="right">
              <i class="proImg flex">
                <img :src="hotList[0]&&hotList[0].skuImg" alt />
              </i>
            </div>
          </div>
        </li>
        <li class="item" @click="toDetail(hotList[1])">
          <div class="content flex_between">
            <div class="right">
              <i class="proImg flex">
                <img :src="hotList[1]&&hotList[1].skuImg" alt />
              </i>
            </div>
            <div class="left flex_column_end">
              <div class="label">热销爆款</div>
              <p class="proDesc1">{{hotList[1]&&hotList[1].goodsBrief}}</p>
              <p class="proDesc2">{{hotList[1]&&hotList[1].goodsName}}</p>
              <div class="btn flex_between">
                <span class="price">价 格：￥{{hotList[1]&&hotList[1].salePrice}}</span>
                <span class="flex">
                  立即购买
                  <img
                    style="margin-left: 2px"
                    src="~assets/images/activity/festival_rightarrow.png"
                    alt
                  />
                </span>
              </div>
            </div>
          </div>
        </li>
        <li class="item" @click="toDetail(hotList[2])">
          <div class="content flex_between">
            <div class="left">
              <div class="label">热销爆款</div>
              <p class="proDesc1">{{hotList[2]&&hotList[2].goodsBrief}}</p>
              <p class="proDesc2">{{hotList[2]&&hotList[2].goodsName}}</p>
              <div class="btn flex_between">
                <span class="price">价 格：￥{{hotList[2]&&hotList[2].salePrice}}</span>
                <span class="flex">
                  立即购买
                  <img
                    style="margin-left: 2px"
                    src="~assets/images/activity/festival_rightarrow.png"
                    alt
                  />
                </span>
              </div>
            </div>
            <div class="right">
              <i class="proImg flex">
                <img :src="hotList[2]&&hotList[2].skuImg" alt />
              </i>
            </div>
          </div>
        </li>
      </ul>
      <div class="recommend" v-for="item in proList" :key="item.activityGoodsTypeId">
        <div class="title flex">{{item.goodsTypeName}}</div>
        <div class="bannerWrapper2">
          <img :src="item.goodsTypeImgUrl" alt />
        </div>
        <ul class="list clearfix">
          <li
            @click="toDetail(item2)"
            class="item fl"
            v-for="item2 in item.activityHomepageGoodsReturns"
            :key="item2.skuId"
          >
            <div class="proImg flex">
              <img :src="item2.skuImg" alt />
            </div>
            <p class="proName">{{item2.goodsName}}</p>
            <p class="price">￥{{item2.salePrice}}</p>
            <div class="btn">立即抢购</div>
          </li>
        </ul>
      </div>
    </van-list>
  </div>
</template>

<script>
/*
 * 节日专区
 */
import {
  activityGoodsSaleSort,
  activityGallery,
  discountActivity
} from "@/configs/interface.js";
import { getClickCount } from "@/configs/common.js";
import navbar from "@/components/navbar/nav.vue";
export default {
  name: "festival",
  components: { navbar },
  data() {
    return {
      banner: {},
      hotList: [], // 热销
      proList: [], // 商品列表
      pageCount: 0, // 返回页码数
      loading: false,
      finished: false,
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
        this.getHotList();
        this.getBanner();
      }
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
          activityTypeNum: 4
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
          this.banner = res.data[0];
        }
      });
    },
    // 获取热销
    getHotList() {
      this.$http({
        methods: "GET",
        url: activityGoodsSaleSort,
        data: {
          rankType: 0,
          pageNum: this.pageIndex,
          pageSize: 3,
          activityId: this.$route.query.activityId
        }
      }).then(res => {
        if (res.code === 200) {
          this.hotList = res.data.list;
        }
      });
    },
    // 获取活动详情
    getActivityDetail() {
      this.$http({
        methods: "GET",
        url: discountActivity,
        data: {
          pageNum: this.pageIndex,
          pageSize: 10,
          activityId: this.$route.query.activityId
        }
      }).then(res => {
        if (res.code === 200) {
          this.proList = this.proList.concat(res.data);
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
.v-activity-festival {
  height: 100%;
  overflow: auto;
  padding-top: 60px;
  background-color: $lightColor;
  .bannerWrapper1 {
    height: 130px;
    width: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .hotSaleList {
    padding: 10px;
    .item {
      background: rgba(220, 40, 49, 1);
      border-radius: 10px;
      padding: 8px;
      margin-bottom: 10px;
      .content {
        height: 178px;
        background: rgba(255, 255, 255, 1);
        padding: 18px 20px;
        box-sizing: border-box;
        border-radius: 9px;
        .proImg {
          flex-shrink: 0;
          width: 120px;
          height: 130px;
          padding: 0 5px;
          img {
            max-width: 100%;
            height: 100%;
          }
        }
        .label {
          width: 106px;
          height: 24px;
          line-height: 24px;
          background: url("~assets/images/activity/festival_hotsale.png")
            no-repeat;
          background-size: 100%;
          text-align: center;
          color: #fff;
          margin-bottom: 6px;
        }
        .proDesc1 {
          font-size: 18px;
          font-weight: bold;
          color: rgba(255, 65, 65, 1);
          margin-bottom: 6px;
        }
        .proDesc2 {
          color: rgba(51, 51, 51, 1);
          font-size: 10px;
          @include ellipsis2(3);
          line-height: 1.2;
          margin-bottom: 6px;
        }
        .btn {
          width: 166px;
          height: 24px;
          padding: 0 2px 0 6px;
          background: url("~assets/images/activity/festival_btn.png") no-repeat;
          background-size: 100%;
          span {
            color: #fff;
          }
        }
      }
    }
  }
  .recommend {
    width: 355px;
    margin: 0 auto 14px;
    .title {
      width: 106px;
      margin: auto;
      height: 18px;
      background: url("~assets/images/activity/festival_title.png") no-repeat;
      background-size: 100%;
      margin-bottom: 14px;
    }
    .bannerWrapper2 {
      margin-bottom: 6px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .list {
      .item:not(:nth-of-type(3n)) {
        margin-right: 6px;
      }
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 114px;
        height: 196px;
        padding: 12px 7px 6px;
        border: 1px solid rgba(241, 241, 241, 1);
        box-sizing: border-box;
        margin-bottom: 6px;
        .proImg {
          width: 72px;
          height: 72px;
          margin-bottom: 12px;
          img {
            height: 100%;
          }
        }
        .proName {
          color: rgba(51, 51, 51, 1);
          @include ellipsis2(2);
          margin-bottom: 8px;
        }
        .price {
          font-size: 14px;
          color: rgba(254, 77, 78, 1);
          margin-bottom: 6px;
        }
        .btn {
          width: 102px;
          height: 20px;
          line-height: 20px;
          background: #ff4141;
          border-radius: 10px;
          text-align: center;
          color: #fff;
        }
      }
    }
  }
}
</style>