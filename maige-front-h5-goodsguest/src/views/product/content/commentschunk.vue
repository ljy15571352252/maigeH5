<template>
  <div class="v-product-content-commentschunk">
    <div class="head_info">
      <div class="head_icon">
        <img v-lazy="item.headImgUrl" />
      </div>
      <div class="head_text">
        <div>{{item.userName}}</div>
        <div class="xing_icon">
          <img
            :key="index"
            v-for="(item,index) in item.commentRank"
            src="~assets/images/product/hong_xing.png"
          />
        </div>
      </div>
    </div>
    <div :class="showAll ? 'comments_detail' : 'comments_detail two-txt-cut'">{{item.content}}</div>
    <div class="show_img" v-if="item.galleryList && item.galleryList.length > 0">
      <crosscontainer>
        <template slot="container">
          <div class="img_box">
            <img
              class="img_item"
              :key="index"
              v-for="(sub, index) in item.galleryList"
              :src="sub.imgUrl"
            />
          </div>
        </template>
      </crosscontainer>
    </div>
    <div class="content_note">
      <span class="buy_time">{{item.creatTime && $moment(item.creatTime).format('YYYY-MM-DD')}}</span>
      <span>规格:{{item.specValue}}</span>
    </div>
  </div>
</template>

<script>
/**
 * 商品评价单元块
 */
// 滚动容器
import crosscontainer from "@/components/crosscontainer/index.vue";
import { hideTelephone } from "@/configs/common.js";
export default {
  name: "commentschunk",
  data() {
    return {};
  },
  props: {
    // 该条评价信息
    item: {
      default: null
    },
    // 评价是否简单展示(即省略显示长文字描述),默认全部展示
    showAll: {
      default: true
    }
  },
  components: {
    crosscontainer
  },
  created() {},
  destroyed() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-product-content-commentschunk {
  margin-top: 15px;
  .head_info {
    display: flex;
    align-items: center;
    .head_icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
    }
    .head_text img {
      width: 8px;
      height: 8px;
    }
  }
  .comments_detail {
    font-size: 12px;
    color: #333;
    margin-top: 10px;
  }
  .show_img {
    margin-top: 10px;
  }
  .img_box {
    width: 100%;
    .img_item {
      width: 80px;
      height: 80px;
    }
    .img_item:nth-of-type(n + 2) {
      margin-left: 8px;
    }
  }
  .content_note {
    color: #666;
    font-size: 11px;
    margin-top: 10px;
    .buy_time {
      margin-right: 10px;
    }
  }
}
</style>