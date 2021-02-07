<template>
  <van-action-sheet v-model="showmodal" @closed="hide">
    <div class="c-modal-buymodal">
      <div class="info_header">
        <img :src="currentGoods.thumbnailImgUrl" />
        <div>
          <div class="red_item">
            <span class="instr" v-if="$route.query.groupMember">拼团价：</span>
            <span class="instr" v-else>商城价：</span>
            <span class="price_num">￥{{currentGoods.goodsPrice}}</span>
          </div>
          <del class="gray_item">
            <span>市场价：</span>
            <span>{{currentGoods.costPrice}}</span>
          </del>
          <div class="gray_item">
            <span>库存：</span>
            <span>{{currentGoods.quantity}}</span>
          </div>
          <div class="tips">请选择规格</div>
        </div>
      </div>
      <div class="model" :key="item.specId" v-for="(item) in typeArr">
        <div class="type">{{item.specName}}</div>
        <div class="type_content">
          <van-tag
            :key="sub.valueId"
            v-for="(sub) in item.specValues"
            round
            :color="itemStatus(sub) ? 'rgba(255,58,68,0.1)' : 'rgba(240,240,240,0.6)'"
            @click="changeType(sub, item)"
          >
            <span
              class="no_choose"
              :style="{color: typeOK(sub, item) ? ((itemStatus(sub) ? '#ff3a44' : '#333')) : '#ccc'}"
            >{{sub.value}}</span>
          </van-tag>
        </div>
      </div>
      <div class="product_num">
        <span class="type">数量</span>
        <van-stepper
          v-model="productNum"
          integer
          :max="currentGoods.quantity"
          @change="goodsNumChange"
        />
      </div>
      <div class="confirm_button">
        <van-button @click="confirmResult" type="primary" size="small">确定</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<script>
/*
 * 正常选择商品弹窗
 * 使用方式：引入注册，实例化 <buymodal></buymodal>
 * 参数说明：1. data 商品的所有信息
 *          2. chooseChange 选择的商品变化时的自定义事件
 *          3. hide 关闭弹窗的自定义事件
 *          4. v-model="" 控制弹窗开启或关闭
 *          5. numChange 加入购物车的商品数量变化的自定义事件
 *          6. buyNow 是否是立即购买
 */
import { Toast } from "vant";
// 公共的请求
import { addShopCart, getShopCartNum } from "@/configs/common.js";
export default {
  name: "buymodal",
  data() {
    return {
      // 是否展示弹窗
      showmodal: this.value,
      // 商品的一切信息
      goodsInfo: {},
      // 商品所有的规格数组
      typeArr: [],
      // 不同规格对应的商品信息数组
      goodsArr: [],
      // 当前选择规格的商品信息
      currentGoods: {},
      // 当前选择的规格数组
      currentTypes: [],
      // 当前商品的数量
      productNum: 1
    };
  },
  props: {
    // 弹窗是否关闭 true表示打开
    value: {
      default: false
    },
    // 传过来的商品信息
    data: {
      default: {}
    },
    // 是否是立即购买
    buyNow: {
      default: false
    },
    // 是否是拼团
    isAssemble: {
      default: false
    },
    // 是否是团购
    isGroup: {
      default: false
    },
    // 拼团信息
    groupId: {
      default: ""
    },
    // 是否来自活动
    isActivity: {
      default: false
    },
    // 是否添加至购物车
    addShoppingCart: {
      default: false
    }
  },
  watch: {
    // 监听value变化
    value(newValue) {
      this.showmodal = newValue;
    },
    // 监听data
    data: {
      handler(newValue) {
        if (!newValue) {
          return;
        }
        const newData = JSON.parse(JSON.stringify(newValue));
        // 商品信息
        this.goodsInfo = JSON.parse(JSON.stringify(newData));
        // 所有的型号数组
        this.typeArr = JSON.parse(JSON.stringify(newData.skuList));
        // 所有型号的商品
        this.goodsArr = JSON.parse(JSON.stringify(newData.skuDetailList));
        // 默认当前型号商品
        const current = JSON.parse(
          JSON.stringify(newData.skuDetailList && newData.skuDetailList[0])
        );
        if (current) {
          current.productNum = this.productNum;
          this.currentTypes = JSON.parse(JSON.stringify(current.specInfo));
          this.currentGoods = JSON.parse(JSON.stringify(current));
          this.$emit("chooseChange", this.currentGoods);
        }
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    // 自定义关闭事件
    hide() {
      this.$emit("hide", false);
    },
    // 商品数量的变化事件
    goodsNumChange(num) {
      let goods = this.currentGoods;
      goods.productNum = this.productNum;
      this.currentGoods = goods;
      this.$emit("chooseChange", this.currentGoods);
    },
    // 选中类型的变化事件
    changeType(target, parent) {
      // 如果不存在则不选中
      if (!this.typeOK(target, parent)) {
        return;
      }
      // 当前类型的所有型号
      let specValues = parent.specValues;
      // 当前选中的型号数组，遍历，删除之前的同类型的型号，并添加进新选择的
      let current = JSON.parse(JSON.stringify(this.currentTypes));
      current &&
        current.map((item, index) => {
          specValues &&
            specValues.map(sub => {
              if (sub.valueId == item.valueId) {
                this.currentTypes.splice(index, 1);
              }
            });
        });
      this.currentTypes.push(target);
      // 当前组合型号的valueId数组
      let currentArr = this.currentTypes.map(sun => {
        return sun.valueId;
      });
      this.goodsArr.map(sub => {
        // valueId数组
        let specArr = sub.specInfo.map(sun => {
          return sun.valueId;
        });
        let flag = this.arrCompare(specArr, currentArr);
        if (flag) {
          let goodsObj = sub;
          goodsObj.productNum = this.productNum;
          this.currentGoods = goodsObj;
          this.$emit("chooseChange", this.currentGoods);
        }
      });
    },
    // 不计较顺序比对两个数组内容是否相同 true表示相同，false不同
    arrCompare(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false;
      if (a.length != b.length) return false;

      for (var i = 0, len = b.length; i < len; i++) {
        if (a.indexOf(b[i]) == -1 && b.indexOf(a[i]) == -1) {
          return false;
        }
      }
      return true;
    },
    // 判断数组中的对象是否存在目标valueId
    isExit(arr, item) {
      let flag = false;
      arr.map(sub => {
        if (sub.valueId == item.valueId) {
          flag = true;
        }
      });
      return flag;
    },
    // 判断目标选项是否已经选中，选中true，没选中fasle
    itemStatus(target) {
      let types = this.currentTypes || [];
      let status = false;
      types.map((item, index) => {
        if (item.valueId === target.valueId) {
          status = true;
        }
      });
      return status;
    },
    // 遍历查询当前型号是否在商品中存在,target表示目标型号，parent表示型号的父级
    typeOK(target, parent) {
      let current = JSON.parse(JSON.stringify(this.currentTypes));
      // 找到当前的替换之前的
      let specValues = parent.specValues;
      this.currentTypes &&
        this.currentTypes.map((item, index) => {
          specValues &&
            specValues.map(sub => {
              if (sub.valueId === item.valueId) {
                current.splice(index, 1);
              }
            });
        });
      current.push(target);
      let status = false;
      // 当前组合型号的valueId数组
      let currentArr = current.map(sun => {
        return sun.valueId;
      });
      // 遍历商品数组看；类型数组是否匹配.true表示匹配，false表示不匹配
      this.goodsArr.map(sub => {
        // valueId数组
        let specArr = sub.specInfo.map(sun => {
          return sun.valueId;
        });
        let flag = this.arrCompare(specArr, currentArr);
        if (flag) {
          status = true;
        }
      });
      return status;
    },
    // 确认结果
    confirmResult() {
      // 结算清空多地址的缓存
      this.$store.commit("common/setMutipleAddress", undefined);
      // 当前的型号
      if (this.currentTypes.length != this.typeArr.length) {
        Toast("请完成商品选择");
        return;
      }
      let currentGoods = this.currentGoods;
      currentGoods.productNum = this.productNum;
      this.currentGoods = currentGoods;
      this.$emit("chooseChange", this.currentGoods);
      // 来自团购，则唤醒团购的弹窗
      if (this.isGroup) {
        this.$emit("showGroup");
        return;
      }
      if (this.buyNow) {
        if (this.isActivity || this.assemble) {
          this.buyOK(true);
        } else {
          this.buyOK();
        }
      } else if (this.addShoppingCart) {
        if (this.isActivity || this.assemble) {
          this.addCart(true);
        } else {
          this.addCart();
        }
      } else {
        // 点击已选触发
        this.addCart("choose");
      }
    },
    // 立即购买
    buyOK(bool) {
      let data = {
        activityGoodsId: null, // 活动商品Id
        activityId: null, // 活动Id
        activityTypeNum: null, // 活动类型num
        goodsId: this.goodsInfo.goodsId, // 商品id
        groupId: null, // 拼团id
        quantity: this.productNum, // 当前商品数量
        skuId: this.currentGoods.skuId, // 当前规格商品的skuid
        useIntegral: 0, // 是否使用积分1：是；0：否
        payId: 0 //支付方式id
      };
      //活动商品
      if (bool) {
        data.activityGoodsId = this.$route.query.activityGoodsId;
        data.activityId = this.$route.query.activityId;
        data.activityTypeNum = this.$route.query.activityTypeNum;
        data.groupId = this.groupId || null;
      }
      this.$store.commit("common/setBuyNow", data);
      //活动商品跳转多带一个activityId参数
      this.$router.push({
        name: "orderSubmit",
        query: {
          address: "0",
          // 1表示立即购买 0表示购物车结算
          buyNow: 1,
          activityId: this.$route.query.activityId
        }
      });
    },
    // 加入购物车
    addCart(bool) {
      this.hide();
      // 请求购物车接口
      let data = {
        goodsId: this.goodsInfo.goodsId,
        goodsName: this.goodsInfo.goodsName,
        goodsPrice: this.currentGoods.goodsPrice,
        goodsSn: this.goodsInfo.goodsSn,
        quantity: this.productNum,
        skuId: this.currentGoods.skuId,
        supplierId: this.goodsInfo.supplierId
      };
      if (bool) {
        data.activityGoodsId = this.$route.query.activityGoodsId;
        data.activityId = this.$route.query.activityId;
        data.activityTypeNum = this.$route.query.activityTypeNum;
        data.groupId = this.groupId || null;
      }
      if (bool === "choose") {
        return;
      }
      addShopCart(data).then(res => {
        if (res.code === 200) {
          Toast("添加成功");
          // 查询加入购物车的商品数量
          getShopCartNum().then(res => {
            let data = res.data || 0;
            this.$emit("numChange", data);
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.c-modal-buymodal {
  padding: 16px 18px 60px 18px;
  .info_header {
    display: flex;
    align-items: flex-end;
    img {
      width: 91px;
      height: 91px;
      margin-right: 11px;
    }
    .red_item {
      color: #ff3945;
      line-height: 20px;
      .instr {
        font-size: 12px;
      }
      .price_num {
        font-size: 16px;
      }
    }
    .gray_item {
      line-height: 20px;
      color: #999;
    }
  }
  .model {
    margin-top: 26px;
    .type {
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }
    .type_content {
      margin-top: 5px;
      .van-tag:nth-of-type(n + 1) {
        margin-right: 10px;
      }
    }
    .no_choose {
      color: #333;
    }
  }
  .product_num {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    .type {
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }
  }

  .confirm_button {
    padding: 0;
    .van-button {
      width: 100%;
      border-radius: 4px;
    }
  }
}
</style>
