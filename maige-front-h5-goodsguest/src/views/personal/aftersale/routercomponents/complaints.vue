<template>
  <div class="v-personal-aftersale-refund">
    <navbar
      class="navbar"
      :title="title"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    ></navbar>
    <ul class="orderList">
      <li class="order">
        <div class="proInfo">
          <i class="proImg">
            <img :src="data.thumbnailImgUrl" alt />
          </i>
          <div>
            <p class="proName">{{data.goodsName}}</p>
            <p class="specs">{{data.goodsAttr}}</p>
          </div>
          <div>
            <p class="price">￥{{data.goodsPrice}}</p>
            <p class="number">x {{data.complainQuantity}}</p>
          </div>
        </div>
      </li>
    </ul>
    <div class="wrapper">
      <van-cell-group>
        <van-field
          v-model="message"
          rows="4"
          :autosize="{maxHeight: 120}"
          type="textarea"
          maxlength="500"
          placeholder="请描述申请售后服务的具体原因，还可以上传最多9张图片~ "
          show-word-limit
        />
      </van-cell-group>
      <van-uploader v-model="fileList" multiple :max-count="9" :after-read="beforeRead"></van-uploader>
      <p style="color: #FF3849;padding-bottom: 16px">为了帮您更好的解决问题，请务必上传照片凭证</p>
    </div>
    <div class="btn" @click="submit">提交</div>
  </div>
</template>

<script>
import navbar from "components/navbar/nav"; //头部nav栏
import {
  aftersaleetail,
  againaftersale,
  uploadFile
} from "@/configs/interface.js"; //引入url
import { Toast } from "vant";
export default {
  name: "type",
  components: { navbar },
  data() {
    return {
      title: "升级客诉",
      afterId: "", //售后单id
      complainId: "", //商品skuId
      data: {}, //订单详情
      fileList: [], // 图片相册
      picUrls: [], //传递给后台的相册
      message: "" //填写的理由
    };
  },
  methods: {
    //提交
    submit() {
      if (!this.message) {
        alert("请填写售后理由");
      } else {
        const obj = Object.assign({}, this.data);
        obj.picUrls = this.picUrls;
        obj.questionDesc = this.message;
        this.$http({
          method: "POST",
          url: againaftersale,
          data: obj
        }).then(res => {
          if (res.code == 200) {
            Toast.success(res.message);
            this.$router.go(-1);
          }
        });
      }
    },
    //查询详情
    aftersaleetail() {
      this.$http({
        method: "GET",
        url: aftersaleetail,
        data: {
          afterId: this.afterId,
          complainId: this.complainId
        }
      }).then(res => {
        if (res.code == 200) {
          this.data = res.data;
        }
      });
    },
    //验证图片
    beforeRead(file) {
      var formdata = new FormData(); // 创建form对象
      formdata.append("file", file.file);
      this.$http({
        method: "POST",
        url: uploadFile,
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(res => {
        if (res.code == 200) {
          this.picUrls.push(res.data.domain + res.data.filePath);
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
.v-personal-aftersale-refund {
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
      padding: 16px 10px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 1);
      margin: auto;
      .proInfo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(247, 250, 255, 1);
        .proImg {
          display: block;
          width: 70px;
          height: 70px;
          border-radius: 8px;
          background: #f7faff;
          flex-shrink: 0;
          margin-right: 12px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .proName {
          width: 172px;
          @include ellipsis2(2);
          margin-bottom: 10px;
          color: #454545;
          margin-right: 20px;
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
  }
  .wrapper {
    width: 358px;
    margin: auto;
    background: #fff;
    padding: 20px 8px 0;
    border-radius: 10px;
    box-sizing: border-box;
    margin-bottom: 12px;
    .van-icon {
      color: #999;
      font-size: 14px;
    }
    .wrapper1 {
      border-bottom: 1px solid #f7faff;
      margin-bottom: 12px;
    }
    .icon_right {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 6px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .flex_between {
      padding-bottom: 20px;
      .flex {
        .icon {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-left: 6px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .van-cell-group {
      margin-bottom: 12px;
      .van-cell {
        padding: 6px;
        background: #f7faff;
      }
    }
  }
  .btn {
    width: 340px;
    height: 38px;
    line-height: 38px;
    margin: auto;
    background: linear-gradient(
      45deg,
      rgba(255, 58, 67, 1) 0%,
      rgba(255, 49, 98, 1) 100%
    );
    border-radius: 19px;
    text-align: center;
    color: #fff;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .reasonTitle {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    line-height: 3;
    color: rgba(51, 51, 51, 1);
  }
  .back-div {
    padding: 0 22px;
    .tip {
      font-size: 15px;
      color: #333333;
      margin-bottom: 15px;
    }
    .tent {
      font-size: 13px;
      line-height: 22px;
    }
    .sure {
      height: 38px;
      font-size: 16px;
      color: white;
      border-radius: 18px;
      background: #ff3849;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
    }
  }
}
</style>