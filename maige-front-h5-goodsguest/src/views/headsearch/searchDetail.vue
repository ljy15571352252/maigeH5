<template>
  <div class="v-headSearch-searchDetail" ref="wrapper">
    <navbar
      class="navbar"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    >
      <template v-slot:center>
        <div class="search">
          <van-search
            :placeholder="placeholder"
            shape="round"
            background="transparent"
            @click="$router.push('/headsearch')"
          ></van-search>
        </div>
      </template>
      <template v-slot:right>
        <div @click="toggleStyle">
          <img
            v-if="isOneRow"
            class="rightImg"
            src="~assets/images/headsearch/icon_toggle@2x.png"
            alt
          />
          <img v-else class="rightImg" src="~assets/images/headsearch/icon_toggle2@2x.png" alt />
        </div>
      </template>
    </navbar>
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      @load="onLoad"
      :offset="-100"
    >
      <van-tabs class="tabs" v-model="active" @click="handleTapClick">
        <van-tab title="综合"></van-tab>
        <van-tab title="销量"></van-tab>
        <van-tab>
          <div slot="title">
            <van-dropdown-menu active-color="#F74854">
              <van-dropdown-item @change="handleDropdownChange" v-model="value" :options="option" />
            </van-dropdown-menu>
          </div>
        </van-tab>
        <van-tab>
          <div slot="title" @click="popRight">筛选</div>
        </van-tab>
      </van-tabs>
      <!--<ul ref="topTab" class="selectList" :class="{'isFixed': isFixed}" @click="shifChoose">
        <li data-index="0" class="selectItem" :class="{ selected: select_index === 0 }">新品</li>
        <li data-index="1" class="selectItem" :class="{ selected: select_index === 1 }">拼团</li>
        <li data-index="2" class="selectItem">
          <van-dropdown-menu active-color="#F74854">
            <van-dropdown-item title="品牌" ref="item">
              <div class="dropdownWrap">
                <ul class="s_list">
                  <li class="s_item" v-for="(item,index) in 18" :key="index">
                    <label :for="`s1_${index}`">
                      <input type="checkbox" name="s_item" class="item_checkbox" :id="`s1_${index}`">
                      <span>喜欢吃鱼</span>
                    </label>
                  </li>
                </ul>
                <div class="btn_wrap">
                  <div class="btn btn_reset" @click="reset(1)">重置</div>
                  <div class="btn btn_confrim">确定</div>
                </div>
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </li>
        <li data-index="3" class="selectItem">
          <van-dropdown-menu active-color="#F74854">
            <van-dropdown-item title="材质" ref="item">
              <div class="dropdownWrap">
                <ul class="s_list">
                  <li class="s_item" v-for="(item,index) in 18" :key="index">
                    <label :for="`s2_${index}`">
                      <input type="checkbox" name="s_item" class="item_checkbox" :id="`s2_${index}`">
                      <span>喜欢吃鱼</span>
                    </label>
                  </li>
                </ul>
                <div class="btn_wrap">
                  <div class="btn btn_reset" @click="reset(2)">重置</div>
                  <div class="btn btn_confrim">确定</div>
                </div>
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </li>
        <li data-index="4" class="selectItem">
          <van-dropdown-menu active-color="#F74854">
            <van-dropdown-item title="类型" ref="item">
              <div class="dropdownWrap">
                <ul class="s_list">
                  <li class="s_item" v-for="(item,index) in 18" :key="index">
                    <label :for="`s3_${index}`">
                      <input type="checkbox" name="s_item" class="item_checkbox" :id="`s3_${index}`">
                      <span>喜欢吃鱼</span>
                    </label>
                  </li>
                </ul>
                <div class="btn_wrap">
                  <div class="btn btn_reset" @click="reset(3)">重置</div>
                  <div class="btn btn_confrim">确定</div>
                </div>
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </li>
      </ul>-->
      <ul class="proList1">
        <li
          @click="toProDetail(item.goodsId)"
          class="proItem1"
          v-for="item in hotProList"
          :key="item && item.skuId"
        >
          <div class="p1_img_wrap">
            <img :src="item && item.goodsThumbnailImgUrl" alt />
          </div>
          <p class="pro1_name">{{item && item.goodsName}}</p>
        </li>
      </ul>
      <!-- 商品列表样式-->
      <ul :class="proStyle" v-if="proList.length > 0">
        <li
          @click="toProDetail(item.goodsId)"
          class="proItem2"
          v-for="(item, index) in  proList"
          :key="`${item && item.skuId} + ${index}`"
        >
          <i class="pro2_img_wrap">
            <img :src="item && item.goodsThumbnailImgUrl" />
          </i>
          <div class="right">
            <p class="pro2Name">{{item && item.goodsName}}</p>
            <div class="label_wrap">
              <i v-if="item.goodsType === 0" class="label">自营</i>
              <i v-if="item.goodsType === 1" class="label">京东</i>
              <i v-if="item.goodsType === 2" class="label">网易</i>
              <i v-if="item.goodsType === 3" class="label">苏宁</i>
              <i v-if="item.goodsType === 4" class="label">平台商品</i>
              <i v-if="item.isAssemble === 1" class="label">自营</i>
              <i v-if="item.isGift === 1" class="label">赠</i>
            </div>
            <div class="pric_wrap">
              <span class="price">商城价:￥{{item.shopPrice}}</span>
              <span class="elide_price" v-if="item.goodsType === 3">市场价:￥{{item.jdPrice}}</span>
              <span class="elide_price" v-else-if="item.goodsType === 2">市场价:￥{{item.jdPrice}}</span>
              <span
                class="elide_price"
                v-else-if="(item.goodsType === 1 || item.goodsType === 0 ) && item.jdPrice"
              >市场价:￥{{item.jdPrice}}</span>
              <span class="elide_price" v-else>市场价:￥{{item.costPrice}}</span>
            </div>
            <!--<p v-if="item.saleVolume" class="sales">共销{{item.saleVolume}}件</p>-->
            <!--<p class="shopName">好市客自营旗舰店  进店></p>-->
            <i class="shopping_cart" @click.stop="addCart(item)">
              <img src="~assets/images/headsearch/icon_shopping_cart@2x.png" />
            </i>
          </div>
        </li>
      </ul>
      <div v-if="!loading && !finished" class="load_more" @click="onLoad">查看更多</div>
      <!-- 无商品-->
      <div v-if="!proList || proList.length == 0" style="text-align: center; margin-top: 90px; overflow: hidden">
        <img style="width: 128px" src="~assets/images/headsearch/blank.png" />
      </div>
    </van-list>
    <!-- 筛选弹窗-->
    <van-popup v-model="show" position="right" round :style="{ width: '86%', height: '100%' }">
      <div class="pop_wrapper">
        <div class="pop_content">
          <div>
            <p class="p_title">价格区间</p>
            <div class="price_input_wrap">
              <input
                v-model="params.minPrice"
                class="price_input"
                placeholder="最低价"
                type="number"
                min="0"
              />
              <span style="margin: 0 8px">-</span>
              <input
                min="0"
                @blur="hanlePrice"
                v-model="params.maxPrice"
                placeholder="最高价"
                class="price_input"
                type="number"
              />
            </div>
          </div>
          <div v-for="item in sceneList" :key="item.typeId">
            <p class="p_title">{{item.typeName}}</p>
            <input ref="resetRaido" type="radio" :name="item.typeId" checked />
            <ul class="clearfix">
              <li class="fl" v-for="item2 in item.children" :key="item2.sceneId">
                <label :for="item2.sceneId">
                  <input type="radio" class="sceneRadio" :id="item2.sceneId" :name="item.typeId" />
                  <span class="p_item">{{item2.sceneName}}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
        <div class="p_btn_wrap">
          <div class="p_btn p_btn_reset" @click="reset(4)">重置</div>
          <div @click="confrimSiftPro" class="p_btn p_btn_confirm">确定</div>
        </div>
      </div>
    </van-popup>
    <!-- 回到顶部组件 -->
    <back-top />
    <!-- 回到购物车组件 -->
    <to-cart />
  </div>
</template>

<script>
// 头部nav栏
import navbar from "@/components/navbar/nav.vue";
import { findList, findTopFive, findSceneTree } from "@/configs/interface";
import { addShopCart, getClickCount } from "@/configs/common.js";
import { Toast } from "vant";
export default {
  name: "searchDeatail",
  components: { navbar },
  data() {
    return {
      sceneList: [], // 送礼场景列表
      error: false,
      loading: false, // 请求加载
      finished: false, // 无请求数据
      proList: [], // 商品列表
      hotProList: [], // 热销商品列表
      params: {
        // 查询商品列表参数
        sceneId: "",
        minPrice: null,
        maxPrice: null,
        pageIndex: 1,
        pageSize: 10,
        rankType: 0 // 1.销量排序, 2:价格从高到低, 3:价格从低到高, 4:评价排序, 5：上架时间排序, 综合(默认)排序则不传或传0
      },
      offsetTop: 0, // 需要吸顶的栏离顶部的距离
      isFixed: false,
      isOneRow: true, // 单排展示商品
      show: false, // 右侧弹出层
      select_index: null,
      value: 0, // 价格选择，
      option: [{ text: "价格最低", value: 0 }, { text: "价格最高", value: 1 }],
      tabs: ["综合", "销量", "价格", "筛选"],
      active: 0, //
      placeholder: "" // 提示词
    };
  },
  computed: {
    proStyle() {
      return this.isOneRow ? "proList2" : "proList3";
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    /*this.$refs.wrapper.removeEventListener("scroll", this.handleScroll);*/
  },
  methods: {
    // 初始化
    init() {
      this.getParams(); // 获取关键词
      this.initPlaceholder(); // 初始化搜索提示词
      /*this.$nextTick(() => {
        this.$refs.wrapper.addEventListener("scroll", this.handleScroll);
        if (this.$refs.topTab) {
          this.offsetTop = this.$refs.topTab.offsetTop;
        }
      });*/
      this.getHotProList();
    },
    // 控制使最高价不低于最低价
    hanlePrice() {
      if (this.params.maxPrice < this.params.minPrice) {
        this.params.maxPrice = this.params.minPrice;
      }
    },
    // 重置
    reset() {
      this.$refs.resetRaido.forEach(item => {
        item.checked = true;
      });
      this.params.minPrice = null;
      this.params.maxPrice = null;
      this.params.sceneId = "";
    },
    // 去到商品详情
    toProDetail(goodsId) {
      // 统计点击
      getClickCount(goodsId);
      this.$router.push({
        name: "productnormal",
        query: { id: goodsId }
      });
    },
    // 请求数据,上拉加载
    onLoad() {
      this.finished = true;
      this.loading = true;
      this.getProList(true);
    },
    // 确认搜索商品
    confrimSiftPro() {
      this.params.sceneId = "";
      this.show = false;
      const nodes = document.querySelectorAll(".sceneRadio");
      nodes.forEach(item => {
        if (item.checked === true) {
          this.params.sceneId += item.id + ",";
        }
      });
      this.params.sceneId = this.params.sceneId.substring(
        0,
        this.params.sceneId.length - 1
      );
      this.getProList();
    },
    // 选择价格排序
    handleDropdownChange(val) {
      switch (val) {
        case 0:
          this.params.rankType = 3;
          this.getProList();
          break;
        case 1:
          this.params.rankType = 2;
          this.getProList();
          break;
        default:
          break;
      }
    },
    // 综合排序
    handleTapClick() {
      switch (this.active) {
        case 0:
          this.params.rankType = 0;
          this.getProList();
          break;
        case 1:
          this.params.rankType = 1;
          this.getProList();
          break;
        case 2:
          this.handleDropdownChange(this.value);
          break;
        default:
          break;
      }
    },
    // 获取关键词化关键词
    getParams() {
      this.params = Object.assign(this.params, this.$route.query || {});
    },
    // 初始化搜索提示词
    initPlaceholder() {
      this.placeholder = this.params.goodsName || "请输入搜索关键词";
    },
    // 获取热销商品
    getHotProList() {
      this.$http({
        method: "get",
        url: findTopFive,
        data: {
          catId: this.$route.query.catId,
          goodsName: this.$route.query.goodsName,
          showNumber: 10
        }
      }).then(res => {
        this.hotProList = res;
      });
    },
    // 获取送礼场景树形列表
    getSceneTree() {
      this.$http({
        method: "get",
        url: findSceneTree,
        data: null
      }).then(res => {
        if (res.code === 200) {
          this.sceneList = res.data;
        }
      });
    },
    // 调用接口搜索商品
    getProList(bool) {
      if (!bool) {
        this.params.pageIndex = 1;
      }
      this.$http({
        method: "get",
        url: findList,
        data: this.params
      }).then(res => {
        this.loading = false;
        if (res.code === 200) {
          if (bool) {
            if (res.data.pageList && res.data.pageList.length <= 0) {
              this.finished = true;
            }
            this.proList = this.proList.concat(res.data.pageList);
            this.params.pageIndex++;
          } else {
            this.params.pageIndex++;
            this.proList = res.data.pageList;
          }
        } else {
          this.error = true;
        }
      });
    },
    // 页面滚动时处理筛选栏吸顶
    handleScroll() {
      let scrollTop = this.$refs.wrapper.scrollTop;
      if (scrollTop >= this.offsetTop) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    // 切换商品列表样式
    toggleStyle() {
      this.isOneRow = !this.isOneRow;
    },
    // 右侧弹出
    popRight() {
      this.show = true;
      if (this.sceneList.length === 0) {
        this.getSceneTree(); // 加载送礼场景
      }
    },
    // 点击筛选
    shifChoose() {
      const e = window.event;
      if (e.target.nodeName.toLocaleLowerCase() === "li") {
        const index = e.target.dataset.index;
        this.select_index = parseInt(index, 10);
      }
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
.v-headSearch-searchDetail {
  height: 100%;
  background-color: $lightColor;
  overflow: auto;
  padding-top: 60px;
  padding-bottom: 60px;
  .isFixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 3px 10px #eee;
    z-index: 2;
  }
  .navbar {
    background: linear-gradient(
      45deg,
      rgba(255, 58, 67, 1) 0%,
      rgba(255, 49, 98, 1) 100%
    );
    .search {
      position: relative;
      flex: 1;
      /*.van-search__content {
          width:270px;
          background:rgba(255,255,255,1);
          border-radius:20px;
          .van-cell {
            line-height: 1;
          }
        }*/
    }
    .try_scan,
    .header_msg {
      width: 50px;
      text-align: center;

      img {
        width: 16px;
        height: 16px;
      }

      div {
        color: #fff;
      }
    }
    .rightImg {
      width: 20px;
    }
  }
  .tabs {
    .van-dropdown-menu {
      height: 43px;
      .van-ellipsis {
        font-size: 14px;
      }
    }
    .van-tabs__line {
      height: 14px;
      background: url("~assets/images/home/huxian.png") no-repeat;
      background-size: 18px 6px;
      background-position: center;
    }
    .van-ellipsis {
      color: #333;
    }
    .van-tab--active {
      .van-ellipsis {
        color: #f74854;
      }
      .van-dropdown-menu__title::after {
        border-color: transparent transparent #f74854 #f74854;
      }
    }
  }
  .selectList {
    display: flex;
    justify-content: space-between;
    padding: 10px 22px;
    background: #fff;
    .selectItem {
      color: #666;
      padding: 0 12px;
      height: 22px;
      line-height: 22px;
      background: rgba(245, 248, 252, 1);
      border-radius: 10px;
      border: 1px solid #fff;
      .van-dropdown-item {
        margin-top: 1px;
      }
      .van-icon {
        position: relative;
        top: 1px;
      }
      .van-dropdown-item__content {
        overflow: hidden;
        max-height: 100%;
        border-radius: 0 0 10px 10px;
      }
      .van-dropdown-menu {
        height: 100%;
        background-color: inherit;
        .van-ellipsis {
          color: #666;
        }
        .van-dropdown-menu__title--active {
          .van-ellipsis {
            color: #f74854;
          }
        }
      }
      .dropdownWrap {
        position: relative;
        margin-top: 10px;
        background: #f5f8fc;
        overflow: hidden;
        .s_list {
          position: relative;
          max-height: 300px;
          display: flex;
          flex-wrap: wrap;
          overflow: auto;
          .s_item {
            width: 50%;
            box-sizing: border-box;
            padding: 10px 0;
            color: #333;
            text-align: center;
            @include ellipsis;
            .item_checkbox {
              position: absolute;
              top: -10000px;
            }
          }
          .item_checkbox:checked + span {
            color: #f74854;
          }
        }
        .btn_wrap {
          z-index: 99;
          width: 100%;
          display: flex;
          border-radius: 0px 0px 10px 10px;
          .btn {
            width: 50%;
            height: 43px;
            line-height: 43px;
            text-align: center;
          }
          .btn_reset {
            background: #fff;
            border-radius: 0px 0px 0px 10px;
            color: #333;
          }
          .btn_confrim {
            background: #f74854;
            border-radius: 0px 0px 10px 0px;
            color: #fff;
          }
        }
      }
    }
    .selected {
      background: rgba(247, 72, 84, 0.1);
      border: 1px solid rgba(247, 72, 84, 1);
      color: #f74854;
    }
  }
  // 右侧弹窗
  .pop_wrapper {
    width: 100%;
    position: relative;
    height: 100%;
    padding: 42px 0 10px;
    overflow: hidden;
    .pop_content {
      width: 100%;
      height: calc(100% - 44px);
      overflow-x: hidden;
      overflow-y: auto;
      ul {
        padding-left: 20px;
        margin-bottom: 30px;
      }
      .price_input_wrap:after {
        position: absolute;
        left: -10px;
        bottom: 0;
        content: "";
        border-bottom: #f5f8fc 10px solid;
        width: 100%;
        padding: 10px;
      }
      .price_input_wrap {
        position: relative;
        padding-bottom: 26px;
        padding-left: 10px;
        margin-bottom: 16px;
        .price_input {
          outline: none;
          border: none;
          width: 130px;
          height: 25px;
          padding: 0 6px;
          background: rgba(245, 248, 252, 1);
          border-radius: 13px;
          box-sizing: border-box;
          text-align: center;
        }
      }
      .p_item {
        display: inline-block;
        padding: 0 12px;
        height: 25px;
        line-height: 25px;
        width: 60px;
        background: rgba(245, 248, 252, 1);
        border: 1px solid transparent;
        border-radius: 13px;
        margin-bottom: 10px;
        margin-right: 12px;
        text-align: center;
        @include ellipsis;
      }
      input[type="radio"] {
        position: absolute;
        top: -10000px;
      }
      input[type="radio"]:checked + span {
        background: rgba(255, 57, 69, 0.1);
        border: 1px solid rgba(255, 57, 69, 1);
        border-radius: 13px;
        color: #ff3945;
      }
      .p_title {
        padding-left: 10px;
        font-size: 14px;
        color: #333;
        margin-bottom: 16px;
      }
    }
    .p_btn_wrap {
      bottom: 10px;
      position: absolute;
      left: 0;
      right: 0;
      padding: 0 10px;
      margin: auto;
      display: flex;
      justify-content: space-between;
      width: calc(100%- 20px);
      background: #fff;
      .p_btn {
        width: 141px;
        height: 34px;
        line-height: 34px;
        border-radius: 17px;
        text-align: center;
      }
      .p_btn_reset {
        border: 1px solid rgba(153, 153, 153, 1);
        color: #333;
        margin-right: 16px;
      }
      .p_btn_confirm {
        background: #ff3945;
        color: #fff;
      }
    }
  }
  .proList1 {
    display: flex;
    padding: 10px 0;
    margin: 0 8px;
    overflow: auto;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    &::-webkit-scrollbar {
      height: 0 !important;
    }
    .proItem1 {
      flex-shrink: 0;
      width: 80px;
      height: 100px;
      padding: 5px 6px 7.5px;
      background: rgba(255, 255, 255, 1);
      border-radius: 5px;
      box-sizing: border-box;
      margin-right: 8px;
      .p1_img_wrap {
        width: 60px;
        height: 63px;
        border-radius: 5px;
        background: #ccc;
        margin: auto;
        margin-bottom: 9px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .pro1_name {
        text-align: center;
        width: 100%;
        @include ellipsis;
      }
    }
  }
  // 查看更多
  .load_more {
    width: 100vw;
    padding: 10px 0;
    text-align: center;
    color: #999;
    margin-bottom: -20px;
    font-size: 14px;
  }
  // 商品列表样式1
  .proList2 {
    .proItem2 {
      display: flex;
      width: 100%;
      height: 136px;
      background: rgba(255, 255, 255, 1);
      border-radius: 5px;
      box-sizing: border-box;
      padding: 14px 7px;
      margin-bottom: 1px;
      .pro2_img_wrap {
        flex-shrink: 0;
        display: inline-block;
        width: 108px;
        height: 108px;
        margin-right: 24px;
        background: #ccc;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        position: relative;
        display: inline-block;
        .pro2Name {
          width: 225px;
          height: 32px;
          font-size: 14px;
          color: rgba(51, 51, 51, 1);
          line-height: 17px;
          @include ellipsis2(2);
          margin-bottom: 8px;
        }
        .label_wrap {
          margin-bottom: 18px;
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
        .pric_wrap {
          font-size: 14px;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 18px;
          .price {
            display: block;
            color: #ff3945;
            margin-right: 6px;
          }
          .elide_price {
            text-decoration: line-through;
            color: rgba(102, 102, 102, 1);
          }
        }
        .sales,
        .shopName {
          font-size: 10px;
          color: rgba(102, 102, 102, 1);
        }
        .shopping_cart {
          display: inline-block;
          width: 16px;
          height: 16px;
          position: absolute;
          right: 20px;
          bottom: 17px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  // 商品列表样式2
  .proList3 {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 10px;
    .proItem2 {
      width: 173px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 1);
      border-radius: 5px;
      padding: 14px 10px;
      margin-bottom: 10px;
      .pro2_img_wrap {
        display: block;
        width: 132px;
        height: 148px;
        background: #ccc;
        margin: auto;
        margin-bottom: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        position: relative;
        display: inline-block;
        .pro2Name {
          width: 143px;
          font-size: 14px;
          color: rgba(51, 51, 51, 1);
          line-height: 17px;
          @include ellipsis2(2);
          margin-bottom: 8px;
        }
        .label_wrap {
          margin-bottom: 8px;
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
        .pric_wrap {
          font-size: 14px;
          color: rgba(51, 51, 51, 1);
          margin-bottom: 8px;
          .price {
            display: block;
            color: #ff3945;
            margin-right: 6px;
          }
          .elide_price {
            text-decoration: line-through;
            color: rgba(102, 102, 102, 1);
          }
        }
        .sales,
        .shopName {
          font-size: 10px;
          color: rgba(102, 102, 102, 1);
        }
        .shopping_cart {
          display: inline-block;
          width: 16px;
          height: 16px;
          position: absolute;
          right: 20px;
          bottom: 20px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>