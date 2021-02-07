<template>
  <div class="v-activity-assemble">
    <navbar title="今日必拼" defaultColor="#fff" endColor="#fff" color="#333"></navbar>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="header">
        <div class="flex_between" style="padding: 0 10px; margin-bottom: 10px">
          <div class="flex">
            <span class="t1">今日必拼</span>
            <van-count-down :time="time" format="HH:mm:ss">
              <template v-slot="timeData">
                <span class="time">{{ timeData.days > 9 ? timeData.days : '0' + timeData.days }}</span>
                <span class="colon">天</span>
                <span class="time">{{ timeData.hours > 9 ? timeData.hours : '0' + timeData.hours }}</span>
                <span class="colon">:</span>
                <span
                  class="time"
                >{{ timeData.minutes > 9 ? timeData.minutes : '0' + timeData.minutes }}</span>
                <span class="colon">:</span>
                <span
                  class="time"
                >{{ timeData.seconds > 9 ? timeData.seconds : '0' + timeData.seconds }}</span>
              </template>
            </van-count-down>
          </div>
          <!--<span class="t2">限时钜惠 尊享好礼</span>-->
        </div>
        <div class="swiper-container swiper-container1">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item,index) in mustAssembleArray" :key="index">
              <ul class="recommendList flex_between">
                <li
                  @click="toDetail(data)"
                  class="recommendItem"
                  v-for="(data, index2) in item"
                  :key="data.skuId"
                >
                  <div class="recommendProImg flex" :style="{background: backgroundColors[index2]}">
                    <img :src="data.skuImg" alt />
                  </div>
                  <div class="flex">
                    <span class="s1">{{data.groupMember}}人拼</span>
                    <span class="s2">¥{{data.salePrice}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- Add Pagination -->
          <div v-if="mustAssembleArray.length > 3" class="swiper-pagination"></div>
        </div>
      </div>
      <div class="hot">
        <div class="flex_between" style="margin-bottom: 10px">
          <div class="flex">
            <i class="icon">
              <img class="inherit_size" src="~assets/images/activity/assemble_hot@2x.png" alt />
            </i>
            <span class="t1">热拼榜</span>
          </div>
          <div class="flex">
            <!--<span class="t2">排行榜</span>
            <van-icon name="arrow" />-->
          </div>
        </div>
        <div class="swiper-container swiper-container2">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item,index) in hotRankArray" :key="index">
              <ul class="recommendList flex_between">
                <li
                  @click="toDetail(data)"
                  class="recommendItem"
                  v-for="(data, index2) in item"
                  :key="data.skuId"
                >
                  <div class="top">TOP{{index*3+index2+1}}</div>
                  <div class="recommendProImg flex">
                    <img :src="data.skuImg" alt />
                  </div>
                  <p class="p1">限时拼团</p>
                  <p class="p2">{{data.goodsName}}</p>
                  <div class="flex">
                    <span class="s1">{{data.groupMember}}人拼</span>
                    <span class="s1" style="margin-top: 4px">¥{{data.salePrice}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- Add Pagination -->
          <div v-if="hotRankArray.length > 3" class="swiper-pagination2"></div>
        </div>
      </div>
      <ul class="otherProList">
        <li
          @click="toDetail(item)"
          class="item flex_between"
          v-for="item in proList"
          :key="item.skuId"
        >
          <i class="proImg flex">
            <img :src="item.skuImg" alt />
          </i>
          <div class="right">
            <p class="proName">{{item.goodsName}}</p>
            <p class="p1">拼团价:</p>
            <div class="flex_between">
              <div>
                <span class="price1">¥{{item.salePrice}}</span>
                <span class="price2">¥{{item.ustomaryPrice}}</span>
              </div>
              <div class="btn">立即开拼</div>
            </div>
          </div>
        </li>
      </ul>
    </van-list>
  </div>
</template>

<script>
/*
 * 拼团
 */
import {
  activityGoodsSaleSort,
  activityList,
  activityGoodsPage
} from "@/configs/interface.js";
import { getClickCount } from "@/configs/common.js";
import navbar from "@/components/navbar/nav.vue";
import Swiper from "swiper";
export default {
  name: "assemble",
  components: { navbar },
  data() {
    return {
      mustAssemble: [],
      TodayHot: [],
      hotRank: [],
      proList: [], // 商品列表
      pageCount: 0, // 返回页码数
      loading: false,
      finished: false,
      pageIndex: 1, // 页码
      pageNum: 1, // 热拼页码
      backgroundColors: [
        "radial-gradient(circle,rgba(255,255,255,0.2) 0%,rgba(232,212,178,0.2) 100%)",
        "radial-gradient(circle,rgba(219,119,52,0.2) 0%,rgba(219,119,52,0.2) 100%)",
        "radial-gradient(circle,rgba(255,255,255,0.2) 0%,rgba(223,205,205,0.2) 100%)",
        "radial-gradient(circle,rgba(221,245,243,0.2) 0%,rgba(176,188,187,0.2) 100%)"
      ],
      time: 0 // 12 * 60 * 60 * 1000,
    };
  },
  computed: {
    hotRankArray() {
      return this.convertToTwoDimensionArray(this.hotRank, 3);
    },
    mustAssembleArray() {
      return this.convertToTwoDimensionArray(this.mustAssemble, 4);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      if (this.$route.query.activityId) {
        this.getActivityDetail();
        this.getActivityList();
        this.getRecommend(0);
        this.getRecommend(1);
        this.initSwiper();
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
          groupMember: item.groupMember,
          activityTypeNum: 7
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
    // 获取特惠推荐
    getRecommend(index) {
      this.$http({
        methods: "get",
        url: activityGoodsSaleSort,
        data: {
          rankType: index,
          activityId: this.$route.query.activityId,
          pageNum: this.pageNum,
          pageSize: 9
        }
      }).then(res => {
        if (res.code === 200) {
          if (index === 0) {
            this.hotRank = res.data.list;
          } else if (index === 1) {
            this.mustAssemble = res.data.list;
          }
        }
      });
    },
    // 获取活动列表
    getActivityList() {
      this.$http({
        method: "get",
        url: activityList,
        data: null
      }).then(res => {
        if (res.code === 200) {
          const activityList = res.data;
          activityList.forEach(item => {
            if (item.activityTypeNum === 7) {
              this.time =
                this.$moment(item.entTime, "YYYY-MM-DD HH:mm:ss").valueOf() -
                Date.now();
            }
          });
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
    },
    // 激活轮播效果
    initSwiper() {
      // swiper轮播图
      let swiper = new Swiper(".swiper-container1", {
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
      let swiper2 = new Swiper(".swiper-container2", {
        slidesPerView: 1,
        centeredSlides: true,
        loop: false,
        observer: true,
        observeParents: false,
        pagination: {
          el: ".swiper-pagination2",
          clickable: true
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-activity-assemble {
  height: 100%;
  background-color: $lightColor;
  overflow: auto;
  padding-top: 60px;
  .header {
    width: 350px;
    height: 162px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    margin: 6px auto;
    padding: 10px 4px 6px;
    box-sizing: border-box;
    .t1 {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-right: 10px;
    }
    .t2 {
      color: #666;
    }
    .van-count-down {
      .colon {
        color: #131313;
        margin: 0 4px;
      }
      .time {
        display: inline-block;
        width: 24px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        background: #ff3a44;
        border-radius: 3px;
        color: #fff;
        font-weight: bold;
      }
    }
    .swiper-container {
      width: 100%;
      height: 116px;
      .recommendList {
        .recommendItem {
          position: relative;
          margin-left: 1px;
          .recommendProImg {
            width: 84px;
            height: 74px;
            img {
              width: 80%;
              height: 80%;
            }
          }
          .s1 {
            color: #707070;
            margin-right: 4px;
          }
          .s2 {
            margin-top: 1px;
            color: #ff3a44;
          }
        }
      }
    }
  }
  .hot {
    width: 350px;
    height: 224px;
    margin: 6px auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    box-sizing: border-box;
    padding: 14px 6px 0;
    .t1 {
      font-size: 18px;
      font-weight: bold;
      line-height: 21px;
      color: rgba(51, 51, 51, 1);
      opacity: 1;
    }
    .t2 {
      margin-right: 6px;
      color: #666;
    }
    .icon {
      display: inline-block;
      width: 14px;
      height: 16px;
      margin-right: 6px;
    }
    .swiper-container2 {
      width: 100%;
      padding: 0 2px;
      .recommendList {
        .recommendItem {
          position: relative;
          width: 106px;
          height: 160px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(112, 112, 112, 0.2);
          border-radius: 4px;
          padding: 0 6px;
          box-sizing: border-box;
          .top {
            position: absolute;
            top: 4px;
            left: 4px;
            width: 40px;
            height: 18px;
            line-height: 18px;
            background: linear-gradient(
              180deg,
              rgba(253, 101, 83, 1) 0%,
              rgba(255, 58, 67, 1) 100%
            );
            border-radius: 4px 4px 4px 0px;
            text-align: center;
            color: #fff;
          }
          .recommendProImg {
            width: 80px;
            height: 80px;
            margin: 12px auto 10px;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
          .p1 {
            text-align: center;
            font-weight: Bold;
            color: #333;
          }
          .p2 {
            text-align: center;
            @include ellipsis;
            font-weight: Bold;
          }
          .s1 {
            color: #ff3a44;
            margin: 2px;
          }
        }
      }
    }
  }
  .otherProList {
    width: 350px;
    margin: auto;
    .item {
      background: #fff;
      padding: 12px;
      margin-bottom: 6px;
      border-radius: 4px;
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
          margin-bottom: 12px;
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
  .swiper-pagination-bullets {
    text-align: center;
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
</style>