<template>
  <div class="personal-aftersale-routercomponents-processing">
    <navbar
      class="navbar"
      :title="title"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    ></navbar>
    <div class="structure">
      <div class="img-div">
        <!-- 还有个未完成图标 -->
        <img
          src="~assets/images/personal/finish.png"
          alt
          v-if="stepArr && stepArr[stepArr.length-1] && stepArr[stepArr.length-1].code === 1"
        />
        <img src="~assets/images/personal/unfinish.png" alt v-else />
        <span>{{stepArr && stepArr[stepArr.length-1] && stepArr[stepArr.length-1].code === 1?"已完成！":"未完成"}}</span>
      </div>
      <div class="img-div step">
        <span class="tent-span" v-for="(item,index) in stepArr" :key="index">
          <img src="~assets/images/personal/smallfinish.png" alt v-if="item.code===1" />
          <img src="~assets/images/personal/unsmallfinish.png" alt v-if="item.code != 1" />
          <span class="name">{{item.name}}</span>
          <span
            :class="item.code===1?'right-bor':'right-bor none-bor'"
            v-if="index !== stepArr.length-1"
          ></span>
        </span>
      </div>
      <div class="detial-tent" @click="detail">
        <div>
          <span>{{data && data.actionName}}</span>
          <span>{{data && data.actionResult}}</span>
        </div>
        <span class="right-sanjiao"></span>
      </div>
      <div class="goodsmsg">
        <div class="top-msg">
          <span>商品信息</span>
          <span>申请数量：{{goodsNum }}</span>
        </div>
        <div class="msg-top" v-for="(item,index) in data.afterSaleGoodsVos" :key="index">
          <img :src="item.thumbnailImgUrl" alt />
          <div class="tent">
            <div>{{item && item.goodsName}}</div>
            <div>{{item && item.goodsAttr}}</div>
          </div>
          <div class="num">
            <div>{{item && item.goodsPrice}}</div>
            <div>x {{item && item.complainQuantity }}</div>
          </div>
        </div>
      </div>
      <div class="order">
        <div class="tip-div">
          <span>服务单号</span>
          <span>{{data && data.afterSaleSn}}</span>
        </div>
        <div class="tip-div">
          <span>申请时间</span>
          <span>{{data && data.applyTime}}</span>
        </div>
        <div class="tip-div">
          <span>服务类型</span>
          <span>{{data && data.returnTypeName}}</span>
        </div>
        <!-- <div class="tip-div">
          <span>商品退回</span>
          <span>上门取件</span>
        </div> -->
        <div class="tip-div">
          <span>取件地址</span>
          <span>{{data && data.wholeAddress}}</span>
        </div>
        <div class="tip-div">
          <span>联系人</span>
          <span>{{data && data.applierName}}</span>
        </div>
        <div class="tip-div">
          <span>联系电话</span>
          <span>{{data.applierPhone && data.applierPhone.slice(0,3)}}****{{data.applierPhone && data.applierPhone.slice(7,11)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 服务单详情
 */
// 引入nav栏
import navbar from "components/navbar/nav";
import { aftersaleetail } from "@/configs/interface.js"; //引入url
export default {
  name: "ticket",
  components: { navbar },
  data() {
    return {
      title: "服务单详情",
      checked: false, //是否完成
      data: {}, //售后数据
      stepArr: [],
      goodsNum: 0 //商品总数
    };
  },
  methods: {
    //进度详情
    detail() {
      this.$router.push({
        name: "aftersaleticketdetail",
        query: {
          complainId: this.data.complainId,
          returnType: this.data.returnType
        }
      });
    },
    //查询详情
    aftersaleetail() {
      this.$http({
        method: "GET",
        url: aftersaleetail,
        data: {
          afterId: this.afterId, // 售后单id
          complainId: this.complainId // 客诉id
        }
      }).then(res => {
        if (res.code == 200) {
          this.data = res.data;
          res.data.afterSaleGoodsVos.forEach(item => {
            this.goodsNum += item.complainQuantity;
          });
          this.stepArr = res.data.complainProcess;
        }
      });
    }
  },
  created() {
    if (this.$route.query.afterId && this.$route.query.complainId) {
      this.afterId = this.$route.query.afterId;
      this.complainId = this.$route.query.complainId;
    }
    this.aftersaleetail();
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.personal-aftersale-routercomponents-processing {
  height: 100%;
  background-color: $lightColor;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 60px;
  .structure {
    background: url("~assets/images/account/bg@2x.png") no-repeat;
    background-size: 100% 136px;
    background-position: top center;
    margin-bottom: 14px;
    .img-div {
      padding: 0 24px;
      display: flex;
      color: white;
      align-items: center;
      img {
        width: 26px;
        height: 26px;
      }
      span {
        margin-left: 6px;
      }
    }
    .step {
      margin-top: 15px;
      padding-bottom: 15px;
      position: relative;
      left: 9px;
      .tent-span {
        width: 25%;
        display: flex;
        flex-direction: column;
        position: relative;
        img {
          width: 9px;
          height: 9px;
        }
        .name {
          margin-top: 10px;
          position: absolute;
          left: -21px;
        }
        .right-bor {
          position: absolute;
          width: 100%;
          height: 2px;
          background: white;
          top: 3px;
        }
        .none-bor {
          opacity: 0.5;
        }
      }
      .tent-span:last-of-type {
        width: 40px;
      }
    }
    .detial-tent {
      margin: 0 10px;
      padding: 18px 11px 18px 20px;
      background: white;
      position: relative;
      border-radius: 6px;
      margin-top: 20px;
      div {
        width: 296px;
        display: flex;
        flex-direction: column;
        span:first-of-type {
          font-size: 13px;
        }
        span:last-of-type {
          font-size: 12px;
          color: #999999;
          @include ellipsis2(2);
        }
      }
      .right-sanjiao {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-top: 0.02667rem solid #b3b3b3;
        border-right: 0.02667rem solid #b3b3b3;
        transform: rotate(45deg);
        top: -0.08rem;
        position: absolute;
        right: 11px;
        top: 50%;
        margin-top: -4px;
      }
    }
    .goodsmsg {
      margin: 0 10px;
      margin-top: 10px;
      height: 135px;
      background: white;
      border-radius: 5px;
      padding-top: 17px;
      .top-msg {
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        span:last-of-type {
          color: #999;
        }
      }
      .msg-top {
        margin-top: 25px;
        padding: 0 9px;
        display: flex;
        position: relative;
        img {
          width: 70px;
          height: 70px;
        }
        .tent {
          margin-left: 11px;
          width: 172px;
          div:first-of-type {
            @include ellipsis2(2);
            line-height: 22px;
            color: #454545;
          }
          div:last-of-type {
            color: #999999;
          }
        }
        .num {
          text-align: right;
          position: absolute;
          right: 10px;
          top: 9px;
          div:first-of-type {
            font-size: 16px;
            color: #454545;
          }
          div:last-of-type {
            font-size: 11px;
            color: #999999;
          }
        }
      }
    }
    .order {
      margin: 0 10px;
      margin-top: 13px;
      background: white;
      padding: 20px 11px 14px 11px;
      .tip-div {
        margin-top: 19px;
        display: flex;
        span {
          color: #999999;
          font-size: 13px;
        }
        span:first-of-type {
          display: block;
          width: 60px;
        }
        span:last-of-type {
          color: #454545;
          margin-left: 20px;
        }
      }
      .tip-div:first-of-type {
        margin-top: 0;
      }
    }
  }
}
</style>