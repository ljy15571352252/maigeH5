<template>
  <div class="v-activity-seckill">
    <navbar title="限时秒杀" defaultColor="#fff" endColor="#fff" color="#333"></navbar>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="header">
        <div class="flex_between">
          <span class="t1">正在疯抢</span>
          <div class="flex">
            <span class="t2">距离结束</span>
            <van-count-down :time="time" format="HH:mm:ss">
              <template v-slot="timeData">
                <span class="time">{{ timeData.days > 9 ? timeData.days : '0' + timeData.days }}</span>
                <span class="colon">天</span>
                <span class="time">{{ timeData.hours > 9 ? timeData.hours : '0' + timeData.hours }}</span>
                <span class="colon">:</span>
                <span class="time">{{ timeData.minutes > 9 ? timeData.minutes : '0' + timeData.minutes }}</span>
                <span class="colon">:</span>
                <span class="time">{{ timeData.seconds > 9 ? timeData.seconds : '0' + timeData.seconds }}</span>
              </template>
            </van-count-down>
          </div>
        </div>
      </div>
      <div class="topPro" @click="toDetail(proList1)">
        <div class="title flex_between">
          <h2>爆款推荐</h2>
          <span>限时钜惠 尊享好礼</span>
        </div>
        <div class="content flex_between">
          <div class="top">TOP1</div>
          <i class="proImg">
            <img :src="proList1.skuImg" alt />
          </i>
          <div class="right">
            <p class="proName">{{proList1.goodsName}}</p>
            <div class="label">最热</div>
            <div class="flex_between">
              <div>
                <p class="lineThrough">¥{{proList1.ustomaryPrice}}</p>
                <p class="price">¥{{proList1.salePrice}}</p>
              </div>
              <div class="btn">
                <!--<p class="p1">爆卖2.7万件</p>-->
                <p class="p2">马上抢</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul class="top4ProList flex_between">
        <li
          @click="toDetail(item)"
          class="item"
          v-for="(item, index) in proList2To4"
          :key="item.defaultSkuId"
        >
          <div class="top">TOP{{index + 2}}</div>
          <i class="proImg">
            <img :src="item.skuImg" alt />
          </i>
          <p class="p1">全新抢购价</p>
          <p class="p2">{{item.goodsName}}</p>
          <div class="flex_start">
            <span class="price1">¥{{item.salePrice}}</span>
            <span class="price2">¥{{item.ustomaryPrice}}</span>
          </div>
        </li>
      </ul>
      <ul class="otherProList">
        <li
          @click="toDetail(item)"
          class="item flex_between"
          v-for="item in proListOthers"
          :key="item.defaultSkuId"
        >
          <i class="proImg flex">
            <img :src="item.skuImg" alt />
          </i>
          <div class="right">
            <p class="proName">{{item.goodsName}}</p>
            <p class="p1">秒杀价:</p>
            <div class="flex_between">
              <div>
                <span class="price1">¥{{item.salePrice}}</span>
                <span class="price2">¥{{item.ustomaryPrice}}</span>
              </div>
              <div class="btn">马上抢</div>
            </div>
          </div>
        </li>
      </ul>
    </van-list>
  </div>
</template>

<script>
/*
 * 限时秒杀
 */
import navbar from "@/components/navbar/nav.vue";
import { activityList, activityGoodsPage } from "@/configs/interface.js";
import { getClickCount } from "@/configs/common.js";
export default {
  name: "seckill",
  components: { navbar },
  data() {
    return {
      pageCount: 0, // 总页码数
      proList: [], // 获取的商品列表
      proList1: {}, // 获取的商品列表
      proList2To4: [], // 获取的商品列表
      proListOthers: [], // 获取的商品列表
      loading: false,
      finished: false,
      color: "#fff",
      time: 0, // 12 * 60 * 60 * 1000,
      pageIndex: 1
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
        this.getActivityList();
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
          activityTypeNum: 1
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
            if (item.activityTypeNum === 1) {
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
          this.splitProList();
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
    // 分拆第一、第二到第四、其它商品
    splitProList() {
      this.proList1 = this.proList.slice(0, 1)[0];
      this.proList2To4 = this.proList.slice(1, 4);
      this.proListOthers = this.proList.slice(4);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-activity-seckill {
  height: 100%;
  background-color: $lightColor;
  overflow: auto;
  padding-top: 60px;
  .proImg {
    flex-shrink: 0;
  }
  .c-navbar {
    background: #fff;
  }
  .top {
    position: absolute;
    top: 4px;
    left: 0px;
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
  .header {
    padding: 12px 20px;
    height: 200px;
    background: linear-gradient(
      227deg,
      rgba(255, 88, 96, 1) 0%,
      rgba(255, 58, 67, 1) 100%
    );
    opacity: 1;
    .t1 {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
    }
    .t2 {
      font-size: 14px;
      margin-right: 6px;
      color: #fff;
    }
    .van-count-down {
      .colon {
        color: #fff;
        margin: 0 4px;
        font-weight: bold;
      }
      .time {
        display: inline-block;
        width: 24px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        border-radius: 3px;
        color: #ff3a44;
        font-weight: bold;
      }
    }
  }
  .topPro {
    width: 350px;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-radius: 8px;
    margin: -136px auto 6px;
    .title {
      margin-bottom: 4px;
      h2 {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
      span {
        color: #666;
      }
    }
    .content {
      position: relative;
      box-sizing: border-box;
      .proImg {
        width: 120px;
        height: 135px;
        margin-right: 10px;
        img {
          max-width: 100%;
          height: 135px;
        }
      }
      .right {
        width: 220px;
        .proName {
          font-size: 12px;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 6px;
          @include ellipsis2(3);
        }
        .label {
          display: inline-block;
          padding: 0 3px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(255, 57, 69, 1);
          border-radius: 2px;
          text-align: center;
          color: #ff3945;
          margin-bottom: 44px;
        }
        .lineThrough {
          color: rgba(102, 102, 102, 1);
          text-decoration: line-through;
        }
        .price {
          font-size: 17px;
          color: rgba(255, 58, 68, 1);
          margin-right: 26px;
        }
        .btn {
          padding: 6px 16px;
          background: linear-gradient(#fd6553, #ff3a43);
          border-radius: 60px;
          color: #fff;
          text-align: center;
          .p2 {
            font-weight: bold;
            font-size: 14px;
          }
        }
      }
    }
  }
  .top4ProList {
    width: 350px;
    margin: auto;
    margin-bottom: 6px;
    .item {
      position: relative;
      width: 113px;
      height: 160px;
      background: rgba(255, 255, 255, 1);
      opacity: 1;
      border-radius: 4px;
      padding: 8px;
      box-sizing: border-box;
      .top {
        left: 10px;
      }
      .proImg {
        display: block;
        width: 85px;
        height: 85px;
        margin: auto;
        margin-bottom: 6px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .p1,
      .p2 {
        font-weight: bold;
        color: #333;
        @include ellipsis;
        margin-bottom: 4px;
      }
      .price1 {
        color: rgba(255, 58, 68, 1);
        margin-right: 8px;
      }
      .price2 {
        text-decoration: line-through;
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
        width: 76px;
        height: 76px;
        margin-right: 18px;
        img {
          max-width: 100%;
          height: 100%;
        }
      }
      .right {
        width: 100%;
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
}
</style>