<template>
  <van-action-sheet class="v-personal-returnpay" v-model="isCancel" title="订单退款" @close="close">
    <div class="cancelorder_content">
      <!-- <div class="tip_des">
        <div class="tip_title">温馨提示:</div>
        <div class="tip_content">
          <div>1.限时特价、预约资格等购买优惠可能一并取消</div>
          <div>2.支付券不予返还;支付优惠一并取消</div>
          <div>3.订单一旦取消，无法恢复</div>
          <div>4.微信订单返现金额会从退款中扣除</div>
        </div>
      </div>-->
      <div class="title">请选择退款的原因(必选) :</div>
      <van-dropdown-menu :overlay="false">
        <van-dropdown-item v-model="currentChoose" :options="options" />
      </van-dropdown-menu>
      <div class="title">请填写具体描述 :</div>
      <van-field type="textarea" v-model="questionDesc" placeholder="请输入问题描述" :maxlength="200" />
      <div class="img_arr">
        <van-uploader v-model="fileList" multiple :max-count="5" :before-read="beforeRead" />
      </div>
      <van-button class="confirm_btn" size="small" round type="primary" @click="confirmResult">确定</van-button>
    </div>
  </van-action-sheet>
</template>

<script>
/**
 * 取消订单弹窗
 * 参数说明： 1.reload
 */
import { returnMoney, uploadFile } from "@/configs/interface.js";
import { baseURL } from "@/configs/env.js";
import { Toast } from "vant";
export default {
  name: "cancelorder",
  data() {
    return {
      // 是否退款
      isCancel: false,
      // 当前点击的订单的信息
      orderInfo: {},
      // 当前选择的退款理由字符串
      currentChoose: "",
      // 问题的描述
      questionDesc: "",
      // 选项的渲染数组
      options: [
        { value: "退运费", text: "退运费" },
        { value: "商品成分描述不符", text: "商品成分描述不符" },
        {
          value: "生产日期/保质期与商品描述不符",
          text: "生产日期/保质期与商品描述不符"
        },
        {
          value: "图片/产地/批号/规格等描述不符",
          text: "图片/产地/批号/规格等描述不符"
        },
        { value: "无法溶解/结块/有异物", text: "无法溶解/结块/有异物" },
        { value: "商品变质/发霉/有异物", text: "商品变质/发霉/有异物" },
        { value: "少件(含 缺少配件)", text: "少件(含 缺少配件)" },
        {
          value: "收到商品时有破损/污渍/变形",
          text: "收到商品时有破损/污渍/变形"
        },
        { value: "假冒品牌", text: "假冒品牌" },
        { value: "未按约定时间发货", text: "未按约定时间发货" },
        { value: "发票问题", text: "发票问题" },
        { value: "卖家发错货", text: "卖家发错货" },
        { value: "预约不到/卖家不给兑换", text: "预约不到/卖家不给兑换" },
        { value: "7天无理由退换货", text: "7天无理由退换货" }
      ],
      // 图片预览数组
      fileList: [],
      // 上传的图片链接
      imgList: []
    };
  },
  props: {
    value: "",
    // 当前点击的订单信息
    order: {
      default: {}
    }
  },
  watch: {
    value(newValue) {
      this.isCancel = newValue;
    },
    order: {
      handler(newValue) {
        if (newValue) {
          const data = JSON.parse(JSON.stringify(newValue));
          this.orderInfo = data;
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    // 关闭弹窗
    close() {
      this.$emit("close", false);
    },
    // 上传前校验
    beforeRead(file) {
      if (file.type == "image/jpeg" || file.type === "image/png") {
        let param = new FormData();
        param.append("file", file);
        this.$http({
          method: "POST",
          url: uploadFile,
          headers: { "Content-Type": "multipart/form-data" },
          data: param
        }).then(res => {
          if (res.code == 200) {
            const imgUrl = res.data.domain + res.data.filePath;
            this.imgList.push(imgUrl);
          }
        });
        return true;
      } else {
        Toast("请上传 jpg/png 格式图片");
      }
      return false;
    },
    // 确定退款
    confirmResult() {
      if (!this.currentChoose) {
        Toast("请选择退款原因");
        return;
      }
      this.$http({
        method: "post",
        url: returnMoney,
        data: {
          orderId: this.orderInfo.orderId,
          orderSn: this.orderInfo.orderSn,
          refundReason: this.currentChoose,
          userName: this.orderInfo.consignee,
          picUrls: this.imgList,
          questionDesc: this.questionDesc
        }
      }).then(res => {
        if (res.code === 200) {
          this.close();
          this.$emit("reload", null);
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-returnpay {
  background: #fff;
  height: 60%;
  overflow: auto;
  .cancelorder_content {
    padding: 15px 15px 20px 15px;
    .title {
      margin-top: 15px;
      font-size: 15px;
      font-weight: 500;
      color: #333;
      padding: 10px 0;
    }
    .group_box {
      font-size: 15px;
      color: #454545;
    }
    .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
      border: 0;
    }
    // 下拉菜单的样式
    .van-dropdown-menu {
      border: 1px solid #ccc;
      border-radius: 4px;
      height: 30px;
    }
    .van-dropdown-menu__item {
      justify-content: space-between;
    }
    .van-dropdown-menu__title {
      width: 100%;
      height: 100%;
      .van-ellipsis {
        line-height: 28px;
      }
    }
    .van-dropdown-menu__title:after {
      right: 10px;
    }
    // textarea样式
    .van-cell.van-field {
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }
  .img_arr {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
  }
  .confirm_btn {
    width: 100%;
    margin: 0 auto;
  }
}
</style>

