<template>
  <div class="v-home-index">
    <div>
      <div class="bg_header">
        <navbar class="header_bar" :showLeft="false" color="#fff">
          <template slot="left">
            <van-icon class="category_icon" @click="toCategory" name="wap-nav" />
          </template>
          <template slot="center">
            <van-search
              v-model="keyWords"
              placeholder="电脑数码用品"
              shape="round"
              background="transparent"
              @focus="focusChange"
              clearable
            ></van-search>
          </template>
          <template slot="right">
            <img
              v-if="isLogin() == true"
              class="account_img"
              @click="toPersonal"
              src="~assets/images/home/account.png"
            />
            <span v-if="isLogin() == false" class="please_login" @click="toLogin">请登录</span>
          </template>
        </navbar>
      </div>
      <div class="swiper_area">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div
              @click="toProList(item)"
              class="swiper-slide"
              v-for="item in swiperImages"
              :key="item.id"
            >
              <img :src="item.picUrl" />
            </div>
          </div>
          <!-- Add Pagination -->
          <!-- <div class="swiper-pagination"></div> -->
        </div>
      </div>
      <div class="category_box">
        <van-swipe @change="changeCategory" :height="184">
          <van-swipe-item :key="index" v-for="(item, index) in pagesData">
            <div class="categoryPage">
              <div
                class="items"
                v-for="sub in item"
                :key="sub.text"
                @click="toSearchDetail(sub.barId, sub.catId)"
              >
                <img :src="sub.imgUrl" alt />
                <div class="text">{{sub.barName && sub.barName.split('/').join('').substring(0,4)}}</div>
              </div>
            </div>
          </van-swipe-item>
          <div v-if="pagesData && pagesData.length > 1" class="footer_tab" slot="indicator">
            <span
              :class="currentPage == (num - 1) ? 'tab active_tab' : 'tab'"
              :key="num"
              v-for="num in pagesData && pagesData.length"
            ></span>
          </div>
        </van-swipe>
      </div>
      <!-- <div class="banner1">
        <h4>限时抢券</h4>
        <div class="discount">每日必领优惠券</div>
      </div>-->
      <div class="activities">
        <div class="activities_item" :key="index" v-for="(item, index) in activityList">
          <div
            class="main_title"
            @click="toActivity(getActivityItem(item.activityTypeNum).routerName, item.activityId, item)"
          >
            <img :src="item.iconUrl" />
            <span class="main_name">{{item.activityTypeName}}</span>
            <van-count-down
              v-if="item.activityTypeNum == 1"
              :time="$moment(item.entTime, 'YYYY-MM-DD HH:mm:ss').valueOf() - Date.now()"
              format="HH:mm:ss:SS"
            >
              <template v-slot="timeData">
                <span class="option">{{ timeData.days > 9 ? timeData.days : '0' + timeData.days }}</span>
                <span class="colon">天</span>
                <span
                  class="option"
                >{{ timeData.hours > 9 ? timeData.hours : '0' + timeData.hours }}</span>
                <span class="colon">:</span>
                <span
                  class="option"
                >{{ timeData.minutes > 9 ? timeData.minutes : '0' + timeData.minutes }}</span>
                <span class="colon">:</span>
                <span
                  class="option"
                >{{ timeData.seconds > 9 ? timeData.seconds : '0' + timeData.seconds }}</span>
              </template>
            </van-count-down>
          </div>
          <div class="sub_title">{{item.content}}</div>
          <!-- 带进度条的 -->
          <div
            @click="toProDetail(item.activityHomepageGoodsReturns[0], item.activityTypeNum)"
            class="show_product_seckill flex_start"
            v-if="item.activityTypeNum != 5 && item.activityTypeNum != 6 && item.activityHomepageGoodsReturns[0]"
          >
            <i class="imgWrap flex">
              <img class="prod_img" :src="item.activityHomepageGoodsReturns[0].skuImg" />
            </i>
            <div>
              <p class="red_p">已抢{{item.activityHomepageGoodsReturns[0].saleRatio*100}}%</p>
              <van-progress
                :show-pivot="false"
                color="#ee0a24"
                :percentage="(formatFloat(Number(item.activityHomepageGoodsReturns[0].saleRatio) * 100)) || 0"
              />
              <p
                class="price"
              >{{item.priceName}}：¥{{item.activityHomepageGoodsReturns[0].salePrice}}</p>
              <p class="lose_price">商城价：¥{{item.activityHomepageGoodsReturns[0].ustomaryPrice}}</p>
            </div>
          </div>
          <!-- 其它 -->
          <div class="show_product" v-else>
            <div
              class="prod_info"
              @click="toProDetail(sub, item.activityTypeNum)"
              v-for="(sub) in item && item.activityHomepageGoodsReturns.slice(0, 2)"
              :key="sub.activityGoodsId"
            >
              <img class="prod_img" :src="sub.skuImg" />
              <div>
                <div>
                  <!--<span>秒杀价：¥</span>-->
                  <span class="price">￥{{sub.salePrice}}</span>
                </div>
                <del class="lose_price">
                  <!--<span>商城价：¥</span>-->
                  <span>￥{{sub.ustomaryPrice}}</span>
                </del>
              </div>
            </div>
          </div>
        </div>
        <!--<div class="activities_bottombar">
          <div>
            <span class="kuaibao">好市客快报</span>
            <span class="kuaibao_icon">热门</span>
            <span class="msg">好市客商城即将上线</span>
          </div>
          <div class="more_right">更多></div>
        </div>-->
      </div>
      <div class="foryou" v-if="activityList[0]">
        <div class="title">
          <img src="~assets/images/home/huo.png" />
          <span>为你推荐</span>
        </div>
        <div class="discount" @click="toActivity2(activityList[0])">
          <div class="discount_wrapper">
            <div class="top">{{activityList[0].activityTypeName}}</div>
            <div class="center">{{activityList[0].content}}</div>
            <div class="bottom">点击查看</div>
          </div>
        </div>
      </div>
      <div class="three_button" v-if="activityList[1]">
        <div class="cheap_area" @click="toActivity2(activityList[1])">
          <div class="l_top">{{activityList[1].activityTypeName}}</div>
          <div class="l_center">{{activityList[1].content}}</div>
        </div>
        <div class="right_area" v-if="activityList[2]">
          <div class="festival" @click="toActivity2(activityList[2])">
            <div class="l_top">{{activityList[2].activityTypeName}}</div>
            <div class="l_center">{{activityList[2].content}}</div>
          </div>
          <div class="birthday" v-if="activityList[3]" @click="toActivity2(activityList[3])">
            <div class="l_top">{{activityList[3].activityTypeName}}</div>
            <div class="l_center">{{activityList[3].content}}</div>
          </div>
        </div>
      </div>
      <div class="twoActivityWrap flex_between" v-if="activityList[4]">
        <div class="activity1" @click="toActivity2(activityList[4])">
          <div class="l_top">{{activityList[4].activityTypeName}}</div>
          <div class="l_center">{{activityList[4].content}}</div>
        </div>
        <div class="activity2" v-if="activityList[5]" @click="toActivity2(activityList[5])">
          <div class="l_top">{{activityList[5].activityTypeName}}</div>
          <div class="l_center">{{activityList[5].content}}</div>
        </div>
      </div>
    </div>
    <div class="tab_search">
      <selecttab />
    </div>
    <!-- 回到顶部组件 -->
    <back-top />
  </div>
</template>
<script>
import {
  findByPosition,
  tree,
  // activityList,
  activityGroupList
} from "@/configs/interface.js";
// 引入nav栏
import navbar from "@/components/navbar/nav.vue";
import selecttab from "@/views/home/content/selecttab.vue";
// 引入swiper
import Swiper from "swiper";
import { myStorage } from "@/utils/cache.js";
// 引入公共的业务逻辑
import { isLogin, getClickCount } from "@/configs/common.js";
import { homeActivity } from "@/configs/commondata.js";
import { isURL } from "@/configs/reg.js";
import { formatFloat } from "@/utils/unitchange.js";
// 员工福利首页
export default {
  data() {
    return {
      activityList: [], // 活动列表
      // 搜索关键词
      keyWords: "",
      // 轮播图数组
      swiperImages: [],
      // 分类的渲染数组
      categoryData: [
        {
          catId: "197418993668067328",
          barId: "197418993668067328",
          barName: "家用电器",
          imgUrl: require("assets/images/home/jiayongdianqi.png")
        },
        {
          catId: "197418994586619904",
          barId: "197418994586619904",
          barName: "手机数码",
          imgUrl: require("assets/images/home/shoujishuma.png")
        },
        {
          catId: "197418995001856000",
          barId: "197418995001856000",
          barName: "电脑办公",
          imgUrl: require("assets/images/home/diannaobangong.png")
        },
        {
          catId: "197418995404509184",
          barId: "197418995404509184",
          barName: "家居日用",
          imgUrl: require("assets/images/home/jiajuchuju.png")
        },
        {
          catId: "197418996104957952",
          barId: "197418996104957952",
          barName: "男装女装",
          imgUrl: require("assets/images/home/nanzhuangnvzhuang.png")
        },
        {
          catId: "197418996880904192",
          barId: "197418996880904192",
          barName: "美妆护肤",
          imgUrl: require("assets/images/home/meizhuanghufu.png")
        },
        {
          catId: "197418997518438400",
          barId: "197418997518438400",
          barName: "箱包钟表",
          imgUrl: require("assets/images/home/xiangbaozhongbiao.png")
        },
        {
          catId: "197418997782679552",
          barId: "197418997782679552",
          barName: "运动户外",
          imgUrl: require("assets/images/home/yundonghuwai.png")
        },
        {
          catId: "197418998877392896",
          barId: "197418998877392896",
          barName: "母婴玩具",
          imgUrl: require("assets/images/home/muyingwanju.png")
        },
        {
          catId: "197418999305211904",
          barId: "197418999305211904",
          barName: "食品特产",
          imgUrl: require("assets/images/home/shipintechan.png")
        }
      ],
      // 当前滑动分类的序号
      currentPage: 0,
      // 倒计时总时长（毫秒）
      time: 0 // 60 * 60 * 60 * 1000
    };
  },
  components: {
    selecttab,
    navbar
  },
  computed: {
    // 分类菜单的渲染数据，一维转二维
    pagesData() {
      return this.arrayChange(this.categoryData, 10);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    isLogin,
    formatFloat,
    // 初始化页面渲染
    init() {
      // 获取首页banner
      this.getBannerList(11);
      // 初始化swiper
      this.initSwiper();
      // this.getTopCategory(1)
      // this.getActivityList();
      // 获取活动
      this.getGroupList();
    },
    // 活动根据activityTypeNum返回接口活动的数据
    getActivityArea(activityTypeNum) {
      let active = {};
      this.activityList.map(item => {
        if (item.activityTypeNum == activityTypeNum) {
          active = item;
        }
      });
      return active;
    },
    // 根据getActivityItem返回本地的活动信息比如路由信息还有图标
    getActivityItem(activityTypeNum) {
      let active = {};
      homeActivity.map(item => {
        if (item.value == activityTypeNum) {
          active = item;
        }
      });
      return active;
    },
    // 广告位去到活动区
    toActivity2(item) {
      let routerName = "";
      switch (item.activityTypeNum) {
        case 1: // 秒杀
          routerName = "seckill";
          break;
        case 2: // 周周精选
          routerName = "weekly";
          break;
        case 3: // 生日专区
          routerName = "birthday";
          break;
        case 4: // 节日专区
          routerName = "festival";
          break;
        case 5: // 特惠专区
          routerName = "preferential";
          break;
        case 6: // 折扣专区
          routerName = "discount";
          break;
        case 7: // 拼团
          routerName = "assemble";
          break;
        case 8: // 团购
          routerName = "groupbuying";
          break;
        case 9: // 好货抢先购
          routerName = "goodfirst";
          break;
        case 10: // 有奖回馈
          routerName = "distribution";
          break;
      }
      if (!routerName) {
        return;
      }
      this.$router.push({
        name: routerName,
        query: {
          activityId: item.activityId || null
        }
      });
    },
    // 去到活动区
    toActivity(routerName, activityId, item) {
      if (item.activityGoodsCount == 1) {
        return;
      }
      if (!routerName || !activityId) {
        return;
      }
      this.$router.push({
        name: routerName,
        query: {
          activityId: activityId || null
        }
      });
    },
    // 去到商品详情页
    toProDetail(sub, activityTypeNum) {
      // 统计点击
      getClickCount(sub.goodsId);
      this.$router.push({
        name: "productnormal",
        query: {
          id: sub.goodsId,
          activityId: sub.activityId,
          activityGoodsId: sub.activityGoodsId,
          activityTypeNum: activityTypeNum,
          groupMember: sub.groupMember || null
        }
      });
    },
    // 多个快捷入口图标点击
    toProList(item) {
      if (!isURL(item.linkUrl)) {
        return;
      }
      window.location.href = item.linkUrl;
    },
    // 获取活动列表(旧接口)
    // getActivityList() {
    //   this.$http({
    //     method: "get",
    //     url: activityList,
    //     data: null
    //   }).then(res => {
    //     if (res.code == 200) {
    //       this.activityList = res.data;
    //     }
    //   });
    // },
    // 获取活动列表(暂时接口)
    getGroupList() {
      this.$http({
        method: "get",
        url: activityGroupList,
        data: {}
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || [];
          // 过滤没有产品和生日专区
          let list = data.filter(item => {
            return (
              item.activityTypeNum != 3 &&
              item.activityHomepageGoodsReturns &&
              item.activityHomepageGoodsReturns.length > 0
            );
          });
          this.activityList = list;
        }
      });
    },
    // 获取分类
    getTopCategory(parentId) {
      this.$http({
        method: "get",
        url: tree,
        data: { parentId }
      }).then(res => {
        if (res.code == 200) {
          this.categoryData = res.data;
        }
      });
    },
    // 去搜索详情
    toSearchDetail(barId, catId) {
      this.$router.push({
        name: "searchDetail",
        query: { catId, barId }
      });
    },
    // 激活轮播效果
    initSwiper() {
      // swiper轮播图
      let swiper = new Swiper(".swiper-container", {
        slidesPerView: 1.2,
        spaceBetween: 5,
        centeredSlides: true,
        loop: true,
        observer: true,
        observeParents: false,
        autoplay: true
        // pagination: {
        //   el: ".swiper-pagination",
        //   clickable: true
        // }
      });
    },
    // 获取首页banner
    getBannerList(positionId) {
      this.$http({
        method: "get",
        url: findByPosition,
        data: { positionId }
      }).then(res => {
        if (res.code == 200) {
          switch (positionId) {
            case 11:
              this.swiperImages = res.data;
              break;
          }
        }
      });
    },
    // 去登陆
    toLogin() {
      this.$router.push({
        name: "login"
      });
    },
    // 去个人中心
    toPersonal() {
      this.$router.push({
        name: "personal"
      });
    },
    // 去分类搜索
    toCategory() {
      this.$router.push({
        name: "category"
      });
    },
    // 聚集焦点时
    focusChange() {
      this.$router.push({
        name: "headsearch"
      });
    },
    // 一维数组转化为二维数组的方法,objArray表示一维数组，num表示二维数组里的一个数组多少个元素
    arrayChange(objArray, num) {
      // 一维数组的个数
      const len = objArray && objArray.length;
      // 分成几份
      const totalNum = len % num == 0 ? len / num : Math.floor(len / num + 1);
      let res = [];
      for (let i = 0; i < totalNum; i++) {
        let temp = objArray.slice(i * num, i * num + num);
        res.push(JSON.parse(JSON.stringify(temp)));
      }
      return res;
    },
    // 滑动切换从而切换下标
    changeCategory(index) {
      this.currentPage = index;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-home-index {
  height: 100%;
  background-color: $lightColor;
  overflow-y: scroll;
  // 秒杀商品
  .show_product_seckill {
    padding: 0 10px;
    margin-top: 22px;
    .imgWrap {
      width: 60px;
      height: 72px;
      margin-right: 6px;
      .prod_img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .red_p {
      color: #ff3a44;
    }
    .price {
    }
    .lose_price {
      font-size: 8px;
      text-decoration: line-through;
      color: rgba(102, 102, 102, 1);
    }
  }
  // 头部操作栏
  .bg_header {
    width: 100%;
    height: 168px;
    background: url("~assets/images/home/red_bgc.png") no-repeat;
    background-size: contain;
    background-position: center;
    .header_bar {
      .category_icon {
        font-size: 22px;
      }
      .van-search {
        width: 100%;
      }
      .account_img {
        width: 22px;
        height: 22px;
      }
      .please_login {
        color: #fff;
        font-size: 14px;
      }
    }
  }
  // 轮播图组件
  .swiper_area {
    width: 100%;
    height: 140px;
    margin-top: -94px;
    .swiper-container {
      width: 100%;
      height: 140px;
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
  // 分类
  .category_box {
    width: 355px;
    margin: 10px auto 0;
    background-color: #fff;
    .categoryPage {
      display: flex;
      flex-wrap: wrap;
      color: #333;
      justify-content: center;
      .items {
        width: calc(100% / 5);
        height: 87px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        img {
          width: 44px;
          height: 44px;
        }
        .text {
          font-size: 11px;
        }
      }
    }
    // 下标的样式
    .footer_tab {
      margin-left: 50%;
      padding: 10px 0;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      .tab {
        display: inline-block;
        width: 10px;
        height: 4px;
        border-radius: 2px;
        background-color: #ddd;
      }
      .tab:nth-of-type(n + 2) {
        margin-left: 6px;
      }
      .active_tab {
        width: 15px;
        background-color: $mainColor;
      }
    }
  }
  // 限时抢券
  .banner1 {
    width: 352px;
    height: 92px;
    margin: auto;
    background-image: url("~assets/images/home/banner1.png");
    background-size: 352px 92px;
    background-repeat: no-repeat;
    background-position: center;
    box-sizing: border-box;
    text-align: center;
    color: #fff;
    padding-top: 26px;
    h4 {
      font-size: 16px;
      font-weight: bold;
    }
    .discount {
      width: 120px;
      height: 20px;
      border: 1px solid #fff;
      border-radius: 10px;
      font-size: 12px;
      text-align: center;
      line-height: 20px;
      margin-left: 50%;
      transform: translateX(-50%);
      margin-top: 10px;
    }
  }
  // 活动模块
  .activities {
    width: 355px;
    background-color: #fff;
    margin: 12px auto 0;
    display: flex;
    flex-wrap: wrap;
    .activities_item {
      width: calc(100% / 2 - 2px);
      padding: 10px 0;
      .main_title {
        display: flex;
        align-items: center;
        padding-left: 11px;
        padding-top: 11px;
        img {
          width: 14px;
          height: 14px;
        }
        .main_name {
          margin: 0 5px;
          font-size: 16px;
        }
        .option {
          display: inline-block;
          width: 18px;
          height: 20px;
          line-height: 20px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          background-color: $mainColor;
          border-radius: 3px;
        }
        .colon {
          color: #333;
          font-size: 12px;
          padding: 1px;
        }
      }
      .sub_title {
        font-size: 12px;
        color: #666;
        padding-left: 28px;
        margin-top: 5px;
      }
      .show_product {
        margin-top: 15px;
        display: flex;
        padding: 0 10px;
        .prod_info {
          display: flex;
          width: 50%;
          margin-right: 5px;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100px;
        }
        .prod_img {
          height: 64px;
          max-width: 100%;
        }
        .pintuan_btn {
          display: inline-block;
          padding: 4px;
          border: 1px solid rgba(221, 221, 221, 1);
          border-radius: 12px;
          white-space: nowrap;
        }
        .price {
          font-size: 14px;
          color: $mainColor;
        }
        .lose_price {
          color: #666;
        }
      }
    }
    .activities_item:nth-of-type(2n) {
      border-bottom: 1px solid #f3f4f9;
    }
    .activities_item:nth-of-type(2n + 1) {
      border-bottom: 1px solid #f3f4f9;
      border-right: 1px solid #f3f4f9;
    }
  }
  // 查看更多好市客报
  .activities_bottombar {
    display: flex;
    padding: 11px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .kuaibao {
      color: $mainColor;
      font-weight: bold;
    }
    .kuaibao_icon {
      padding: 2px 5px;
      background: rgba(255, 58, 68, 0.2);
      border-radius: 7px;
      display: inline-block;
      color: $mainColor;
      margin: 0 10px;
    }
    .more_right {
      color: $mainColor;
    }
  }
  // 折扣专区标题
  .foryou {
    text-align: center;
    padding-top: 14px;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 15px;
        height: 19px;
      }
      span {
        font-size: 14px;
        font-weight: bold;
        margin-left: 2px;
      }
    }
    .discount {
      width: 350px;
      height: 100px;
      background-image: url("~assets/images/home/banner2.png");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 350px 100px;
      margin: 0 auto;
      font-size: 12px;
      color: #fff;
      padding-top: 22px;
      box-sizing: border-box;
      .discount_wrapper {
        padding-left: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .top {
          font-size: 16px;
          font-weight: bold;
          height: 16px;
        }
        .center {
          height: 12px;
          margin-top: 10px;
        }
        .bottom {
          width: 66px;
          height: 22px;
          background-color: #ffbd0f;
          border-radius: 11px;
          line-height: 22px;
          margin-top: 8px;
        }
      }
    }
  }
  // 折扣专区
  .three_button {
    width: 348px;
    margin: 6px auto;
    display: flex;
    color: #fff;

    .l_top {
      font-size: 16px;
      font-weight: bold;
      margin-left: 14px;
      // margin-top: 15px;
    }
    .l_center {
      font-size: 12px;
      margin-left: 14px;
    }
    .l_bottom {
      width: 39px;
      height: 16px;
      margin-left: 14px;
      margin-top: 6px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .cheap_area {
      height: 196px;
      width: 129px;
      background-color: #ff694f;
      border-radius: 5px;
      padding-top: 10px;
      box-sizing: border-box;
      background: url("~assets/images/home/banner_preferential.png") no-repeat;
      background-size: 100% 100%;
    }
    .right_area {
      height: 196px;
      width: 208px;
      margin-left: 10px;
      // 节日专区
      .festival {
        width: 208px;
        height: 92px;
        border-radius: 5px;
        background: url("~assets/images/home/banner_festival.png") no-repeat;
        background-size: 100% 100%;
      }
      // 生日专区
      .birthday {
        width: 208px;
        height: 92px;
        border-radius: 5px;
        margin-top: 11px;
        background: url("~assets/images/home/banner_birthday.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .twoActivityWrap {
    width: 348px;
    margin: auto;
    color: #fff;
    .activity1 {
      width: 170px;
      height: 92px;
      box-sizing: border-box;
      background: url("~assets/images/home/banner_group.png") no-repeat;
      background-size: 100% 100%;
    }
    .activity2 {
      width: 170px;
      height: 92px;
      box-sizing: border-box;
      background: url("~assets/images/home/banner_weekly.png") no-repeat;
      background-size: 100% 100%;
    }
    .l_top {
      font-size: 16px;
      font-weight: bold;
      margin-left: 14px;
      // margin-top: 15px;
    }
    .l_center {
      font-size: 12px;
      margin-left: 14px;
    }
  }
  .tab_search {
    margin-top: 30px;
  }
}
</style>
