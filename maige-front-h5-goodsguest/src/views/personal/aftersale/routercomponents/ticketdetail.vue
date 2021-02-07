<template>
  <div class="personal-aftersale-routercomponents-ticketdetail">
    <navbar
      class="navbar"
      :title="title"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    ></navbar>
    <div class="content">
      <van-steps direction="vertical" :active="0" active-icon>
        <van-step v-for="(item,index) in data" :key="index">
          <div class="title">{{item.actionName}}</div>
          <p class="tent">{{item.actionResult}}</p>
          <p class="timer">{{item.createTime}}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
/**
 * 进度详情
 */
// 引入nav栏
import navbar from "components/navbar/nav";
import { findafterlog } from "@/configs/interface.js"; //引入url
import { format } from "path";
export default {
  name: "ticketdetail",
  components: { navbar },
  data() {
    return {
      title: "进度详情",
      complainId: "", //客诉id
      returnType: "", //售后类型
      data: [] //进度表
    };
  },
  methods: {
    findafterlog() {
      this.$http({
        method: "GET",
        url: findafterlog,
        data: {
          complainId: this.$route.query.complainId,
          returnType: this.$route.query.returnType
        }
      }).then(res => {
        if (res.code == 200) {
          this.data = res.data.reverse();
        }
      });
    }
  },
  created() {
    if (this.$route.query.complainId && this.$route.query.returnType) {
      this.complainId = this.$route.query.complainId;
      this.returnType = this.$route.query.returnType;
    }
    this.findafterlog();
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.personal-aftersale-routercomponents-ticketdetail {
  height: 100%;
  background-color: $lightColor;
  overflow-y: auto;
  padding-top: 60px;
  .content {
    padding: 30px 10px;
    margin: 10px;
    background: white;
    .title {
      font-size: 15px;
      color: #333333;
      font-weight: Medium;
    }
    .tent {
      font-size: 13px;
      color: #454545;
      margin-top: 15px;
    }
    .timer {
      font-size: 11px;
      color: #999999;
      margin-top: 10px;
    }
    .van-icon {
      width: 10px;
      height: 10px;
      background: #ff3849;
      border-radius: 50%;
    }
    .van-step__circle {
      width: 10px;
      height: 10px;
      background: #edf0f5;
      border-radius: 50%;
    }
  }
}
</style>