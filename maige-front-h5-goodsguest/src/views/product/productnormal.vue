<template>
  <div class="v-product-productnormal">
    <div ref="headertab" class="header_tab" v-show="showTab">
      <van-icon @click="() => this.$router.go(-1)" class="return_icon" name="arrow-left" />
      <crosscontainer>
        <template slot="container">
          <div class="tab_box">
            <div
              :class="currentActive === index ? 'tab_item tab_active' : 'tab_item'"
              :key="item.name"
              v-for="(item, index) in tabData"
              @click="clickTab(item, index)"
            >{{item.name}}</div>
            <div class="bottom_line" :style="{transform: `translateX(${100 * currentActive}%)`}"></div>
          </div>
        </template>
      </crosscontainer>
    </div>
    <div ref="home" class="product_header">
      <navbar v-if="!showTab" title="商品详情" color="#fff">
        <template slot="right">
          <img
            class="right_icon"
            v-if="false"
            @click="share"
            src="~assets/images/product/fenxiang.png"
          />
        </template>
      </navbar>
      <sharemodal :showmodal="showshare" @hide="hideShare" />
    </div>
    <div class="show_product">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div :key="index" v-for="(item, index) in goodsInfo.galleryList" class="swiper-slide">
            <img v-lazy="item.imgOriginalUrl || item.imgUrl" />
            <img v-if="!goodsInfo.galleryList || goodsInfo.galleryList.length == 0" v-lazy="goodsInfo.skuDetailList[0].thumbnailImgUrl" />
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <!-- 头部 -->
    <div class="puzzle" v-if="isActivity">
      <div>
        <div class="flex_start">
          <span v-if="$route.query.activityTypeNum == 8">{{activityPriceName}}: ¥{{minGroupPrice}}</span>
          <span v-else>{{activityPriceName}}: ¥{{currentInfo.goodsPrice}}</span>
          <span
            style="font-size: 12px;margin-left: 4px"
            class="through"
          >市场价：¥{{currentInfo.costPrice}}</span>
        </div>
        <p v-if="$route.query.activityTypeNum == 8 || $route.query.activityTypeNum == 7">
          已
          <span v-if="$route.query.activityTypeNum == 8">团</span>
          <span v-if="$route.query.activityTypeNum == 7">拼</span>
          {{goodsInfo.activityGoodsSaleVolumn}}件
        </p>
      </div>
      <div class="countDown flex_column_start" v-if="activityData">
        <p style="color: #fff">距离活动结束还剩：</p>
        <van-count-down
          styles="color: #fff"
          :time="$moment(activityData.entTime, 'YYYY-MM-DD HH:mm:ss').valueOf() - Date.now()"
          format="DD 天 HH 时 mm 分 ss 秒"
        />
      </div>
    </div>
    <!-- 团购 -->
    <div v-if="$route.query.activityTypeNum == 8" class="flex_start ladderPrice">
      <div v-for="item in ladderPrices" :key="item.ladderPriceId">
        <span class="s1">{{item.needMember}}人团：</span>
        <span class="s2">{{item.ladderPrice}}</span>
      </div>
    </div>
    <!-- 分销 -->
    <div v-if="$route.query.activityTypeNum == 10">
      <p style="text-align:center;color: #FF3945;padding: 12px 0;">发起分销，邀请朋友下单成功后，每单奖励{{rewardIntegral}}积分</p>
    </div>
    <!-- 商品信息 -->
    <div class="description">
      <div class="des two-txt-cut">{{goodsInfo.goodsName}}</div>
      <div class="price_box" v-if="!isActivity">
        <span class="price_note">商城价：</span>
        <span class="now_price">￥{{currentInfo.goodsPrice}}</span>
        <del class="last_price">市场价：{{currentInfo.costPrice}}</del>
      </div>
    </div>
    <div class="label_wrap">
      <i v-if="goodsInfo.goodsType" class="label">{{goodsInfo.goodsType}}</i>
    </div>
    <div v-if="false" class="cheap_cash">
      <span class="cash_title">领券</span>
      <div class="cash_content">
        <span></span>
      </div>
      <span class="click_icon">
        <van-icon name="arrow" />
      </span>
    </div>
    <div class="show_productinfo">
      <div class="info_item" @click="showChoose(false)">
        <span class="item_title">已选</span>
        <div class="info_content one-txt-cut">{{chooseResult}}</div>
        <span class="click_icon">
          <van-icon name="arrow" />
        </span>
      </div>
      <buymodal
        v-model="isChoose"
        :data="goodsInfo"
        @chooseChange="chooseChange"
        @numChange="numChange"
        @hide="hideChoose"
        @showGroup="showGroup"
        :buyNow="buyNow"
        :groupId="groupId"
        :isAssemble="isAssemble"
        :isActivity="isActivity"
        :isGroup="isGroup"
        :addShoppingCart="addShoppingCart"
      />
      <div class="info_item" @click="showAddrModal">
        <span class="item_title">送至</span>
        <div class="info_content one-txt-cut">
          <img v-if="addressData" class="address_icon" src="~assets/images/product/dingwei.png" />
          <span>{{addressData ? (addressData.provinceName + addressData.districtName + addressData.cityName + addressData.address) : ""}}</span>
        </div>
        <span class="click_icon">
          <van-icon name="arrow" />
        </span>
      </div>
      <addrmodal v-if="showAddr" v-model="showAddr" @hide="hideAddr" @addrChange="addrChange" />
      <div class="info_item">
        <!-- <span class="item_title">运费</span> -->
        <!-- <div class="info_content one-txt-cut">99元包邮（50kg内）</div> -->
      </div>
    </div>

    <!-- 分销展示 -->
    <div class="jigsaw" v-if="$route.query.activityTypeNum == 10 && distributionArr.length > 0">
      <div class="tilte">
        <span>正在购</span>
        <span @click="moreDistributionShow = true">查看更多></span>
      </div>
      <div class="tent" v-for="item in distributionArr.slice(0,2)" :key="item.groupId">
        <img :src="item.userHeadPhoto" alt />
        <span class="name">{{item.groupName || item.userName}}</span>
        <div class="top-div">
          <div class="btn" @click="buyTogethe(item)">一起购</div>
        </div>
      </div>
    </div>

    <!-- 团购展示 -->
    <div class="jigsaw" v-if="$route.query.activityTypeNum == 8 && currentGroups.length > 0">
      <div class="tilte">
        <span>正在团</span>
        <span @click="groupshow = true">查看更多></span>
      </div>
      <div class="tent" v-for="item in currentGroups.slice(0,2)" :key="item.groupId">
        <div class="flex_start">
          <div class="flex" style="width: 50px;height: 50px;margin-right: 10px;background: #ccc">
            <img class="inherit_size" :src="item.userHeadPhoto" alt />
          </div>
          <div>
            <p class="name">{{item.groupName || item.userName}}</p>
            <p class="name">
              <span>￥</span>
              <span style="color: #FF3945">{{item.successPrice}}</span>
            </p>
          </div>
        </div>
        <div style="margin-left: 10px; text-align: left;color: #666;">
          <p>团购奖励</p>
          <p>{{item.accountNum}}积分</p>
        </div>
        <div class="top-div">
          <div class="content">
            <span>还差{{item.needNumber - item.number}}人拼团</span>
            <span style="display: flex;">
              <van-count-down :time="item.time" />
            </span>
          </div>
          <div class="btn" @click="gopuzzle(item)">去拼团</div>
        </div>
      </div>
    </div>

    <!-- 拼团展示 -->
    <div class="jigsaw" v-if="$route.query.activityTypeNum == 7 && puzzleArr.length > 0">
      <div class="tilte">
        <span>{{puzzleArr.length}}人在拼团，可直接参与</span>
        <span @click="groupshow = true">查看更多></span>
      </div>
      <div class="tent" v-for="item in puzzleArr.slice(0,2)" :key="item.groupId">
        <img :src="item.userHeadPhoto" alt />
        <span class="name">{{item.groupName}}</span>
        <div class="top-div">
          <div class="content">
            <span>还差{{$route.query.groupMember - item.number}}人拼团</span>
            <span style="display: flex;">
              <span style="margin-right:5px">剩余时间</span>
              <van-count-down :time="item.time" />
            </span>
          </div>
          <div class="btn" @click="gopuzzle(item)">去拼团</div>
        </div>
      </div>
    </div>

    <!-- 评价 -->
    <div class="comments_admin" @click="toComments">
      <div ref="comments" class="comments_head">
        <div class="red_icons">评价（{{commentsInfo.count}}）</div>
        <div class="head_right">
          <span>好评度</span>
          <span>{{commentsInfo.count && commentCount ? (formatFloat((commentCount.goodCount || 0) / commentsInfo.count * 100) + '%') : '0%'}}</span>
          <van-icon name="arrow" />
        </div>
      </div>
      <commentschunk
        :item="item"
        :key="index"
        v-for="(item, index) in commentsInfo.pageList"
        :showAll="false"
      />
      <div v-if="commentsInfo.count" class="find_more">
        <span class="find_btn">查看全部评价</span>
      </div>
      <div v-if="!commentsInfo.count" class="none_comments">暂无评价</div>
    </div>
    <!-- 推荐 -->
    <div ref="recommend" class="recommend_area">
      <recommend :paramter="goodsInfo" />
    </div>
    <!-- 商品信息 -->
    <div class="product_infomation">
      <div class="parameter_info">
        <div ref="instruction" class="parameter_title">
          <span class="red_icons">规格参数</span>
        </div>
        <div class="parameter_content">
          <div class="parameter_item" :key="index" v-for="(item, index) in attrList">
            <span>{{item.attrName}}：</span>
            <span>{{item.attrValue}}</span>
          </div>
        </div>
        <div class="serve_title">
          <span class="red_icons">售后服务</span>
        </div>
        <div class="serve_content">
          <div class="serve_item" :key="index" v-for="(item, index) in serveDeclare">
            <img :src="item.icon" alt />
            <div class="info">
              <div class="info_title">{{item.title}}</div>
              <div class="info_content">{{item.content}}</div>
            </div>
          </div>
        </div>
        <div class="statement">
          <div class="statement_title">声明：</div>
          <div class="statement_content">
            因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，本司不
            能确保客户收到的货物与商城图片、产地、附件 说明完全一致。只能确保为原厂正
            货！并且保证与当时市场上同样主流新品一致。若本商城没有及时更新，请大家谅解！
          </div>
        </div>
      </div>
      <pre v-html="html">{{html}}</pre>
    </div>
    <!-- 看了又看 -->
    <div class="look_again">
      <lookagain :paramter="goodsInfo" />
    </div>
    <!-- 底部导航 -->
    <div class="footer_operation">
      <div class="img_area">
        <img class="left_img" src="~assets/images/product/kefu.png" alt />
        <img class="left_img" src="~assets/images/product/shoucang.png" alt />
        <div class="cart_box">
          <img class="left_img" src="~assets/images/product/gouwuche.png" @click="toCart" />
          <div class="show_num">{{goodsNum > 100 ? '...' : goodsNum}}</div>
        </div>
      </div>
      <!-- 分销按钮 -->
      <div class="btn_box" v-if="$route.query.activityTypeNum == '10'">
        <div
          class="right_btn"
          style="background: linear-gradient(90deg,rgba(255,57,69,1), rgba(255,78,54,1))"
        >
          <div @click="addToDistribution" class="bottom_text">发起发销</div>
        </div>
      </div>
      <!-- 团购按钮 -->
      <div class="btn_box" v-else-if="$route.query.activityTypeNum == '8'">
        <div class="left_btn" style="background: rgba(255,163,44,1)">
          <div @click="buyOk('true')" class="bottom_text">单独购买</div>
        </div>
        <div
          class="right_btn"
          style="background: linear-gradient(90deg,rgba(255,57,69,1), rgba(255,78,54,1))"
        >
          <div @click="initGroupBuy" class="bottom_text">发起团购</div>
        </div>
      </div>
      <!-- 拼团按钮 -->
      <div class="btn_box" v-else-if="$route.query.activityTypeNum == '7'">
        <div class="left_btn">
          <div @click="buyOk('true')" class="bottom_text">单独购买</div>
        </div>
        <div class="right_btn">
          <div @click="initAssemble" class="bottom_text">发起拼团</div>
        </div>
      </div>
      <!-- 一般按钮 -->
      <div class="btn_box" v-else>
        <div class="left_btn" v-if="!isActivity">
          <div @click="showChoose(true)" class="bottom_text">加入购物车</div>
        </div>
        <div class="right_btn">
          <div @click="buyOk" class="bottom_text">立即购买</div>
        </div>
      </div>
    </div>

    <!-- 团购阶梯价选择 -->
    <van-overlay :show="groupbuyingshow" @click="groupbuyingshow = false">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="title">
            正在团购
            <span>
              <img src="~assets/images/product/close.png" @click="groupbuyingshow = false" />
            </span>
          </div>
          <div class="groupTent">
            <div
              class="groupDiv"
              :class="{selectedDiv: selectedIndex === index}"
              v-for="(item, index) in ladderPrices"
              @click="selectGroup(item, index)"
              :key="index"
            >
              <p class="p1">{{item.needMember}}人团</p>
              <div class="sWrap">
                <span class="s1">￥</span>
                <span class="s2">{{item.ladderPrice}}</span>
                <span class="s3">减{{formatFloat(currentInfo.costPrice - item.ladderPrice, 2)}}元</span>
              </div>
              <div class="origin">原价：￥{{currentInfo.costPrice}}</div>
              <div style="margin-top: 4px;color: mediumvioletred" v-if="item.groupLeaderAccount">开团奖励：{{item.groupLeaderAccount}}积分</div>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>

    <!-- 分销查看更多弹窗 -->
    <van-overlay :show="moreDistributionShow" @click="moreDistributionShow = false">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="title">
            一起购
            <span>
              <img src="~assets/images/product/close.png" @click="moreDistributionShow = false" />
            </span>
          </div>
          <div class="tent">
            <div class="tentdiv" v-for="item in distributionArr" :key="item.groupId">
              <div class="flex_start">
                <div
                  class="flex"
                  style="width: 50px;height: 50px;margin-right: 4px;background: #ccc"
                >
                  <img class="inherit_size" :src="item.userHeadPhoto" alt />
                </div>
                <div>
                  <p class="name">{{item.groupName || item.userName}}</p>
                </div>
              </div>
              <div class="top-div">
                <div class="btn" @click="buyTogethe(item)">一起购</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>

    <!-- 拼团/团购查看更多弹窗 -->
    <van-overlay :show="groupshow" @click="groupshow = false">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="title">
            正在拼团
            <span>
              <img src="~assets/images/product/close.png" @click="groupshow = false" />
            </span>
          </div>
          <div class="tent">
            <div class="tentdiv" v-for="item in currentGroups" :key="item.groupId">
              <div class="flex_start">
                <div
                  class="flex"
                  style="width: 50px;height: 50px;margin-right: 4px;background: #ccc"
                >
                  <img class="inherit_size" :src="item.userHeadPhoto" alt />
                </div>
                <div>
                  <p class="name">{{item.groupName || item.userName}}</p>
                  <p class="name">
                    <span>￥</span>
                    <span style="color: #FF3945">{{item.successPrice}}</span>
                  </p>
                </div>
              </div>
              <div style="margin-left: 10px; text-align: left;color: #666;">
                <p>团购奖励</p>
                <p>{{item.accountNum}}积分</p>
              </div>
              <div class="top-div">
                <div class="content">
                  <span>还差{{item.needNumber - item.number}}人拼团</span>
                  <span style="display: flex;">
                    <van-count-down :time="item.time" />
                  </span>
                </div>
                <div class="btn" @click="gopuzzle(item)">去拼团</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>

    <!-- 分销 -->
    <van-overlay :show="distributionShow" @click="distributionShow = false">
      <div class="wrapper" @click.stop>
        <div class="sbt">
          <div class="title">
            一起购
            <span>
              <img src="~assets/images/product/close.png" @click="distributionShow = false" />
            </span>
          </div>
          <div class="tent">
            <div class="name-div">
              参与
              <span>{{selectedDistribution && selectedDistribution.userName}}</span> 的团
            </div>
            <div class="img-div">
              <img :src="selectedDistribution.userHeadPhoto" alt />
              <img :src="userData.headImgUrl" alt />
            </div>
            <div class="btn" @click="submitpuzzle(selectedDistribution.groupId)">一起购</div>
          </div>
        </div>
      </div>
    </van-overlay>

    <!-- 拼团/团购按钮 -->
    <van-overlay :show="subshow" @click="subshow = false">
      <div class="wrapper" @click.stop>
        <div class="sbt">
          <div class="title">
            正在拼团
            <span>
              <img src="~assets/images/product/close.png" @click="subshow = false" />
            </span>
          </div>
          <div class="tent">
            <div class="name-div">
              参与
              <span>{{puzzledata && puzzledata.userName}}</span> 的团
            </div>
            <div class="time">
              还差
              <span class="color">{{puzzledata.needNumber - puzzledata.number}}</span>人成团，剩余时间
              <van-count-down :time="puzzledata.time" />
            </div>
            <div class="img-div">
              <img :src="puzzledata.userHeadPhoto" alt />
              <img :src="userData.headImgUrl" alt />
            </div>
            <div class="btn" @click="submitpuzzle(puzzledata.groupId)">去拼团</div>
          </div>
        </div>
      </div>
    </van-overlay>
    <!-- 回到顶部组件 -->
    <back-top />
  </div>
</template>

<script>
/**
 * 普通商品/详情
 */
// 头部的标题栏组件
import navbar from "@/components/navbar/nav";
// 引入swiper
import Swiper from "swiper";
// 引入选择商品弹窗
import buymodal from "@/views/product/modal/buymodal";
// 引入地址弹窗
import addrmodal from "@/views/product/modal/addrmodal";
// 分享弹窗
import sharemodal from "@/views/product/modal/sharemodal";
// 滚动容器
import crosscontainer from "@/components/crosscontainer/index.vue";
// 评价单元块
import commentschunk from "@/views/product/content/commentschunk.vue";
// 为你推荐/热销排行/猜你喜欢
import recommend from "@/views/product/content/recommend.vue";
// 看了又看
import lookagain from "@/views/product/content/lookagain.vue";
//引入缓存用户数据
import { myStorage } from "@/utils/cache.js";
import { Toast } from "vant";
// 接口
import {
  findReward,
  addDistribution,
  reqDistribution,
  activitySearchById,
  addAssemble,
  findAssemble,
  findLadderPrice,
  assembleKey,
  goodsDetail,
  goodsComments,
  threeModule,
  hotRank,
  addressList,
  goodsdetailFinddetail,
  findassemblepage,
  joinassemble,
  imgData
} from "@/configs/interface.js";
// 公共的请求
import { addShopCart, getShopCartNum, isLogin } from "@/configs/common.js";
// 格式化保留并输出浮点数小数, 和格式化亿万单位
import { unitChange, formatFloat } from "@/utils/unitchange.js";
// 数组的排序方法
import { sortBy } from "@/utils/arrfunction.js";
export default {
  name: "productinfo",
  data() {
    return {
      moreDistributionShow: false, // 显示更多分销团弹窗
      distributionShow: false, // 显示已选分销团弹窗
      selectedDistribution: [], // 选择的分销团
      rewardIntegral: 0, // 分销奖励积分
      distributionArr: [], // 已有分销团
      isBindAddress: 0, // 是否绑定团购地址
      activityData: null, // 活动信息
      skuId: "", // 选择的skuId
      addShoppingCart: false, // 填加至购物车
      isGroup: false, // 是否是团购
      minGroupPrice: 0, // 最小团购价
      currentGroups: [], // 现有的团
      ladderPrices: [], // 阶梯价
      selectedIndex: null, // 选择的团
      groupbuyingshow: false, // 团购详情
      activityPriceName: "", // 活动价名
      isActivity: false, // 是否来自活动
      // 选择的拼团信息
      groupId: "",
      // 是否显示tab栏
      showTab: false,
      // 商品的详细信息
      goodsInfo: {},
      // 商品的图片资源html
      html: "",
      // 当前型号信息
      currentInfo: {},
      // 当前选择的商品信息
      chooseGoods: {},
      // 已经选择好的型号/数量字符串
      chooseResult: "",
      // 购物车的所有商品数量
      goodsNum: 0,
      // 当前选择地址对象
      addressData: null,
      // 是否展开选择商品弹窗
      isChoose: false,
      // 是否为立即购买
      buyNow: false,
      // 是否为拼团
      isAssemble: false,
      // 评价信息
      commentsInfo: {},
      // 评价的计数
      commentCount: {},
      // 是否打开地址弹窗
      showAddr: false,
      // 是否打开分享弹窗
      showshare: false,
      groupshow: false, //拼团查看更多弹窗
      subshow: false, //发起拼团按钮
      // 当前的tab栏序号
      currentActive: 0,
      // tab的渲染数组
      activityId: "", // 活动id  存在时显示拼团价格,不然显示商城价
      activityGoodsId: "", //活动商品id
      pageNum: 1, //分页查询拼团
      puzzleArr: [], //拼团数据
      userData: {}, //用户数据
      puzzledata: {}, // 单个拼团数据
      tabData: [
        {
          // tab名字
          name: "商品",
          // 对应内容的ref
          ref: "home"
        },
        {
          name: "评价",
          ref: "comments"
        },
        {
          name: "详情",
          ref: "instruction"
        },
        {
          name: "推荐",
          ref: "recommend"
        }
      ],
      // 所有要跳转的位置数组
      arrDom: [],
      // 规格参数数组
      attrList: [],
      // 售后服务说明数组
      serveDeclare: [
        {
          icon: require("assets/images/product/zheng.png"),
          title: "正品行货",
          content:
            "消费者在商城购买带有'全国联保'标识商品后，可享受全国联保服务，与您亲临商场选购的商品享受相同的质量保证"
        },
        {
          icon: require("assets/images/product/bao.png"),
          title: "全国联保",
          content:
            "消费者在商城购买带有'全国联保'标识商品后，可享受全国联保服务，与您亲临商场选购的商品享受相同的质量保证"
        },
        {
          icon: require("assets/images/product/tui.png"),
          title: "7天无忧退换货",
          content:
            "客户收到商城产品7日内（含7日，自客户收到商品之日起计算），在保证商品完好,不影响二次销售的前提下，可无理由退货。非质量问题造成的售后，需由客户承担来回快递费用;发错货物由发货方承担来回快递费用。（个别商品恕不接受退货，详情请提前咨询客服。）"
        }
      ]
    };
  },
  props: {},
  components: {
    navbar,
    buymodal,
    addrmodal,
    sharemodal,
    crosscontainer,
    commentschunk,
    recommend,
    lookagain
  },
  watch: {
    $route: function() {
      this.needOperation();
    }
  },
  created() {
    //获取用户数据
    const userData = myStorage.get("userData");
    if (userData) {
      this.userData = userData;
    }
  },
  mounted() {
    if (this.$route.query.activityTypeNum) {
      this.isActivity = true;
      this.getActivityType();
    }
    // 登录
    this.needOperation();
    // 轮播图
    var swiper = new Swiper(".swiper-container", {
      slidesPerView: 1.1,
      spaceBetween: 30,
      centeredSlides: true,
      observer: true,
      observeParents: false,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      }
    });
    // 获取要跳转的位置的所有dom数组
    this.tabData &&
      this.tabData.map((item, index) => {
        const dom = this.$refs[item.ref];
        if (dom) {
          this.arrDom.push({
            dom,
            index
          });
        }
      });
    let singleAddress = this.$store.state.common.singleAddress;
    if (singleAddress) {
      this.addressData = singleAddress;
    } else {
      this.getAddress();
    }
    this.init();
    // 根节点绑定滚动事件监听tab栏
    this.$el.addEventListener("scroll", this.scrolling);
  },
  beforeDestroy() {
    //  组件销毁的时候，需要删除scroll的监听事件。
    this.$el.removeEventListener("scroll", this.scrolling);
  },
  methods: {
    scroll,
    // 格式化浮点数
    formatFloat,
    // 初始化数据
    init() {
      if (this.$route.query.activityId) {
        this.getActivityDetail();
      }
    },
    /* 分销活动 */
    // 一起购
    buyTogethe(item) {
      this.selectedDistribution = item
      this.distributionShow = true
    },
    // 获取分销奖励积分
    getReward() {
      this.$http({
        method: 'GET',
        url: findReward,
        data: {
          activityGoodsId: this.$route.query.activityGoodsId,
          skuId: this.skuId,
        }
      }).then((res) => {
        if (res.code === 200) {
          this.rewardIntegral = res.data.rewardNumber
        }
      })
    },
    // 获取分销信息
    getDistributionDetail() {
      this.$http({
        method: "POST",
        url: reqDistribution,
        data: {
          pageNum: 1,
          pageSize: 10,
          skuId: this.skuId,
          activityGoodsId: this.$route.query.activityGoodsId,
          activityId: this.$route.query.activityId
        }
      }).then(res => {
        if (res.code === 200) {
          const data = res.data || {}
          this.distributionArr = data.list ? data.list : [];
          this.distributionArr.forEach(item => {
            item.time =
              this.$moment(item.endTime, "YYYY-MM-DD HH:mm:ss").valueOf() -
              Date.now();
          });
        }
      });
    },
    // 加入分销
    addToDistribution() {
      this.$http({
        method: "GET",
        url: addDistribution,
        data: {
          skuId: this.skuId,
          activityId: this.$route.query.activityId,
          activityGoodsId: this.$route.query.activityGoodsId,
        }
      }).then((res) => {
        if (res.code === 200) {
          this.submitpuzzle(res.data)
        }
      })
    },
    /* 分销活动 */
    // 获取活动商品信息
    getActivityDetail() {
      this.$http({
        method: "GET",
        url: activitySearchById,
        data: {
          activityId: this.$route.query.activityId
        }
      }).then(res => {
        if (res.code === 200) {
          this.activityData = res.data;
          this.isBindAddress = res.data.isBandAddress;
        }
      });
    },
    // 获取拼团
    selectGroup(item, index) {
      // 增加团购
      this.addGroup(item.needMember, item.ladderPrice);
      this.selectedIndex = index;
    },
    // 唤醒团购弹窗
    showGroup() {
      this.isChoose = false;
      this.groupbuyingshow = true;
    },
    // 发起团购
    initGroupBuy() {
      if (JSON.stringify(this.chooseGoods) === "{}") {
        this.isGroup = true;
        this.isChoose = true;
        return;
      }
      this.groupbuyingshow = true;
    },
    // 增加团购
    addGroup(needNumber, price) {
      this.$http({
        method: "GET",
        url: addAssemble,
        data: {
          activityGoodsId: this.$route.query.activityGoodsId,
          activityId: this.$route.query.activityId,
          skuId: this.skuId,
          needNumber,
          price
        }
      }).then(res => {
        if (res.code === 200) {
          this.groupId = res.data;
          this.buyGroupOK(this.groupId);
        }
      });
    },
    // 确定发起团购
    buyGroupOK(groupId) {
      let data = {
        activityGoodsId: this.$route.query.activityGoodsId, // 活动商品Id
        activityId: this.$route.query.activityId, // 活动Id
        activityTypeNum: this.$route.query.activityTypeNum, // 活动类型num
        goodsId: this.$route.query.id, // 商品id
        groupId, // 拼团id
        quantity: this.chooseGoods.productNum, // 当前商品数量
        skuId: this.chooseGoods.skuId, // 当前规格商品的skuid
        useIntegral: 0, // 是否使用积分1：是；0：否
        payId: 0 //支付方式id
      };
      this.$store.commit("common/setBuyNow", data);
      this.$router.push({
        name: "orderSubmit",
        query: {
          address: "0",
          // 1表示立即购买 0表示购物车结算
          buyNow: 1,
          activityId: this.$route.query.activityId
        }
      });
    },
    // 查询团购
    getGroup() {
      this.$http({
        method: "POST",
        url: findAssemble,
        data: {
          activityId: this.$route.query.activityId,
          activityGoodsId: this.$route.query.activityGoodsId,
          skuId: this.skuId,
          pageNum: 1,
          pageSize: 100,
          status: 1
        }
      }).then(res => {
        if (res.code === 200) {
          this.currentGroups = res.data.list;
          this.currentGroups.forEach(item => {
            item.time =
              this.$moment(item.endTime, "YYYY-MM-DD HH:mm:ss").valueOf() -
              Date.now();
          });
        }
      });
    },
    // 查询天梯价
    getLadderPrice() {
      this.$http({
        method: "GET",
        url: findLadderPrice,
        data: {
          activityGoodsId: this.$route.query.activityGoodsId,
          skuId: this.skuId
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data || [];
          this.ladderPrices = data;
          // 将数组排序，升序
          if (data) {
            data = data.sort(sortBy("ladderPrice"));
          }
          this.minGroupPrice = data[0] && data[0].ladderPrice;
        }
      });
    },
    // 获取活动类型
    getActivityType() {
      const id = parseInt(this.$route.query.activityTypeNum, 10);
      switch (id) {
        case 1: // 秒杀
          this.activityPriceName = "秒杀价";
          break;
        case 2: // 周周精选
          this.activityPriceName = "精选价";
          break;
        case 3: // 生日专区
          this.activityPriceName = "生日价";
          break;
        case 4: // 节日专区
          this.activityPriceName = "节日价";
          break;
        case 5: // 特惠专区
          this.activityPriceName = "特惠价";
          break;
        case 6: // 折扣专区
          this.activityPriceName = "折扣价";
          break;
        case 7: // 拼团
          this.activityPriceName = "拼团价";
          break;
        case 8: // 团购
          this.activityPriceName = "团购价";
          break;
        case 9: // 好货抢先购
          this.activityPriceName = "抢购价";
          break;
        case 10: // 分销
          this.activityPriceName = "分销价";
          break;
      }
    },
    // 发起拼团
    initAssemble() {
      this.$http({
        methods: "GET",
        url: assembleKey,
        data: {}
      }).then(res => {
        if (res.code === 200) {
          this.submitpuzzle(res.data);
        }
      });
    },
    // 商品详情路由改变时必须要初始化的几个操作
    needOperation() {
      //如果存在活动id,拿取活动id，调活动详情
      if (this.$route.query.activityTypeNum) {
        this.activityId = this.$route.query.activityId;
        this.goodsdetailFinddetail();
        if (this.$route.query.groupMember) {
          this.findassemblepage();
        }
      } else {
        //不存在活动就调商品详情
        this.getDetail();
      }
      // 获取图片资源
      this.getImageData();
      // 获取商品评论
      this.getComments();
      // 到达顶部
      this.$el.scrollTop = 0;
      // 如果有token则查询购物车商品数量
      if (myStorage.get("token")) {
        // 查询加入购物车的商品数量
        getShopCartNum().then(res => {
          let data = res.data || 0;
          this.goodsNum = data;
        });
      }
    },
    //点击去拼团按钮提交拼团
    submitpuzzle(groupId) {
      if (JSON.stringify(this.chooseGoods) === "{}") {
        this.groupId = groupId;
        this.isActivity = true;
        this.isChoose = true;
        this.buyNow = true;
        return;
      }
      // 清空多地址的缓存
      this.$store.commit("common/setMutipleAddress", undefined);
      let data = {
        activityGoodsId: this.$route.query.activityGoodsId, // 活动商品Id
        activityId: this.$route.query.activityId, // 活动Id
        activityTypeNum: this.$route.query.activityTypeNum, // 活动类型num
        goodsId: this.$route.query.id, // 商品id
        groupId: groupId, // 拼团id
        quantity: this.chooseGoods.productNum, // 当前商品数量
        skuId: this.chooseGoods.skuId, // 当前规格商品的skuid
        useIntegral: 0, // 是否使用积分1：是；0：否
        payId: 0 //支付方式id
      };
      this.$store.commit("common/setBuyNow", data);
      this.$router.push({
        name: "orderSubmit",
        query: {
          activityId: this.$route.query.activityId,
          address: "0",
          // 1表示立即购买 0表示购物车结算
          buyNow: 1,
          // 1表示团购已经绑定地址 0表示未绑定地址
          isBindAddress: this.$route.query.activityTypeNum == '8' ? this.isBindAddress : 0,
        }
      });
    },
    //去拼团展示对于弹窗
    gopuzzle(val) {
      this.puzzledata = val;
      this.subshow = true;
    },
    //查询拼团列表
    findassemblepage() {
      const activityId = this.$route.query.activityId;
      const activityGoodsId = this.$route.query.activityGoodsId;
      this.$http({
        method: "POST",
        url: findassemblepage,
        data: {
          activityId: activityId,
          activityGoodsId: activityGoodsId,
          pageSize: 6,
          pageNum: this.pageNum,
          status: 0
        }
      }).then(res => {
        this.puzzleArr = res.data.list;
        res.data.list.forEach(item => {
          item.time =
            this.$moment(item.endTime, "YYYY-MM-DD HH:mm:ss").valueOf() -
            Date.now();
        });
      });
    },
    //活动查询商品详情
    goodsdetailFinddetail() {
      const id = this.$route.query.id;
      const activityGoodsId = this.$route.query.activityGoodsId;
      this.$http({
        method: "get",
        url: goodsdetailFinddetail,
        data: {
          goodsId: id,
          activityGoodsId: activityGoodsId
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          // 商品信息
          this.goodsInfo = data;
          // 商品评价计数
          this.commentCount = data.commentCount;
          // 当前默认型号
          this.currentInfo =
            (data.skuDetailList && data.skuDetailList[0]) || {};
          this.skuId = this.currentInfo.skuId;
          if (this.$route.query.activityTypeNum == "8") {
            this.getLadderPrice();
            this.getGroup()
          }
          if (this.$route.query.activityTypeNum == "10") {
            this.getDistributionDetail();
            this.getReward()
          }
          // 商品的默认参数和请求返回的参数
          const defaultAttrList = [
            {
              attrName: "品牌",
              attrValue: data.brandName
            },
            {
              attrName: "货号",
              attrValue: data.goodsSn
            }
          ];
          const attrList = data.attrList || [];
          this.attrList = defaultAttrList.concat(attrList);
        }
      });
    },
    // 查询默认地址，如果有默认则取默认，如果没有则取第一个
    getAddress() {
      if (!isLogin()) {
        return;
      }
      this.$http({
        method: "get",
        url: addressList,
        params: {}
      }).then(res => {
        if (res.code === 200) {
          let data = res.data || [];
          let flag = 0;
          data.map(item => {
            if (item.def) {
              this.addressData = item;
              flag = 0;
            }
          });
          if (!flag) {
            this.addressData = data && data[0];
          }
        }
      });
    },
    // 已选按钮和选择加入购物车功能
    showChoose(bool) {
      // 是否添加购物车
      this.addShoppingCart = bool;
      // 不是团购
      this.isGroup = false;
      // 不是立即购买
      this.buyNow = false;
      // 弹窗打开
      this.isChoose = true;
    },
    // 关闭选择商品弹窗
    hideChoose(val) {
      this.isChoose = val;
    },
    // 选择商品改变时的事件, data为当前选择商品的信息
    chooseChange(data) {
      this.chooseGoods = data;
      this.skuId = this.chooseGoods.skuId;
      if (this.$route.query.activityTypeNum == "8") {
        this.getLadderPrice();
        this.getGroup();
      }
      // 拼接的型号和数量字符串
      let str = "";
      data.specInfo.map(item => {
        str += item.value;
      });
      str = str + "," + data.productNum + "件";
      this.chooseResult = str;
    },
    // 添加商品后购物车的数量变化事件
    numChange(num) {
      this.goodsNum = num;
    },
    // 打开分享弹窗分享
    share() {
      this.showshare = true;
    },
    // 隐藏分享弹窗
    hideShare(val) {
      this.showshare = val;
    },
    // 去评论详情
    toComments() {
      if (!this.commentsInfo.count) {
        return;
      }
      this.$router.push({
        name: "productcomments",
        query: { id: this.$route.query.id, ...this.commentCount }
      });
    },
    // 去往购物车
    toCart() {
      this.$router.push({
        name: "cart"
      });
    },
    // 立即购买
    buyOk(single) {
      if (single === "true") {
        this.isActivity = false;
      }
      this.isGroup = false;
      this.buyNow = true;
      this.isChoose = true;
    },
    // 隐藏地址弹窗的自定义事件
    hideAddr(val) {
      this.showAddr = val;
    },
    // 地址弹窗选择后的change事件
    addrChange(item) {
      this.addressData = item;
    },
    // 打开地址弹窗
    showAddrModal() {
      // 查询地址
      this.getAddress();
      this.showAddr = true;
    },
    // 监听页面的滚动，滚动到对应的tab位置
    scrolling() {
      this.arrDom &&
        this.arrDom.map((item, index) => {
          // 当前dom距离上面视口的高度
          let viewsTop =
            item && item.dom && item.dom.getBoundingClientRect().top;
          if (Math.abs(viewsTop) < 15) {
            this.currentActive = item.index;
          }
        });
      // 根据滑动展示/关闭tab栏
      if (this.$el.scrollTop > 0) {
        this.showTab = true;
      } else {
        this.showTab = false;
      }
      // 根据滑动改变透明度
      let opacity = this.$el.scrollTop / 100;
      this.$refs.headertab.style.opacity = opacity;
    },
    // 滚动到目标位置
    scrollChange(ref) {
      // let scrollTop = this.$el.scrollTop;
      //商品详情dom
      let dom = this.$refs[ref];
      // 商品详情位置
      let location = dom ? dom.offsetTop - 120 : undefined;
      // 执行滚动动画(动画的会有bug)
      // this.scroll(this.$refs.product, scrollTop, location);
      this.$el.scrollTop = location;
    },
    // 选择当前的tab
    clickTab(item, index) {
      this.currentActive = index;
      this.scrollChange(item.ref);
    },
    // 获取商品详情
    getDetail() {
      // const id = "54065";
      const id = this.$route.query.id;
      this.$http({
        method: "get",
        url: goodsDetail,
        data: {
          goodsId: id
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          // 商品信息
          this.goodsInfo = data;
          // 商品评价计数
          this.commentCount = data.commentCount;
          // 当前默认型号
          this.currentInfo =
            (data.skuDetailList && data.skuDetailList[0]) || {};
          // 商品的默认参数和请求返回的参数
          const defaultAttrList = [
            {
              attrName: "品牌",
              attrValue: data.brandName
            },
            {
              attrName: "货号",
              attrValue: data.goodsSn
            }
          ];
          const attrList = data.attrList || [];
          this.attrList = defaultAttrList.concat(attrList);
        }
      });
    },
    // 获取商品详情中的图片资源
    getImageData() {
      const id = this.$route.query.id;
      this.$http({
        method: "get",
        url: imgData,
        data: {
          goodsId: id
        }
      }).then(res => {
        if (res.code === 200) {
          let data = res.data || {};
          this.html = data.webGoodsDesc || data.goodsDesc || "";
        }
      });
    },
    // 获取商品评论
    getComments() {
      // const id = "221664356234956800";
      const id = this.$route.query.id;
      this.$http({
        method: "get",
        url: goodsComments,
        data: {
          goodsId: id,
          pageIndex: 0,
          pageSize: 2
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          this.commentsInfo = data;
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-product-productnormal {
  background: $lightColor;
  height: 100vh;
  overflow: auto;
  // 倒计时
  .countDown {
    .van-count-down {
      color: #fff;
    }
  }
  .v-product-addrmodal {
    padding: 0 0.8rem 1.8rem 0.8rem;
  }
  .ladderPrice::-webkit-scrollbar {
    display: none;
  }
  .ladderPrice {
    height: 38px;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    div:not(:last-of-type) {
      border-right: 1px solid #bfbfbf;
    }
    div {
      padding: 0 14px;
      white-space: nowrap;
    }
    .s1 {
      color: #666;
    }
    .s2 {
      color: #ff3945;
    }
  }
  /* 正在团购 */
  .groupTent {
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background: #fff;
    height: 390px;
    box-sizing: border-box;
    overflow: auto;
    padding: 22px;
    .groupDiv {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 133px;
      max-height: 100px;
      background: rgba(255, 255, 255, 1);
      border: 2px solid rgba(74, 153, 250, 0.26);
      box-shadow: 0px 0px 4px 0px rgba(74, 153, 250, 0.26);
      border-radius: 5px;
      .p1 {
        font-size: 12px;
        color: rgba(153, 153, 153, 1);
        margin-bottom: 4px;
      }
      .sWrap {
        display: flex;
        align-items: flex-start;
        margin-bottom: 4px;
        .s1 {
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
        }
        .s2 {
          font-size: 25px;
          color: rgba(153, 153, 153, 1);
        }
        .s3 {
          margin-left: 8px;
          font-size: 12px;
          color: rgba(153, 153, 153, 1);
        }
      }
      .origin {
        font-size: 12px;
        text-decoration: line-through;
        color: rgba(206, 206, 206, 1);
      }
    }
    .selectedDiv {
      background: url("~assets/images/activity/select_label@2x.png") no-repeat;
      border-color: #4a99fa;
      .p1 {
        color: #333;
      }
      .sWrap {
        .s1,
        .s2 {
          color: #333;
        }
        .s3 {
          color: #6295f4;
        }
      }
      .origin {
        color: #666;
      }
    }
  }

  /* 正在团购 */
  // 头部nav栏
  .product_header {
    width: 100%;
    height: 168px;
    background: url("~assets/images/home/red_bgc.png") no-repeat;
    background-position: center;
    background-size: contain;
    .right_icon {
      width: 20px;
      height: 20px;
    }
  }
  .red_icons {
    position: relative;
  }
  .red_icons:after {
    content: "";
    position: absolute;
    left: -7px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 14px;
    background: #ff3945;
  }
  // 头部tab栏
  .header_tab {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 58, 67, 1) 0%,
      rgba(255, 49, 98, 1) 100%
    );
    opacity: 0;
    display: flex;
    align-items: center;
    z-index: 1000;
    .return_icon {
      font-size: 20px;
      padding-left: 10px;
      padding-right: 20px;
      color: #fff;
    }
    .tab_box {
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;
      color: #fff;
      .tab_item {
        width: 75px;
        text-align: center;
        font-size: 16px;
      }
      .bottom_line {
        position: absolute;
        width: 75px;
        height: 3px;
        background: #fff;
        left: 0;
        bottom: 0;
        transition: transform 0.5s ease;
      }
    }
  }

  // 底部操作栏的字体大小
  .footer_operation {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    background: #fff;
    align-items: center;
    z-index: 9999;
    .img_area {
      flex: 1;
      display: flex;
      justify-content: space-around;
      .show_num {
        position: absolute;
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        right: -10px;
        top: -10px;
        background: #ff3945;
        border-radius: 50%;
        color: #fff;
      }
      .cart_box {
        position: relative;
      }
      .left_img {
        width: 20px;
        height: 20px;
      }
    }
    .btn_box {
      display: flex;
      font-size: 14px;
      .left_btn,
      .right_btn {
        width: 121px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      .left_btn {
        background: #ffa32c;
        color: #fff;
      }
      .right_btn {
        background: #ff3945;
        color: #fff;
      }
    }
  }
  // 商品轮播
  .show_product {
    height: 327px;
    margin-top: -98px;
    .swiper-slide {
      height: 327px;
      width: 100%;
      background: #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  // 描述及价格
  .description {
    padding: 10px 17px;
    background: #fff;
    .des {
      color: #333;
      font-size: 15px;
    }
    .price_box {
      padding: 5px 0;
      .price_note {
        color: #666;
      }
      .now_price {
        color: $mainColor;
        font-size: 14px;
        margin-right: 15px;
      }
      .last_price {
        color: #666;
        font-size: 10px;
      }
    }
  }
  // 商品来源
  .label_wrap {
    margin-bottom: 18px;
    background: #fff;
    padding: 0 15px;
    .label {
      display: inline-block;
      padding: 0 5px;
      height: 16px;
      line-height: 16px;
      border: 1px solid rgba(255, 57, 69, 1);
      border-radius: 3px;
      margin-right: 8px;
      font-size: 10px;
      color: rgba(255, 82, 92, 1);
    }
  }
  //拼团样式
  .puzzle {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: #ff4d57;
    justify-content: space-between;
    color: white;
    .through {
      text-decoration: line-through;
      font-size: 10px;
    }
    div:last-of-type {
      font-size: 14px;
    }
  }
  // 拼团列表
  .jigsaw {
    height: 200px;
    background: white;
    margin-top: 10px;
    .tilte {
      height: 35px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #999999;
      border-bottom: 1px solid #f6f6f6;
    }
    .tent {
      height: 82.5px;
      border-bottom: 1px solid #f6f6f6;
      padding-left: 10px;
      padding-right: 10px;
      display: flex;
      align-items: center;
      position: relative;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        color: #666666;
      }
      .btn {
        width: 66px;
        height: 28px;
        background: #ff3945;
        color: white;
        text-align: center;
        line-height: 28px;
        border-radius: 5px;
      }
    }
    .top-div {
      display: flex;
      position: absolute;
      right: 10px;
      .content {
        display: flex;
        flex-direction: column;
        margin-right: 10px;
        text-align: right;
        color: #666666;
      }
    }
    .tent:last-of-type {
      border: none;
    }
  }

  // 领券
  .cheap_cash {
    background: #fff;
    padding: 10px 17px;
    margin-top: 10px;
    display: flex;
    .cash_title {
      width: 31px;
      height: 19px;
      line-height: 19px;
      text-align: center;
      color: #fff;
      background: rgba(255, 57, 69, 1);
      border-radius: 5px;
    }
    .cash_content {
      flex: 1;
    }
  }
  // 商品选择，地址，运费
  .show_productinfo {
    background: #fff;
    padding: 0 17px;
    margin-top: 10px;
    .info_item {
      font-size: 13px;
      color: #666;
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid bottom;
      .info_content {
        flex: 1;
        color: #333;
        padding: 0 12px;
        display: flex;
        align-items: center;
        .address_icon {
          width: 12px;
          height: 15px;
          margin-right: 6px;
        }
      }
    }
  }
  // 评价
  .comments_admin {
    margin-top: 10px;
    background: #fff;
    padding: 10px 17px;
    .comments_head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .head_right {
        color: #666;
        display: flex;
        align-items: center;
      }
    }
    .find_more {
      text-align: center;
      margin-top: 15px;
      .find_btn {
        padding: 5px 13px;
        font-size: 12px;
        text-align: center;
        border: 1px solid rgba(153, 153, 153, 1);
        border-radius: 13px;
        color: #333;
      }
    }
    .none_comments {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
    }
  }
  // 为你推荐，热销排行，猜你喜欢
  .recommend_area {
    padding: 10px;
    margin-top: 10px;
    background: #fff;
  }
  // 商品参数/售后服务/图片展示
  .product_infomation {
    margin-top: 10px;
    padding-bottom: 60px;
    pre {
      margin-top: 15px;
      img {
        width: 100vw !important;
        height: auto;
      }
      div {
        width: 100vw;
        background-size: 100%;
      }
    }
    .parameter_info {
      background: #fff;
    }
    .parameter_title,
    .serve_title {
      font-size: 14px;
      padding: 15px 17px 0 17px;
    }
    .parameter_content {
      padding: 0 17px;
      display: flex;
      flex-wrap: wrap;
      .parameter_item {
        padding-right: 10px;
        font-size: 11px;
        color: #666;
        width: calc(100% / 2);
        margin-top: 12px;
        word-break: break-all;
      }
    }
    .serve_content {
      padding: 0 17px;
      .serve_item {
        display: flex;
        align-items: flex-start;
        margin-top: 15px;
        img {
          width: 19px;
        }
        .info {
          margin-left: 10px;
          word-break: break-all;
          .info_title {
            font-size: 10px;
            color: #333;
            font-weight: 400;
          }
          .info_content {
            margin-top: 5px;
            color: #999;
            font: 9px;
          }
        }
      }
    }
    .statement {
      padding: 0 17px;
      margin-top: 5px;
      .statement_title {
        color: #ff4b4b;
        font-size: 9px;
        line-height: 20px;
      }
      .statement_content {
        font-size: 9px;
        color: #666;
      }
    }
    .info_img {
      width: 100%;
      margin-top: 20px;
      img {
        width: 100%;
      }
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .block {
    width: 355px;
    height: 445px;
    padding: 0 4px;
    padding-bottom: 10px;
    border-radius: 8px;
    background: #ebf4fe;
    .title {
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      position: relative;
      img {
        position: absolute;
        width: 13px;
        height: 13px;
        right: 6px;
        top: 15px;
      }
    }
    .tent {
      overflow: hidden;
      background: white;
      height: 389px;
      .tentdiv {
        height: 65px;
        border-bottom: 1px solid #f6f6f6;
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        align-items: center;
        position: relative;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          color: #666666;
        }
        .btn {
          width: 66px;
          height: 28px;
          background: #ff3945;
          color: white;
          text-align: center;
          line-height: 28px;
          border-radius: 5px;
        }
      }
      .top-div {
        display: flex;
        position: absolute;
        right: 10px;
        .content {
          display: flex;
          flex-direction: column;
          margin-right: 10px;
          text-align: right;
          color: #666666;
        }
      }
    }
  }
  .sbt {
    width: 322px;
    height: 284px;
    background: #ebf4fe;
    padding: 0 10px;
    padding-bottom: 10px;
    border-radius: 8px;
    .title {
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      position: relative;
      img {
        position: absolute;
        width: 13px;
        height: 13px;
        right: 6px;
        top: 15px;
      }
    }
    .tent {
      background: white;
      height: 230px;
      .name-div {
        padding-top: 28px;
        font-size: 14px;
        text-align: center;
        span {
          color: #ff3945;
        }
      }
      .time {
        margin-top: 15px;
        display: flex;
        justify-content: center;
        span {
          color: #666666;
        }
        .color {
          color: #ff3945;
          margin: 0 5px;
        }
      }
      .img-div {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        img {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          margin-left: 10px;
        }
      }
      .btn {
        width: 230px;
        height: 30px;
        border-radius: 5px;
        background: #ff3945;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        margin-top: 25px;
      }
    }
  }
}
</style>