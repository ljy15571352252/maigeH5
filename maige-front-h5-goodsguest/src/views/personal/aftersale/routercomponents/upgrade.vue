<template>
  <div class="v-personal-aftersale-upgrade">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="shops" v-for="(item,index) in dataArr" :key="index">
        <div class="title">
          <span class="shopName">服务单号：{{item.afterSaleSn}}</span>
          <div class="left">
            <i class="shopLogo">
              <!-- <img src="~assets/images/aftersale/icon_return@2x.png" alt /> -->
            </i>
            <span class="orderTime">{{item.returnTypeName}}</span>
          </div>
          <!-- <div class="left" v-else>
              <i class="shopLogo">
                <img src="~assets/images/aftersale/icon_exchange@2x.png" alt />
              </i>
              <span class="orderTime">换货</span>
          </div>-->
        </div>
        <ul class="orderList">
          <li class="order">
            <div class="proInfo"  v-for="(val,index) in item.afterSaleGoodsVo" :key="index">
              <i class="proImg">
                <img :src="val.thumbnailImgUrl" alt />
              </i>
              <div>
                <p class="proName">{{val.goodsName}}</p>
                <p class="specs">{{val.goodsAttr}}</p>
              </div>
              <div>
                <p class="price">￥{{val.specialPrice}}</p>
                <p class="number">x {{val.complainQuantity}}</p>
              </div>
            </div>
            <div class="waiting"
              @click="$router.push({name:'aftersaleticket',query:{afterId:item.afterId,complainId:item.complainId}})">
              <span style="color: #454545">{{item.actionName}}</span>
              <span style="color: #999">{{item.actionResult}}</span>
              <van-icon name="arrow" />
            </div>
            <div class="btnWrap">
              <span
                class="btn_afterSale btn_cancel"
                v-if="item.agencyStatus === 1 || item.agencyStatus === 2 || item.agencyStatus === 3 "
                @click="cancelafterSale(item)"
              >取消售后</span>
              <span
                class="btn_afterSale btn_cancel"
                v-if="(item.returnType == 0 || item.returnType == 1 || item.returnType == 2) && item.checkAfterStatus==1 && item.returnLogisticNo==null &&(item.agencyStatus ==1 || item.agencyStatus ==2 || item.agencyStatus ==3)"
                @click="sendback(item)"
              >寄回</span>
              <span
                class="btn_afterSale btn_cancel"
                v-if="item.checkAfterStatus == 1 && ( item.returnType == 1 || item.returnType == 2 || item.returnType == 3 || item.returnType == 4 || item.returnType == 5) && (item.receiveUserTime === '' || item.receiveUserTime === null) && item.logisticsNo != '' && item.logisticsNo != null"
                @click="delivery(item)"
              >签收快递</span>
            </div>
          </li>
        </ul>
      </div>
    </van-list>
  </div>
</template>

<script>
//引入url
import {
  aftersalepage,
  cancelafterSale,
  userreceive
} from "@/configs/interface.js";
import { Dialog, Toast } from "vant";
export default {
  props:{
    goodsName:{
      type:String
    },
    timeRange:{
      type:Number
    }
  },
  name: "upgrade",
  data() {
    return {
      dataArr: [], //售后订单数据
      pageSize: 10, //请求条数
      pageIndex: 1, //请求页数
      loading: false, //上拉加载
      finished: false //上拉加载完毕
    };
  },
  methods: {
    //上拉加载
    onLoad() {
      this.pageSize += 10;
      const that = this;
      setTimeout(function() {
        that.getAllafters();
      }, 1000);
    },
    //确认收货
    delivery(val) {
      Dialog.confirm({
        title: "签收快递",
        message: "是否确认签收快递"
      })
        .then(() => {
          this.$http({
            method: "GET",
            url: userreceive,
            data: {
              complainId: val.complainId
            }
          }).then(res => {
            if (res.code === 200) {
              Toast.success(res.message);
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    //寄回
    sendback(val) {
      this.$router.push({
        name: "AfterSalesendback",
        query: {
          afterId: val.afterId,
          complainId: val.complainId
        }
      });
    },
    //获取升级客诉
    getAllafters() {
      const obj = {};
      obj.requestStatus = 7; //升级客诉
      obj.pageSize = this.pageSize;
      obj.pageIndex = this.pageIndex;
      if (this.goodsName) {
        obj.goodsName = this.goodsName;
      }
      this.$nextTick(() =>{
        obj.timeRange = this.timeRange===0?'':this.timeRange;
      })
      this.$http({
        method: "POST",
        url: aftersalepage,
        data: obj
      }).then(res => {
        if (res.code === 200) {
          this.loading = false; //加载完毕
          this.finished = false; //加载完毕
          this.dataArr = res.data.pageList;
          if (res.data.count === res.data.pageList.length) {
            this.finished = true; //加载完毕
          }
        }
      });
    },
    cancelafterSale(val) {
      Dialog.confirm({
        title: "提示",
        message: "是否确认取消该订单的售后"
      })
        .then(() => {
          this.$http({
            method: "GET",
            url: cancelafterSale,
            data: {
              complainId: val.complainId
            }
          }).then(res => {
            if (res.code === 200) {
              Toast.success(res.message);
              this.getAllafters();
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  created() {
    // this.getAllafters();
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-aftersale-upgrade {
  // 订单
  .shops {
    background: rgba(255, 255, 255, 1);
    width: 358px;
    margin: auto;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 16px 10px;
    margin-bottom: 12px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(247, 250, 255, 1);
      .left {
        display: flex;
        align-items: center;
        .shopLogo {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 4px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .shopName {
          font-size: 16px;
          color: #666;
        }
      }
      .orderTime {
        color: #333;
      }
    }
    .orderList {
      .order {
        padding: 12px 0 0;
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
        .waiting {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px;
          background: rgba(247, 250, 255, 1);
          border-radius: 5px;
          margin-bottom: 25px;
        }
        .btnWrap {
          text-align: right;
          .btn_afterSale {
            margin-left: 10px;
            display: inline-block;
            padding: 0 14px;
            height: 26px;
            line-height: 26px;
            border: 1px solid rgba(255, 56, 73, 1);
            border-radius: 13px;
            text-align: center;
            color: #ff3849;
          }
          .btn_cancel {
            border-color: #999;
            color: #454545;
          }
        }
      }
    }
  }
}
</style>