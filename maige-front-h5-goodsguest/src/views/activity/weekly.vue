<template>
  <div class="v-activity-weekly">
    <navbar title="周周精选" defaultColor="#fff" endColor="#fff" color="#333"></navbar>
    <div class="banner1 wrap">
      <img class="inherit_size" src="~assets/images/activity/weekly_banner1.png" alt />
    </div>
    <div v-if="currentActivityId">
      <div class="wrapper">
        <div class="title flex">
          <i class="line"></i>
          <span>本周精选</span>
          <i class="line"></i>
        </div>
        <div class="banner">
          <img class="inherit_size" src="~assets/images/activity/weekly_banner2.png" alt />
        </div>
      </div>
      <ul class="otherProList">
        <li
          @click="toDetail(item)"
          class="item flex_between"
          v-for="item in currentWeek"
          :key="item.defaultSkuId"
        >
          <i class="proImg flex">
            <img :src="item.skuImg" alt />
          </i>
          <div class="right">
            <p class="proName">{{item.goodsName}}</p>
            <div class="flex_between">
              <div>
                <span class="price1">¥{{item.salePrice}}</span>
              </div>
              <div class="icon">
                <!-- <img
                  class="inherit_size"
                  src="~assets/images/activity/icon_shoppingcart@2x.png"
                  @click.stop="addCart(item)"
                />-->
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!--<p class="seeMore">查看更多</p>-->
      <div class="interval"></div>
    </div>
    <div v-if="lastActivityId">
      <div class="wrapper">
        <div class="title title2 flex">
          <i class="line"></i>
          <span>上周精选</span>
          <i class="line"></i>
        </div>
        <div class="banner">
          <img class="inherit_size" src="~assets/images/activity/weekly_banner3.png" alt />
        </div>
      </div>
      <ul class="otherProList">
        <li
          @click="toDetail(item)"
          class="item flex_between"
          v-for="item in lastWeek"
          :key="item.defaultSkuId"
        >
          <i class="proImg flex">
            <img :src="item.skuImg" alt />
          </i>
          <div class="right">
            <p class="proName">{{item.goodsName}}</p>
            <div class="flex_between">
              <div>
                <span class="price1">¥{{item.salePrice}}</span>
              </div>
              <div class="icon">
                <!-- <img
                  class="inherit_size"
                  src="~assets/images/activity/icon_shoppingcart@2x.png"
                  @click.stop="addCart(item)"
                />-->
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!--<p class="seeMore">查看更多</p>-->
      <div class="interval"></div>
    </div>
    <div v-if="nextActivityId">
      <div class="wrapper">
        <div class="title title3 flex">
          <i class="line"></i>
          <span>下周精选</span>
          <i class="line"></i>
        </div>
        <div class="banner">
          <img class="inherit_size" src="~assets/images/activity/weekly_banner4.png" alt />
        </div>
      </div>
      <ul class="otherProList">
        <li
          @click="toDetail(item)"
          class="item flex_between"
          v-for="item in nextWeek"
          :key="item.defaultSkuId"
        >
          <i class="proImg flex">
            <img :src="item.skuImg" alt />
          </i>
          <div class="right">
            <p class="proName">{{item.goodsName}}</p>
            <div class="flex_between">
              <div>
                <span class="price1">¥{{item.salePrice}}</span>
              </div>
              <div class="icon">
                <!-- <img
                  class="inherit_size"
                  src="~assets/images/activity/icon_shoppingcart@2x.png"
                  @click.stop="addCart(item)"
                />-->
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!--<p class="seeMore">查看更多</p>-->
      <div class="interval"></div>
    </div>
  </div>
</template>

<script>
/*
 * 周周精选
 */
import {
  selectedActivity,
  activityGallery,
  activityGoodsPage
} from "@/configs/interface.js";
import navbar from "@/components/navbar/nav.vue";
import { addShopCart, getClickCount } from "@/configs/common.js";
import { Toast } from "vant";
export default {
  name: "weekly",
  components: { navbar },
  data() {
    return {
      lastActivityId: null, // 上周活动Id
      currentActivityId: null, // 本周活动Id
      nextActivityId: null, // 下周活动Id
      lastWeek: [], // 上周
      currentWeek: [], // 本周
      nextWeek: [], // 下周
      proList: [], // 商品列表
      pageCount: 0, // 返回页码数
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
        this.getselectedActivity();
      }
    },
    // 获取活动列表
    getselectedActivity() {
      this.$http({
        method: "",
        url: selectedActivity,
        data: {
          activityId: this.$route.query.activityId
        }
      }).then(res => {
        if (res.code === 200) {
          res.data.forEach(item => {
            // 上周
            if (item.week === 0) {
              this.lastActivityId = item.activityId;
              this.getActivityDetail(0, this.lastActivityId);
            }
            // 本周
            if (item.week === 1) {
              this.currentActivityId = item.activityId;
              this.getActivityDetail(1, this.currentActivityId);
            }
            // 下周
            if (item.week === 2) {
              this.nextActivityId = item.activityId;
              this.getActivityDetail(2, this.nextActivityId);
            }
          });
        }
      });
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
          activityTypeNum: 2
        }
      });
    },
    // 获取活动详情
    getActivityDetail(index, activityId) {
      this.$http({
        methods: "GET",
        url: activityGoodsPage,
        data: {
          pageNum: this.pageIndex,
          pageSize: 10,
          activityId
        }
      }).then(res => {
        if (res.code === 200) {
          switch (index) {
            case 0:
              this.lastWeek = this.lastWeek.concat(res.data.pageList);
              break;
            case 1:
              this.currentWeek = this.currentWeek.concat(res.data.pageList);
              break;
            case 2:
              this.nextWeek = this.nextWeek.concat(res.data.pageList);
              break;
          }
        }
      });
    },
    // 加入购物车
    addCart(item) {
      // 请求购物车接口
      let data = {
        goodsId: item.goodsId,
        goodsName: item.goodsName,
        goodsPrice: item.shopPrice,
        goodsSn: item.goodsSn,
        quantity: 1,
        skuId: item.skuId,
        supplierId: item.supplierId,
        activityGoodsId: item.activityGoodsId,
        activityId: item.activityId,
        activityTypeNum: item.activityTypeNum,
        groupId: item.groupId
      };
      addShopCart(data).then(res => {
        if (res.code === 200) {
          Toast("添加购物车成功");
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-activity-weekly {
  height: 100%;
  overflow: auto;
  padding-top: 60px;
  background-color: $lightColor;
  .wrapper {
    .title {
      height: 50px;
      span {
        font-size: 18px;
        font-weight: bold;
        color: rgba(255, 185, 50, 1);
        margin: 0 12px;
      }
      .line {
        width: 17px;
        height: 2px;
        background: rgba(255, 185, 50, 1);
      }
    }
    .title2 {
      span {
        color: #ff4851;
      }
      .line {
        background: #ff4851;
      }
    }
    .title3 {
      span {
        color: #6ab0ff;
      }
      .line {
        background: #6ab0ff;
      }
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
    height: 153px;
    margin-top: 20px;
    background: #fff;
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
          font-size: 16px;
          color: rgba(255, 57, 69, 1);
          margin-right: 10px;
        }
        .price2 {
          font-size: 12px;
          text-decoration: line-through;
          color: #666;
        }
        .icon {
          display: inline-block;
          width: 18px;
          height: 18px;
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