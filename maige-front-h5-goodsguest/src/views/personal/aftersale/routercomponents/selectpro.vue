<template>
  <div class="v-personal-aftersale-selectpro">
    <navbar
      class="navbar"
      :title="title"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    ></navbar>
    <ul class="orderList">
      <li class="order">
        <div class="proInfo">
          <van-checkbox v-model="checked" checked-color="#FF3555"></van-checkbox>
          <i class="proImg">
            <img
              src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2018939532,1617516463&fm=26&gp=0.jpg"
              alt
            />
          </i>
          <div>
            <p class="proName">批量操作 Midea/美的燕窝婴儿粥隔（玫瑰粉）</p>
            <div class="numoperation">
              <span>11111111</span>
              <van-stepper v-model="num" integer max="100" />
            </div>
          </div>
        </div>
      </li>
      <li class="order">
        <div class="proInfo">
          <van-checkbox v-model="checked" checked-color="#FF3555"></van-checkbox>
          <i class="proImg">
            <img
              src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2018939532,1617516463&fm=26&gp=0.jpg"
              alt
            />
          </i>
          <div>
            <p class="proName">批量操作 Midea/美的燕窝婴儿粥隔（玫瑰粉）</p>
            <div class="numoperation">
              <span>11111111</span>
              <van-stepper v-model="num" integer max="100" />
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="bottom-div">
      <van-checkbox v-model="checkAll" checked-color="#FF3555">全选</van-checkbox>
      <div class="btn">确定</div>
    </div>
  </div>
</template>

<script>
// 引入nav栏
import navbar from "components/navbar/nav";
export default {
  name: "selectpro",
  components: { navbar },
  data() {
    return {
      checked: false, // 复选框
      checkAll: false, //全选
      reasons: [
        // 申请退款原因
        { text: "发错货了", id: 1 },
        { text: "商品损坏", id: 2 },
        { text: "不想要了", id: 3 },
        { text: "商品降价", id: 4 },
        { text: "商品与页面描述不符", id: 5 }
      ],
      takeArr: [
        // 申请退款原因
        { text: "上门取件", id: 1 },
        { text: "快递至商家", id: 2 }
      ],
      radio: "", // 选择结果
      taskradio: 0, //返回方式选择结果
      fileList: [],
      show: false, // 显示退货弹窗
      taskshow: false, //退回方式弹窗
      message: "", //
      num: 1, // 申请退货数量
      title: "批量退货商品选择"
    };
  },
  methods: {
    // 切换返回方式
    toggle() {},
    // 上传前校验
    beforeRead(file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        this.$toast("请上传 jpg 或 png 格式图片");
        return false;
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-aftersale-selectpro {
  height: 100%;
  background-color: $lightColor;
  overflow: auto;
  padding-top: 60px;
  span {
    color: #333;
  }
  .midgrey {
    color: #666;
  }
  .orderList {
    padding-top: 20px;
    background: url("~assets/images/account/bg@2x.png") no-repeat;
    background-size: 100% 136px;
    background-position: top center;
    margin-bottom: 14px;
    .order {
      width: 358px;
      box-sizing: border-box;
      padding: 10px 10px;
      background: rgba(255, 255, 255, 1);
      margin: auto;
      .proInfo {
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(247, 250, 255, 1);
        .van-checkbox__icon {
          margin-left: 10px;
        }
        .proImg {
          display: block;
          width: 70px;
          height: 70px;
          border-radius: 8px;
          background: #f7faff;
          flex-shrink: 0;
          margin-right: 12px;
          margin-left: 17px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .proName {
          width: 208px;
          @include ellipsis2(2);
          color: #454545;
        }
        .numoperation {
          display: flex;
          align-items: center;
          position: relative;
          .van-stepper {
            position: absolute;
            right: 0;
          }
        }
        .specs {
          width: 172px;
          @include ellipsis;
          color: #999;
        }
        .price {
          font-size: 14px;
          margin-bottom: 8px;
        }
        .number {
          text-align: right;
          color: #999;
        }
      }
      .btnWrap {
        text-align: right;
        .btn_afterSale {
          display: inline-block;
          width: 66px;
          height: 26px;
          line-height: 26px;
          border: 1px solid rgba(255, 56, 73, 1);
          border-radius: 13px;
          text-align: center;
          color: #ff3849;
        }
      }
    }
    .order:first-of-type {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    .order:last-of-type {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }
  .bottom-div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: 13px;
    border-radius: 15px;
    height: 50px;
    background: white;
    position: absolute;
    bottom: 0;
    padding: 0 25px;
    .btn {
      width: 80px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      color: #fff;
      background: #ff3555;
    }
  }
}
</style>