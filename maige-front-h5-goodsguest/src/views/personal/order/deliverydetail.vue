<template>
  <div class="v-personal-delivery">
    <navbar
      title="查看物流"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    ></navbar>
    <div class="delivery_info">
      <div class="info_item">
        <span class="info_name">快递单号：</span>
        <span class="info_content">{{deliveryInfo.logisticsNo}}</span>
      </div>
      <div class="info_item">
        <span class="info_name">物流公司：</span>
        <span class="info_content">{{deliveryInfo.shippingName}}</span>
      </div>
    </div>
    <ul v-if="deliveryList && deliveryList.length > 1" class="steps">
      <li
        :class="index < 1 ? 'active' : 'new_info'"
        :key="index"
        v-for="(item, index) in deliveryList"
      >
        <div class="step_left">
          <div class="date">
            <div class="month">{{item.time && $moment(item.time).format('MM-DD')}}</div>
            <div class="time">{{item.time && $moment(item.time).format('HH:mm')}}</div>
          </div>
          <!-- 在途中或其他状态的图标状态 -->
          <i v-if="item.context && item.time" class="circle_default"></i>
        </div>
        <div class="step_right">
          <div class="main_title">{{getTarget(0)}}</div>
          <div class="address_des">{{item.context}}</div>
        </div>
      </li>
    </ul>
    <div
      v-if="!deliveryList || deliveryList.length === 0 || !deliveryList[0].context"
      class="delivery_none"
    >暂无物流信息</div>
    <!-- 回到顶部组件 -->
    <back-top />
  </div>
</template>

<script>
/**
 * 物流详情页面
 * 返回值: monitorStatus 监控状态:polling:监控中，shutdown:结束，abort:中止，updateall：重新推送。
 *                      其中当快递单为已签收时status=shutdown，当message为“3天查询无记录”或“60天无变化时”status= abort ，
 *                      对于stuatus=abort的状度，需要增加额外的处理逻辑
 *        lastResult--最新查询结果;destResult--最新的目的国家的查询结果;
 *        state--快递单当前状态，包括0在途，1揽收，2疑难，3签收，4退签，5派件，6退回等7个状态
 *        status-- 在途、签收
 *        time-- 时间
 */
// 头部nav栏
import navbar from "@/components/navbar/nav.vue";
// 确认弹窗
import { Dialog, Toast } from "vant";
// 接口
import { singleDelivery } from "@/configs/interface.js";
import { deliveryStateArr } from "@/configs/commondata.js";
export default {
  name: "commentedit",
  data() {
    return {
      // 订单详情
      deliveryInfo: {},
      // 订单的流程数组，最新的在最上面
      deliveryList: [],
      // 快递单的状态映射数组
      stateArr: deliveryStateArr
    };
  },
  components: {
    navbar
  },
  created() {
    this.getDeliveryDetail();
  },
  methods: {
    // 查询单个物流详情
    getDeliveryDetail() {
      this.$http({
        method: "get",
        url: singleDelivery,
        data: {
          deliveryId: this.$route.query.deliveryId
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          this.deliveryInfo = data;
          this.deliveryList = data.logisticsInfos;
        }
      });
    },
    // 根据状态返回快递状态文字
    getTarget(value) {
      let result = "";
      if (value == null || value == undefined || value == "") {
        return result;
      }
      this.stateArr &&
        this.stateArr.map(item => {
          if (item.value == value) {
            result = item.name;
          }
        });
      return result;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-delivery {
  height: 100%;
  background-color: $lightColor;
  height: 100vh;
  overflow: auto;
  padding-top: 60px;
  padding-bottom: 50px;
  .delivery_info {
    background: #fff;
    padding: 10px 21px;
    .info_item {
      padding: 10px 0;
      font-size: 13px;
      .info_name {
        color: #666;
      }
      .info_content {
        color: #454545;
      }
    }
  }
  /* 进度条 */
  .steps {
    position: relative;
    background: #fff;
    margin-top: 13px;
    padding: 10px;
    // overflow: hidden;
    // 步骤的样式
    li {
      font-size: 14px;
      width: 100%;
      position: relative;
      display: flex;
      align-items: flex-start;
      padding: 45px 6px;
      color: #454545;
      height: 0;
    }
    // 最新的物流样式
    .new_info {
      color: #999;
    }
    // 步骤条左边的样式
    .step_left {
      width: 80px;
      display: flex;
      align-items: center;
      .date {
        flex: 1;
        .month {
          font-size: 14px;
          text-align: right;
        }
        .time {
          font-size: 9px;
          text-align: right;
        }
      }
      // 默认圆点的样式
      .circle_default {
        width: 36px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .circle_default:before {
        display: block;
        content: "";
        width: 10px;
        height: 10px;
        background-color: #ccc;
        line-height: 10px;
        border-radius: 10px;
        font-size: 0;
        color: #fff;
        text-align: center;
        font-weight: 600;
      }
    }
    // 步骤条右边的样式
    .step_right {
      flex: 1;
      word-break: break-all;
      padding-right: 9px;
      .main_title {
        font-size: 14px;
      }
    }
    li i {
      position: relative;
    }
    /* 连接线的样式 */
    li ~ li:after {
      content: "";
      width: 0;
      height: calc(100% - 10px);
      border: 1px dashed #ccc;
      position: absolute;
      left: 67px;
      top: calc(-50% + 20px);
      z-index: 0;
    }
    /* 当前完成的点和线变绿 */
    li.active .circle_default:before,
    li.active:after {
      border: 1px dashed #6fb1bd;
      background: #6fb1bd;
    }
  }
  .delivery_none {
    width: 100%;
    height: 50px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    background: #fff;
  }
}
</style>