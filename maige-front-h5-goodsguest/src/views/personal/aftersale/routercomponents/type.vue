<template>
  <div class="v-personal-aftersale-type">
    <navbar
      class="navbar"
      :title="title"
      color="#fff"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
    ></navbar>
    <ul class="orderList">
      <van-checkbox-group v-model="goodsArr">
      <li class="order" v-for="(item,index) in data.afterSaleGoodsVos" :key="index" @click="checkli(item)">
        <div class="proInfo">
          <van-checkbox :name="item.skuId" v-if="!skuId" :key="item.skuId"></van-checkbox>
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
      </li>
      </van-checkbox-group>
    </ul>
    <div class="wrapper">
      <div
        class="type"
        @click="apply(item)"
        v-for="(item,index) in data.afterSaleGoodsVos && data.afterSaleGoodsVos[0].returnTypeList"
        :key="index"
      >
        <div class="typeNameWrap">
          <i class="typeIcon">
            <img src="~assets/images/aftersale/tuihuo.png" alt v-if="item.code === 0" />
            <img src="~assets/images/aftersale/huanhuo.png" alt v-if="item.code === 1" />
            <img src="~assets/images/aftersale/weixiu.png" alt v-if="item.code === 2" />
            <img src="~assets/images/aftersale/posunbuji.png" alt v-if="item.code === 3" />
            <img src="~assets/images/aftersale/diujianbuji.png" alt v-if="item.code === 4" />
            <img src="~assets/images/aftersale/bujipeijian.png" alt v-if="item.code === 5" />
            <img src="~assets/images/aftersale/buchangfeiyong.png" alt v-if="item.code === 6" />
          </i>
          <span class="typeName">{{item.name}}</span>
        </div>
        <div class="flex">
          <div style="margin-right: 10px">
            <p class="tipword" v-if="item.code === 0">退回收到的商品</p>
            <p class="tipword" v-if="item.code === 1">维修收到的商品</p>
            <p class="tipword" v-if="item.code === 2">更换收到的商品</p>
            <p class="tipword" v-if="item.code === 3">货物破损需补寄</p>
            <p class="tipword" v-if="item.code === 4">未收到货需重新补寄</p>
            <p class="tipword" v-if="item.code === 5">缺失配件需补寄</p>
            <p class="tipword" v-if="item.code === 6">商家补偿费用</p>
            <p class="tipword red" v-if="item.code === 0">支持7天无理由退货</p>
          </div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "components/navbar/nav"; //头部nav栏
import { aftersaleetail, findorderdetail } from "@/configs/interface.js"; //引入url
import { Toast } from "vant"; //引入弹窗
export default {
  name: "type",
  components: { navbar },
  data() {
    return {
      title: "选择售后类型",
      orderSn: "", //订单id
      skuId: "", //商品skuId
      data: {}, //订单详情
      goodsArr:[], //批量操作选择的商品id
    };
  },
  methods: {
    //点击勾选单选框
    checkli(val){
      const index = this.goodsArr.indexOf(val.skuId)
      if(index === -1){
        this.goodsArr.push(val.skuId)
      }else{
        this.goodsArr.splice(index,1)
      }
    },
    //申请类型
    apply(val) {
      if(!this.skuId){
        //未选中商品不能进行下一步操作
        if(this.goodsArr.length === 0){
          Toast.fail("请选择对应的操作商品");
          return false
        }
      }
      //把选中的sku数组分割成字符串
      const goodsArr = this.goodsArr.join(',')
      this.$router.push({
        path: "/personal/aftersale/refund",
        query: {
          orderSn: this.orderSn,
          skuId: this.skuId,
          code: val.code,
          goodsArr:goodsArr || ''
        }
      });
    },
    //查询详情
    findorderdetail() {
      this.$http({
        method: "GET",
        url: findorderdetail,
        data: {
          orderSn: this.orderSn,
          skuId: this.skuId
        }
      }).then(res => {
        if (res.code == 200) {
          this.data = res.data;
        }
      });
    }
  },
  created() {
    if (this.$route.query.orderSn) {
      this.orderSn = this.$route.query.orderSn;
      this.skuId = this.$route.query.skuId;
    }
    this.findorderdetail();
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-aftersale-type {
  height: 100%;
  background-color: $lightColor;
  overflow: auto;
  padding-top: 60px;
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
    padding: 0 8px;
    width: 358px;
    margin: auto;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    .type:not(:last-of-type) {
      border: 1px solid rgba(247, 250, 255, 1);
    }
    .type {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 6px;
      .typeNameWrap {
        display: flex;
        align-items: center;
        .typeIcon {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .typeName {
          color: #333;
          font-size: 16px;
        }
      }
      .tipword {
        text-align: right;
        color: #999;
      }
      .red {
        color: #ff3849;
      }
    }
  }
}
</style>