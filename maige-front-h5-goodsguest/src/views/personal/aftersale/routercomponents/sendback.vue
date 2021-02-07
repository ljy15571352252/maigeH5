<template>
  <div class="personal-aftersale-routercomponents-sendback">
    <navbar
      class="navbar"
      title="寄回快递"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    ></navbar>
    <div>
      <div class="tent-div">
        <van-cell title="商家联系人：" :value="data.supplierConsignee" />
      </div>
      <div class="tent-div">
        <van-cell title="商家联系电话：" :value="data.supplierPhone" />
      </div>
      <div class="tent-div">
        <van-cell title="商家地址：" :value="data.supplierReAddress" />
      </div>
      <van-cell
        is-link
        :value="shippingName || '请选择物流公司'"
        @click="shipping"
        style="margin-top:10px;padding-left: 8px;"
      >
        <template slot="title">
          <span style="color:#FF3849;margin-right:2px">*</span>
          <span>物流公司：</span>
        </template>
      </van-cell>
      <div class="tent-div">
        <van-field v-model="logisticsNo" label="物流单号：" placeholder="请输入物流单号" required />
      </div>
      <van-cell
        is-link
        :value="containLogistic || '请选择快递支付方式'"
        style="padding-left: 8px;"
        @click="containshow = true"
      >
        <template slot="title">
          <span style="color:#FF3849;margin-right:2px">*</span>
          <span>快递支付方式：</span>
        </template>
      </van-cell>
      <div class="tent-div">
        <van-field v-model="logisticPrice" label="快递费：" placeholder="请输入快递费" required />
      </div>
      <div class="img-div">
        <span>
          <van-uploader
            v-model="fileList"
            multiple
            :max-count="9"
            :after-read="beforeRead"
            :before-delete="deleteimg"
          ></van-uploader>
        </span>
        <p style="color: #FF3849;padding-bottom: 16px">为了帮您更好的解决问题，请务必上传照片面单</p>
      </div>
    </div>
    <div class="btn" @click="submit">提交</div>

    <!-- 选择物流公司-->
    <van-popup v-model="shippingshow" position="bottom" :style="{ height: '40%' }">
      <h3 class="reasonTitle">快递公司</h3>
      <van-radio-group v-model="shippingId">
        <van-cell-group>
          <van-cell
            v-for="item in shippingCompanyArr"
            :key="item.shippingId"
            :title="item.shippingName"
            clickable
            @click="selectShipp(item)"
          >
            <van-radio slot="right-icon" :name="item.shippingId" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>

    <!-- 快递费用支付方式-->
    <van-popup v-model="containshow" position="bottom" :style="{ height: '40%' }">
      <h3 class="reasonTitle">支付方式</h3>
      <van-radio-group v-model="containLogisticPrice">
        <van-cell-group>
          <van-cell
            v-for="item in containArr"
            :key="item.value"
            :title="item.name"
            clickable
            @click="containLogisticPrice = item.value;containLogistic = item.name;containshow = false"
          >
            <van-radio slot="right-icon" :name="item.value" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
  </div>
</template>

<script>
// 引入nav栏
import navbar from "components/navbar/nav";
import {
  aftergoodslist,
  shippingCompany,
  uploadFile,
  userreturngoods
} from "@/configs/interface.js"; //引入url
import { Toast } from "vant"; //引入提示
export default {
  components: { navbar },
  data() {
    return {
      shippingshow: false, //物流公司弹窗
      containshow: false, //控制快递支付方式弹窗
      data: {}, //售后数据
      shippingId: "", // 物流公司id
      shippingName: "", //物流公司名称(展示)
      logisticsNo: "", //快递单号
      containLogistic: "", //客户快递支付名称
      containLogisticPrice: "", //客户支付方式
      containArr: [{ name: "已付", value: 0 }, { name: "到付", value: 1 }],
      logisticPrice: "", //运费
      shippingCompanyArr: [], //快递公司
      fileList: [], // 图片相册
      picUrls: [] //传递给后台的相册
    };
  },
  methods: {
    //弹窗选择物流弹窗
    shipping() {
      this.shippingshow = true;
    },
    //选择物流公司
    selectShipp(item) {
      this.shippingId = item.shippingId;
      this.shippingshow = false;
      this.shippingName = item.shippingName;
    },
    //提交
    submit() {
      const obj = {};
      if (this.shippingId === "") {
        Toast.fail("请选择物流公司");
        return false;
      }
      if (this.logisticsNo === "") {
        Toast.fail("请输入物流单号");
        return false;
      }
      if (this.containLogisticPrice === "") {
        Toast.fail("请选择快递支付方式");
        return false;
      }
      if (this.logisticPrice === "") {
        Toast.fail("请输入运费");
        return false;
      }
      if (!this.picUrls.length) {
        Toast.fail("请上传快递面单");
        return false;
      }
      obj.afterGoodsId = this.data.afterGoodsId;
      obj.afterId = this.data.afterId;
      obj.complainId = this.data.complainId;
      obj.containLogisticPrice = this.containLogisticPrice; //客户快递支付方式
      obj.logisticsNo = this.logisticsNo;
      obj.shippingId = this.shippingId;
      obj.logisticPrice = this.logisticPrice;
      obj.shippingPics = this.picUrls;
      this.$http({
        method: "POST",
        url: userreturngoods,
        data: obj
      }).then(res => {
        if (res.code == 200) {
          Toast.success(res.message);
          this.$router.go(-1);
        }
      });
    },
    //删除图片
    deleteimg(file, detail) {
      this.fileList.splice(detail.index, 1);
      this.picUrls.splice(detail.index, 1);
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
    },
    //查询详情
    aftergoodslist() {
      this.$http({
        method: "GET",
        url: aftergoodslist,
        data: {
          complainId: this.complainId
        }
      }).then(res => {
        if (res.code == 200) {
          this.data = res.data[0];
          console.log(res.data[0]);
        }
      });
    },
    //获取所有的快递公司
    shippingCompany() {
      this.$http({
        method: "GET",
        url: shippingCompany,
        data: {}
      }).then(res => {
        if (res.code == 200) {
          this.shippingCompanyArr = res.data;
        }
      });
    }
  },
  created() {
    if (this.$route.query.afterId && this.$route.query.complainId) {
      this.afterId = this.$route.query.afterId;
      this.complainId = this.$route.query.complainId;
    }
    this.aftergoodslist();
    this.shippingCompany();
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.personal-aftersale-routercomponents-sendback {
  height: 100%;
  background-color: $lightColor;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 60px;
  .tent-div {
    height: 44px;
    line-height: 44px;
    .title {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
    .input {
      height: 40px;
      border: none;
    }
  }
  .img-div {
    background: white;
    padding-left: 10px;
    .title {
      color: #323233;
    }
  }
  .reasonTitle {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    line-height: 3;
    color: rgba(51, 51, 51, 1);
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
  .van-cell:not(:last-child)::after {
    border-bottom: none;
  }
}
</style>