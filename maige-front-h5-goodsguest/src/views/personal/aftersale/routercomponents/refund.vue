<template>
  <div class="v-personal-aftersale-refund">
    <navbar
      class="navbar"
      :title="title"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    ></navbar>
    <ul class="orderList">
      <li class="order" v-for="(item,index) in data && data.afterSaleGoodsVos" :key="index">
        <div class="proInfo">
          <i class="proImg">
            <img :src="item.thumbnailImgUrl" alt />
          </i>
          <div>
            <p class="proName">{{item.goodsName}}</p>
            <p class="specs">{{item.goodsAttr}}</p>
          </div>
          <div>
            <p class="price">￥{{item.goodsPrice}}</p>
            <p class="number">x {{item.saleQuantity}}</p>
          </div>
        </div>
        <div class="applyNumWrap flex_between" v-if="skuId">
          <span style="color: #666">申请数量</span>
          <van-stepper v-model="num" integer :max="item.saleQuantity" />
        </div>
      </li>
    </ul>
    <div class="wrapper">
      <!-- <div class="flex_between" @click="$router.push({name:'aftersaleselectoro'})">
        <span class="midgrey">批量退货</span>
        <p class="flex">
          <span>同订单商品可批量退货</span>
          <van-icon name="arrow" />
        </p>
      </div>-->
      <div class="money">
        <van-field
          v-model="compensateAmount"
          type="number"
          label="退款金额"
          placeholder="请输入退款金额"
          required
          v-if="code == 0 || code == 1 || code ==6"
        />
      </div>
      <div class="flex_between">
        <span class="midgrey">
          <span class="required">*</span> 申请原因
        </span>
        <p class="flex" @click="show = true">
          <span>{{afterReason || '请选择申请原因'}}</span>
          <van-icon name="arrow" />
        </p>
      </div>
      <van-cell-group>
        <van-field
          v-model="questionDesc"
          rows="4"
          :autosize="{maxHeight: 120}"
          type="textarea"
          maxlength="500"
          placeholder="请描述申请售后服务的具体原因，还可以上传最多9张图片~ "
          show-word-limit
        />
      </van-cell-group>
      <van-uploader v-model="fileList" multiple :max-count="9" :after-read="beforeRead" :before-delete="deleteimg"/>
      <p style="color: #FF3849;padding-bottom: 16px">为了帮您更好的解决问题，请务必上传照片凭证</p>
    </div>
    <div class="wrapper">
      <div class="flex_between" v-if="code === 6">
        <span class="midgrey">退款方式</span>
        <p class="flex">
          <span>原支付返回</span>
          <i class="icon" @click="tip">
            <img src="~assets/images/aftersale/i.png" alt />
          </i>
        </p>
      </div>
      <div
        class="flex_between"
        @click="taskshow = true"
        v-if="data.afterSaleGoodsVos && (data.afterSaleGoodsVos[0].sourceType === 1 || data.afterSaleGoodsVos[0].sourceType === 3)"
      >
        <span class="midgrey">返回方式</span>
        <p class="flex">
          <span>{{taskradio === 0 ? '上门取件' : '快递至商家'}}</span>
          <van-icon name="arrow" />
        </p>
      </div>
      <p
        v-if="taskradio === 0 && data.afterSaleGoodsVos && (data.afterSaleGoodsVos[0].sourceType === 1 || data.afterSaleGoodsVos[0].sourceType === 3)"
        style="color:#999;padding-bottom: 24px"
      >
        本次上门取件将会向您收取相应的运费。
        <span style="color:#FF3849">《售后运费说明》</span>
      </p>
      <p
        v-if="taskradio === 1 && data.afterSaleGoodsVos && (data.afterSaleGoodsVos[0].sourceType === 1 || data.afterSaleGoodsVos[0].sourceType === 3)"
        style="color:#999;padding-bottom: 10px"
      >商品寄回地址将在审核通过后以短信形式告知，或在申请记录中查询。商家不收取快递快递附加费。</p>
      <p
        v-if="taskradio === 1 && data.afterSaleGoodsVos && (data.afterSaleGoodsVos[0].sourceType === 1 || data.afterSaleGoodsVos[0].sourceType === 3)"
        style="color:#999;padding-bottom: 24px"
      >如您将返回方式由“上门取件”改为“快递至商家”，需您自行承担物流费用，无法享受免费上门取件。</p>
    </div>
    <div class="wrapper" v-if="taskradio === 0">
      <div class="wrapper1" @click="ediotAdress">
        <p class="flex_start">
          <i class="icon_right">
            <img src="~assets/images/aftersale/icon_address.png" alt />
          </i>
          <span>{{data && data.applierName}} {{data.applierPhone && data.applierPhone.slice(0,3)}}****{{data.applierPhone && data.applierPhone.slice(7,11)}}</span>
        </p>
        <p class="flex_between" style="color: #999;padding-left: 18px">
          <span>地址：{{data && (data.pickwareProvince+data.pickwareCity+data.pickwareCounty+data.pickwareVillage+data.pickwareAddress)}}</span>
          <van-icon name="arrow" />
        </p>
      </div>
      <!-- <div>
        <div class="flex_between">
          <p class="flex">
            <i class="icon_right">
              <img src="~assets/images/aftersale/icon_calendar.png" alt />
            </i>
            <span>11月6日（星期三）9:00-15:00</span>
          </p>
          <van-icon name="arrow" />
        </div>
      </div>-->
    </div>
    <div class="wrapper" v-if="taskradio === 1">
      <div class="flex_between">
        <p class="flex">
          <i class="icon_right">
            <img src="~assets/images/aftersale/icon_calendar.png" alt />
          </i>
          <span>宋晓燕 136****8866</span>
        </p>
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="btn" @click="submit">提交</div>

    <!-- 申请退货原因 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
      <h3 class="reasonTitle">申请原因</h3>
      <van-radio-group v-model="afterReason">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in reasons"
            :key="item.name"
            :title="item.name"
            clickable
            @click="afterReason = item.name;show = false"
          >
            <van-radio slot="right-icon" :name="item.name" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>

    <!-- 返回方式 -->
    <van-popup v-model="taskshow" position="bottom" :style="{ height: '20%' }">
      <h3 class="reasonTitle">返回方式</h3>
      <van-radio-group v-model="taskradio">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in takeArr"
            :key="item.id"
            :title="item.text"
            clickable
            @click="taskradio = index;taskshow=false"
          >
            <van-radio slot="right-icon" :name="index" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>

    <!-- 原支付返回提示 -->
    <van-popup v-model="tipshow" position="bottom" :style="{ height: '310px' }">
      <h3 class="reasonTitle">原支付返回</h3>
      <div class="back-div">
        <div class="tip">退款说明</div>
        <div
          class="tent"
        >在线支付支持原路返还;办公用品专属费用支付返还办公用品专属额度;员工福利专属费用支付返还员工福利专属额度;营销品专属费用支付返还营销品专属额度。 注:因购买商品而获得的积分将会在退款时扣时会退还商家;订单返现红包金额将会从退款中扣除;拼购返现订单中已经返现的金额将会从账户现金余额中扣除，账户内余额不足扣时将从退款中扣除相应金额。</div>
        <div class="sure" @click="tipshow = false">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 引入nav栏
import navbar from "components/navbar/nav";
import {
  findorderdetail,
  uploadFile,
  saveaftersale
} from "@/configs/interface.js"; //引入url
import { Toast } from "vant";
import { mySession } from "@/utils/cache.js"; //引入session
export default {
  name: "refund",
  components: { navbar },
  data() {
    return {
      reasons: [
        // 申请退款原因
        // { text: "发错货了", id: 1 },
        // { text: "商品损坏", id: 2 },
        // { text: "不想要了", id: 3 },
        // { text: "商品降价", id: 4 },
        // { text: "商品与页面描述不符", id: 5 }
        { name: "退运费" },
        { name: "商品成分描述不符" },
        { name: "生产日期/保质期与商品描述不符" },
        { name: "图片/产地/批号/规格等描述不符" },
        { name: "无法溶解/结块/有异物" },
        { name: "商品变质/发霉/有异物" },
        { name: "少件(含 缺少配件)" },
        { name: "收到商品时有破损/污渍/变形" },
        { name: "假冒品牌" },
        { name: "未按约定时间发货" },
        { name: "发票问题" },
        { name: "卖家发错货" },
        { name: "预约不到/卖家不给兑换" },
        { name: "7天无理由退换货" }
      ],
      takeArr: [
        // 申请退款原因
        { text: "上门取件", id: 1 },
        { text: "快递至商家", id: 2 }
      ],
      afterReason: "", // 申请原因
      taskradio: 0, //返回方式选择结果
      fileList: [],
      show: false, // 显示退货弹窗
      taskshow: false, //退回方式弹窗
      tipshow: false, //原支付返回提示
      compensateAmount: "", //退款金额
      questionDesc: "", //描述原因
      num: 1, // 申请退货数量
      title: "",
      orderSn: "", //订单id
      skuId: "", //商品skuId
      code: "", //售后类型
      data: {}, //售后数据
      picUrls: [], //传递给后台的相册
      readtrue: true, //按钮防抖，两秒内只能执行一次
      goodsArr: [] //批量操作所选择的商品
    };
  },
  methods: {
    //修改地址
    ediotAdress(){
      const obj = {
        picUrls:this.picUrls, //图片
        questionDesc:this.questionDesc, //描述原因
        afterReason:this.afterReason, //售后原因
        returnType:this.code, // 售后类型
        compensateAmount:this.compensateAmount, //退款金额
        orderSn:this.orderSn //订单号
      }
      //存储用户所填信息
      mySession.set('safaDesc',obj)
      this.$router.push({
        path:'/address/list',
        query:{
          address:'sale'
        }
      })
    },
    //原支付返回提示
    tip() {
      this.tipshow = true;
    },
    //提交
    submit() {
      if (!this.compensateAmount && (this.code == 0 || this.code == 1 || this.code == 6)) {
        Toast.fail("请填写退款金额");
        return false;
      }
      if (!this.afterReason) {
        Toast.fail("请先选择售后原因");
        return false;
      }
      if (!this.questionDesc) {
        Toast.fail("请填写售后服务的具体原因");
        return false;
      }
      if (this.readtrue) {
        //按钮防抖 控制是否发送请求
        this.readtrue = false;
        let obj = {};
        obj.afterSaleComplainParam = this.data.afterSaleGoodsVos;
        obj.afterSaleComplainParam.forEach(item => {
          item.picUrls = this.picUrls; //售后图片
          item.questionDesc = this.questionDesc; //描述原因
          item.afterReason = this.afterReason; //售后原因
          item.returnType = this.code; // 售后类型
          item.compensateAmount = this.compensateAmount; //退款金额
          item.pickwareProvince = this.data.pickwareProvince; //省
          item.pickwareProvinceId = this.data.pickwareProvinceId; //省
          item.pickwareCity = this.data.pickwareCity; //市
          item.pickwareCityId = this.data.pickwareCityId; //市
          item.pickwareCounty = this.data.pickwareCounty; //县
          item.pickwareCountyId = this.data.pickwareCountyId; //县
          item.pickwareVillage = this.data.pickwareVillage; //镇
          item.pickwareVillageId = this.data.pickwareVillageId; //镇
          item.pickwareAddress = this.data.pickwareAddress; //详细地址
        });
        //不存在则为单个商品申请，可以更改数量
        if (!this.goodsArr) {
          obj.afterSaleComplainParam[0].complainQuantity = this.num; //售后数量
        }
        obj.afterSaleParam = JSON.parse(JSON.stringify(this.data));
        delete obj.afterSaleParam.afterSaleGoodsVos;
        this.$http({
          method: "POST",
          url: saveaftersale,
          data: obj
        }).then(res => {
          if (res.code == 200) {
            Toast.success(res.message);
                  mySession.remove('safaDesc')
            this.$router.push({
              path: "/personal/ordermanage"
            });
          }
          this.readtrue = true;
        });
      }
    },
    // 切换返回方式
    toggle() {},
    deleteimg(file,detail){
      this.fileList.splice(detail.index,1)
      this.picUrls.splice(detail.index,1)
    },
    // 上传前校验
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
    //显示对应的售后标题
    codetitle() {},
    //查询详情
    findorderdetail(val) {
      this.$http({
        method: "GET",
        url: findorderdetail,
        data: {
          orderSn: this.orderSn,
          skuId: this.skuId
        }
      }).then(res => {
        if (res.code == 200) {
          const arr = [];
          if (this.goodsArr.length) {
            this.goodsArr.forEach(item => {
              res.data.afterSaleGoodsVos.forEach((val, index) => {
                if (item === val.skuId) {
                  arr.push(val);
                }
              });
            });
          }
          //批量操作重新赋值
          if (arr.length) {
            res.data.afterSaleGoodsVos = arr;
          }
          this.data = res.data;
          //展示对应的头部标题文字
          res.data.afterSaleGoodsVos[0].returnTypeList.forEach(item => {
            if (item.code == val) {
              this.title = item.name;
            }
          });
          let saleAdress = this.$store.state.common.saleAdress;
          //判断用户是否选中地址
          if(!(JSON.stringify(saleAdress) === '""')){
            this.data.applierName = saleAdress.consignee //名称
            this.data.applierPhone = saleAdress.phone //电话
            this.data.pickwareProvince = saleAdress.provinceName; //省
            this.data.pickwareProvinceId = saleAdress.province; //省
            this.data.pickwareCity  = saleAdress.cityName; //市
            this.data.pickwareCityId  = saleAdress.city; //市
            this.data.pickwareCounty = saleAdress.districtName; //县
            this.data.pickwareCountyId  = saleAdress.district; //县
            this.data.pickwareVillage = saleAdress.townName; //镇
            this.data.pickwareVillageId = saleAdress.town; //镇
            this.data.pickwareAddress = saleAdress.address; //详细地址
          }
          const userDesc = mySession.get('safaDesc')
          if(userDesc != null){
            this.picUrls = userDesc.picUrls //图片
            userDesc.picUrls.forEach(item => {
              this.fileList.push({
                url:item
              })
            })
            this.questionDesc = userDesc.questionDesc //描述原因
            this.afterReason = userDesc.afterReason //售后原因
            this.code = userDesc.returnType // 售后类型
            this.compensateAmount = userDesc.compensateAmount //退款金额
          }
        }
      });
    }
  },
  mounted() {
    if (this.$route.query.orderSn) {
      const data =  mySession.get('safaDesc')
      //如果存在售后数据，进行对比
      if(data){
        if(this.$route.query.orderSn != data.orderSn){
          //不相同的话挪掉缓存数据
          mySession.remove('safaDesc')
        }
      }
      this.orderSn = this.$route.query.orderSn;
      this.skuId = this.$route.query.skuId;
      this.code = this.$route.query.code; //获取售后类型
      this.goodsArr = this.$route.query.goodsArr && this.$route.query.goodsArr.split(","); //批量操作的数组
      this.findorderdetail(this.$route.query.code);
    }
  },
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
  .required {
    color: #ee0a24;
    font-size: 14px;
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
        margin-bottom: 10px;
        padding-bottom: 10px;
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
  .wrapper {
    .money {
      .van-field__control {
        text-align: right;
      }
      .van-cell--required::before {
        left: 0;
      }
      .van-cell {
        padding-left: 10px;
      }
    }
  }
}
</style>