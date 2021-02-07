<template>
  <div class="v-discovery-index">
    <div class="bg_header">
      <div class="header_bar">
        <div class="try_scan">
          <img src="~assets/images/discovery/icon_mine@2x.png" alt />
        </div>
        <div class="search">
          <!-- <div>
          <img src="assets/images/home/xiangji.png" alt class="camera" />
          </div>-->
          <van-search
            v-model="keyWords"
            placeholder="请输入搜索关键词"
            shape="round"
            :clearable="false"
            background="transparent"
          ></van-search>
        </div>
        <div class="header_msg">
          <img src="~assets/images/discovery/icon_chat@2x.png" alt />
        </div>
      </div>
    </div>
    <div class="content">
      <van-tabs v-model="active">
        <van-tab :title="item" v-for="(item, index) in taps" :key="index">
          <my-content></my-content>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import myContent from './components/content'

export default {
  name: 'discovery',
  data() {
    return {
      taps: ['关注', '晒一晒', '5G', '手机', '数码', '居家', '母婴'],
      active: '', // 标签切换
      keyWords: '', // 关键词
    }
  },
  components: {
    myContent,
  }
};
</script>

<style lang="scss">
  @import "@/assets/css/local.scss";
  [class*=van-hairline]::after {
    border: none;
  }
  .v-discovery-index {
    width: 100%;
    height: 100%;
    .bg_header {
      width: 100%;
      height: 211.5px;
      background:linear-gradient(90deg,rgba(255,58,67,1),rgba(255,49,98,1));
      background-size: contain;
      background-position: center;
      z-index: 99;
      .header_bar {
        height: 54px;
        display: flex;
        align-items: center;
        padding: 0 14px;
        .van-search__content {
          background: #fff;
        }
        .search {
          position: relative;
          flex: 1;
          .van-field__control {
            width: 240px;
          }
          .camera {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
          }
        }
        .try_scan,
        .header_msg {
          width: 50px;
          text-align: center;
          img {
            width: 22px;
            height: 22px;
          }
          div {
            color: #fff;
          }
        }
      }
    }
    .content {
      position: relative;
      top: -160px;
      .van-tab {
        flex-basis: 16%!important;
      }
      .van-tabs__nav {
        background: transparent;
        .van-tabs__line {
          height: 6px;
          background: url("~assets/images/home/huxian.png");
        }
        .van-tab--active, .van-tab {
          color: #fff;
        }
      }
    }

  }

</style>