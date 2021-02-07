<template>
  <div class="v-product-comments">
    <div class="comments_header">
      <navbar
        title="商品评价"
        defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
        color="#fff"
      ></navbar>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="isUpLoading" :finished="upFinished" finished-text="没有更多了" @load="onLoad">
        <div class="comments_box">
          <div class="comments_brief">
            <div class="brief_title">好评率</div>
            <div class="brief_content">
              <div class="brief_item" :key="index" v-for="(item, index) in typeArr">
                <van-tag
                  round
                  :color="type === item.type ? '#ff3a44' : 'transparent'"
                  @click="changeType(item)"
                >
                  <span
                    :class="type === item.type ? 'choose_color' : 'no_choose'"
                  >{{item.name}}({{unitChange(item.num)}})</span>
                </van-tag>
              </div>
            </div>
          </div>
          <div class="comments_content">
            <commentschunk :item="item" :key="index" v-for="(item, index) in commentsList" />
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <!-- <footerbtn>
      <template slot="leftBtn">
        <div @click="joinCart">
          <div class="bottom_text">加入购物车</div>
        </div>
      </template>
      <template slot="rightBtn">
        <div @click="buyNow">
          <div class="bottom_text">立即购买</div>
        </div>
      </template>
    </footerbtn>-->
  </div>
</template>

<script>
/**
 * 普通商品评价
 */
// 头部的标题栏组件
import navbar from "@/components/navbar/nav";
// 底部操作栏
import footerbtn from "@/views/product/content/footerbtn";
// 将数字转化为带亿或万单位的函数
import { unitChange } from "@/utils/unitchange.js";
// 引入评价单元块
import commentschunk from "@/views/product/content/commentschunk.vue";

// 接口
import { goodsComments } from "@/configs/interface.js";
export default {
  name: "productcomments",
  data() {
    return {
      // 评价类型数组
      typeArr: [
        {
          name: "全部",
          type: null,
          num: this.$route.query.counts || 0
        },
        {
          name: "好评",
          type: 0,
          num: this.$route.query.goodCount || 0
        },
        {
          name: "中评",
          type: 1,
          num: this.$route.query.middleCount || 0
        },
        {
          name: "差评",
          type: 2,
          num: this.$route.query.negativeCount || 0
        },
        {
          name: "带图",
          type: 3,
          num: this.$route.query.imgCount || 0
        }
      ],
      // 评价信息
      commentsInfo: {},
      // 评价数组
      commentsList: [],
      isLoading: false, // 下拉刷新
      isUpLoading: false, // 上拉加载
      upFinished: false, //上拉加载完毕
      pageIndex: 0, // 加载的哪一页
      pageSize: 10, // 每页加载多少条数据
      type: null, // 加载的评论类型 null为所有 0好评 1中评 2 差评 3带图
      dateSort: "" // desc倒序 asc顺序
    };
  },
  props: {},
  components: {
    navbar,
    footerbtn,
    commentschunk
  },
  created() {},
  destroyed() {},
  mounted() {},
  methods: {
    unitChange,
    // 选中目标类型
    changeType(item) {
      this.type = item.type;
      this.onRefresh();
    },
    // 下拉调用此函数
    onRefresh() {
      window.setTimeout(() => {
        this.isLoading = true;
        this.refreshComments();
      }, 500);
    },
    // 上拉调用此函数
    onLoad() {
      window.setTimeout(() => {
        this.getComments();
      }, 500);
    },
    // 上拉加载获取商品评论
    getComments() {
      this.isUpLoading = true;
      this.upFinished = false;
      const id = this.$route.query.id;
      this.$http({
        method: "get",
        url: goodsComments,
        data: {
          goodsId: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          type: this.type,
          dateSort: this.dateSort
        }
      }).then(res => {
        this.isUpLoading = false;
        this.isLoading = false;
        if (res.code == 200) {
          let data = res.data || {};
          // 评价详情
          this.commentsInfo = data;
          // 商品评价数组
          const commentsList = data.pageList || [];
          this.commentsList = this.commentsList.concat(commentsList);
          this.pageIndex = this.pageIndex + 1;
          if (commentsList.length < 10) {
            this.upFinished = true;
          }
        }
      });
    },
    // 下拉刷新
    refreshComments() {
      const id = this.$route.query.id;
      this.pageIndex = 0;
      this.$http({
        method: "get",
        url: goodsComments,
        data: {
          goodsId: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          type: this.type,
          dateSort: this.dateSort
        }
      }).then(res => {
        this.isLoading = false;
        if (res.code == 200) {
          let data = res.data || {};
          this.commentsInfo = data;
          this.commentsList = data.pageList || [];
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-product-comments {
  background: $lightColor;
  padding-top: 60px;
  padding-bottom: 100px;
  height: 100vh;
  overflow: auto;
  // 头部nav栏
  .comments_header {
    width: 100%;
    background: url("~assets/images/home/red_bgc.png") no-repeat;
    background-position: center;
    background-size: cover;
    z-index: 999;
  }
  // 评论
  .comments_box {
    .comments_brief {
      padding: 10px;
      background: #fff;
      .brief_title {
        color: #333;
      }
      .brief_content {
        display: flex;
        flex-wrap: wrap;
      }
      .brief_item {
        width: calc(100% / 3);
        white-space: nowrap;
        margin-top: 15px;
        .choose_color {
          color: #fff;
        }
        .no_choose {
          color: #333;
        }
      }
    }
    .comments_content {
      background: #fff;
      margin-top: 10px;
      padding: 10px 17px;
    }
  }
  // 底部操作栏的字体大小
  .bottom_text {
    font-size: 14px;
  }
}
</style>