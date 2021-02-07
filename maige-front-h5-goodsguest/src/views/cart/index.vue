<template>
  <div class="v-cart-index">
    <navbar
      class="cart_header"
      title="购物车"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    >
      <template slot="right">
        <span
          class="edit_btn"
          v-if="goodslist.length > 0"
          @click="editAndFinish"
        >{{isEdit ? '完成' : '编辑'}}</span>
      </template>
    </navbar>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div v-if="isLogin() === false" class="header_login">
        <span class="login_btn" @click="toLogin">登录</span>
        <span>登录后同步电脑与手机购物车中的商品</span>
      </div>
      <div v-if="goodslist.length > 0" class="cart_content">
        <div ref="child" :key="index" v-for="(goods, index) in allgoods" class="cart-cartitem">
          <!-- <div class="store_name">
            <van-checkbox
              v-model="goods.allChecked"
              checked-color="#ff3945"
              @click="itemToggleAll(goods)"
            >
              <div class="group_box">
                <img class="group_icon" :src="goods.groupIcon" />
                <span class="group_name one-txt-cut">{{goods.supplierName}}</span>
                <van-icon class="next_icon" name="arrow" />
              </div>
            </van-checkbox>
          </div>-->
          <div class="store_choose">
            <div :key="item.cartId" v-for="(item) in goods.data">
              <van-checkbox
                v-model="item.checked"
                checked-color="#ff3945"
                @click="changeStatus(item)"
              >
                <div class="goods_items">
                  <img class="goods_img" @click.stop="toDetail(item)" v-lazy="item.thumbnailImgUrl" />
                  <div class="right_box">
                    <div class="goods_name two-txt-cut">{{item.goodsName}}</div>
                    <div class="goods_type one-txt-cut">
                      {{item.goodsAttr}}
                      <van-icon name="arrow-down" />
                    </div>
                    <div class="footer_show">
                      <span class="now_price">￥{{item.specialPrice}}</span>
                      <van-stepper
                        v-model="item.quantity"
                        :max="item.goodsNumber - 1"
                        integer
                        @change="changeNum(item)"
                      />
                    </div>
                  </div>
                </div>
              </van-checkbox>
              <van-divider />
            </div>
          </div>
        </div>
      </div>
      <div v-if="!goodslist || goodslist.length === 0" class="cart_none">
        <img class="none_img" src="~assets/images/cart/cart_none.png" />
        <div class="none_des">你的购物车空空如也，快去挑选好物吧~</div>
        <div>
          <span class="to_home" @click="toHome">去首页</span>
          <span class="to_focus">看看关注</span>
        </div>
      </div>
      <div class="recommend_area">
        <recommend ref="recommend" />
      </div>
    </van-pull-refresh>
    <div v-if="!isEdit" class="footer_nav">
      <van-checkbox v-model="allChecked" checked-color="#ff3945" @click="toggleAll">全选</van-checkbox>
      <div class="count_right">
        <span>合计：</span>
        <span class="price">￥{{(formatFloat(choosegoods.allPrice, 4)) || 0}}</span>
        <div
          class="cash_btn"
          @click="closeAccount"
        >去结算({{choosegoods.allNum > 100 ? '99+' : (choosegoods.allNum || 0)}})</div>
      </div>
    </div>
    <div v-if="isEdit" class="footer_nav">
      <van-checkbox v-model="allChecked" checked-color="#ff3945" @click="toggleAll">全选</van-checkbox>
      <div class="edit_right">
        <img class="clear_img" src="~assets/images/cart/clear_icon.png" />
        <!-- <span class="clear_text" @click="showClear">清理</span> -->
        <!-- <span class="collection" @click="moveCollection">移入收藏夹</span> -->
        <span class="del" @click="delChoose">删除</span>
      </div>
    </div>
    <clearmodal :goodslist="goodslist" :isClear="isClear" @close="close" />
    <!-- 回到顶部组件 -->
    <back-top />
  </div>
</template>

<script>
// 头部nav栏
import navbar from "@/components/navbar/nav";
// 为你推荐/热销排行/猜你喜欢
import recommend from "@/views/cart/content/recommend.vue";
// 清理弹窗
import clearmodal from "@/views/cart/modal/clearmodal.vue";
// 格式化保留并输出浮点数小数, 和格式化亿万单位
import { formatFloat, unitChange } from "@/utils/unitchange.js";

// 接口
import {
  cartGoodsList,
  updateCartNum,
  updateCartChecked,
  deleteCart
} from "@/configs/interface.js";
/**
 * 购物车主页
 */
// 引入公共的业务逻辑
import { Toast } from "vant";
import { isLogin } from "@/configs/common.js";
export default {
  name: "cart",
  data() {
    return {
      // 当前购物车里所有的货物信息(根据选择而改变)
      goodslist: [],
      // 是否为编辑状态
      isEdit: false,
      // 是否展示清理弹窗
      isClear: false,
      isLoading: false, // 下拉刷新
      // 所有商品是否全选
      allChecked: false
    };
  },
  props: {},
  mounted() {
    this.getList();
  },
  components: {
    navbar,
    recommend,
    clearmodal
  },
  computed: {
    // 将接口返回的数据按所在店铺分组
    allgoods() {
      return this.changeGoods(this.goodslist);
    },
    // 所有选中商品的总价格和总数量
    choosegoods() {
      let allPrice = 0;
      let allNum = 0;
      this.goodslist.map((item, index) => {
        if (item.checked) {
          allPrice = allPrice + item.quantity * item.specialPrice;
          allNum += item.quantity;
        }
      });
      return { allPrice, allNum };
    },
    // 所有商品的选中的cartId数组
    allCartIdArr() {
      let arr = [];
      this.goodslist.map(item => {
        if (item.checked) {
          arr.push(item.cartId);
        }
      });
      return arr;
    },
    // 所有商品未选中的cartId数组
    noneCartIdArr() {
      let arr = [];
      this.goodslist.map(item => {
        if (!item.checked) {
          arr.push(item.cartId);
        }
      });
      return arr;
    }
  },
  methods: {
    isLogin,
    formatFloat,
    unitChange,
    // 去登陆
    toLogin() {
      this.$router.push({
        name: "login"
      });
    },
    // 去首页
    toHome() {
      this.$router.push({
        name: "home"
      });
    },
    // 编辑操作/完成操作
    editAndFinish() {
      if (!this.isEdit) {
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    },
    // 将接口返回的数据按所在店铺分组
    changeGoods(list) {
      // 暂时对象存储，用来判断是否存在这个supplierId
      let newObj = {};
      // 最终需要的数组格式
      let newArr = [];
      list &&
        list.map((item, index) => {
          if (!newObj[item.supplierId]) {
            newArr.push({
              supplierId: item.supplierId,
              supplierName: item.supplierName,
              groupIcon: item.groupIcon,
              data: [item]
            });
            newObj[item.supplierId] = item;
          } else {
            newArr &&
              newArr.map((sub, num) => {
                if (sub.supplierId === item.supplierId) {
                  sub.data.push(item);
                }
              });
          }
        });
      return newArr;
    },
    // 根据goodsList返显选中状态
    showStatus() {
      // 反显店铺按钮选项
      this.allgoods &&
        this.allgoods.map(item => {
          let flag = 1;
          item.data &&
            item.data.map(sub => {
              if (!sub.checked) {
                flag = 0;
              }
            });
          if (flag) {
            item.allChecked = true;
          } else {
            item.allChecked = false;
          }
        });
      // 反显全选按钮
      if (
        this.allCartIdArr.length &&
        this.allCartIdArr.length === this.goodslist.length
      ) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
      this.$forceUpdate();
    },
    // 单选项点击
    changeStatus(item) {
      this.updateGoodsChecked(item.cartId, item.checked ? 0 : 1);
    },
    // 全选/反选所有商品
    toggleAll() {
      let allNum = 0;
      this.goodslist.map((item, index) => {
        allNum += item.quantity;
      });
      if (allNum < 1) {
        return;
      }
      if (this.allChecked) {
        this.updateGoodsChecked(this.allCartIdArr.join(","), 0);
      } else {
        this.updateGoodsChecked(this.noneCartIdArr.join(","), 1);
      }
    },
    // 全选/反选店铺商品
    itemToggleAll(goods) {
      let cartIds = [];
      this.goodslist.map(item => {
        if (item.supplierId === goods.supplierId) {
          cartIds.push(item.cartId);
        }
      });
      if (goods.allChecked) {
        this.updateGoodsChecked(cartIds.join(","), 0);
      } else {
        this.updateGoodsChecked(cartIds.join(","), 1);
      }
    },
    // 修改商品数量
    changeNum(item) {
      event.stopPropagation();
      const cartId = item.cartId;
      const quantity = item.quantity;
      const goodsId = item.goodsId;
      const skuId = item.skuId;
      let formdata = new FormData();
      formdata.append("cartId", cartId);
      formdata.append("quantity", quantity);
      formdata.append("goodsId", goodsId);
      formdata.append("skuId", skuId);
      if (quantity >= item.goodsNumber) {
        Toast("已达到最大可购买数量");
        return;
      }
      this.updateGoodsNum(formdata);
    },
    // 更新商品的数量请求
    updateGoodsNum(formdata) {
      this.$http({
        method: "put",
        url: updateCartNum,
        data: formdata
      }).then(res => {});
    },
    // 移入收藏夹
    moveCollection() {},
    // 删除选中的
    delChoose() {
      this.$http({
        method: "delete",
        url: deleteCart,
        data: {
          cartIds: this.allCartIdArr.join(",")
        }
      }).then(res => {
        this.getList();
      });
    },
    // 下拉调用此函数(通过ref调用子组件查询的操作)
    onRefresh() {
      window.setTimeout(() => {
        this.isLoading = true;
        this.getList();
      }, 1000);
    },
    // 展示清理弹窗
    showClear() {
      this.isClear = true;
    },
    // 点击组件关闭弹窗时触发关闭函数
    close() {
      this.isClear = false;
    },
    // 结算
    closeAccount() {
      if (this.allCartIdArr.length <= 0) {
        return;
      }
      // 购物车结算清空多地址的缓存
      this.$store.commit("common/setMutipleAddress", undefined);
      // address为0时表示单地址，为1时表示多地址, buyNow为0时表示购物车结算为1时表示立即购买
      this.$router.push({
        name: "orderSubmit",
        query: { address: "0", buyNow: 0 }
      });
    },
    // 修改目标商品的选中状态请求
    updateGoodsChecked(cartIds, checked) {
      this.$http({
        method: "get",
        url: updateCartChecked,
        data: {
          cartIds: cartIds,
          checked: checked
        }
      }).then(res => {
        if (res.code === 200) {
          this.getList();
        }
      });
    },
    // 查询购物车列表
    getList() {
      this.$http({
        method: "get",
        url: cartGoodsList,
        data: {}
      }).then(res => {
        // 将isLoading重置为false
        this.isLoading = false;
        if (res.code == 200) {
          let data = res.data || [];
          this.goodslist = data;
          this.showStatus();
        }
      });
    },
    // 跳转到商品详情
    toDetail(item) {
      this.$router.push({
        name: "productnormal",
        query: {
          id: item.goodsId,
          activityId: item.activityId,
          activityGoodsId: item.activityGoodsId,
          groupMember: item.groupMember,
          activityTypeNum: item.activityTypeNum
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-cart-index {
  background: $lightColor;
  padding-top: 60px;
  padding-bottom: 100px;
  height: 100vh;
  overflow: auto;
  .cart_header {
    width: 100%;
    .edit_btn {
      color: #fff;
      font-size: 14px;
    }
  }
  // 没有登录的提示
  .header_login {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 50px;
    margin-top: 2px;
    color: #999;
    background: #fff;
    .login_btn {
      width: 57px;
      padding: 3px 0;
      text-align: center;
      border: 1px solid #999;
      border-radius: 25px;
      margin-right: 10px;
    }
  }
  // 购物车商品的样式
  .cart-cartitem {
    background: #fff;
    margin-top: 10px;
    // 分割线
    .van-divider {
      margin: 0;
      padding: 10px 0;
    }
    // checkbox样式
    .van-checkbox__label {
      flex: 1;
    }
    // 商店标题样式
    .store_name {
      padding: 10px 16px;
      display: flex;
      align-items: center;
      .group_box {
        display: flex;
        align-items: center;
        .group_icon {
          width: 12px;
          height: 12px;
          margin-right: 5px;
        }
        .group_name {
          max-width: 150px;
          color: #131313;
          font-size: 14px;
          margin-right: 12px;
          vertical-align: middle;
          font-weight: bold;
        }
        .next_icon {
          vertical-align: middle;
        }
      }
    }
    // 当前商店名下的购物车商品
    .store_choose {
      widows: 100%;
      padding: 15px 15px 0 15px;
    }
    .goods_items {
      display: flex;
      align-items: center;
      .goods_img {
        width: 68px;
        height: 68px;
        margin-right: 10px;
        margin-left: 15px;
      }
      .right_box {
        flex: 1;
      }
      .goods_name {
        word-break: break-all;
        color: #131313;
        font-size: 14px;
        font-weight: 400px;
      }
      .goods_type {
        color: #ccc;
        font-size: 11px;
        display: flex;
        align-items: center;
        margin-top: 10px;
        width: 150px;
      }
      .footer_show {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        .now_price {
          font-size: 15px;
          color: #ff3a44;
        }
      }
    }
  }
  // 没有内容的界面
  .cart_none {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 0 20px 0;
    .none_img {
      width: 70px;
      height: 60px;
    }
    .none_des {
      font-size: 11px;
      color: #999;
      margin: 10px 0;
    }
    .to_home {
      margin-right: 22px;
    }
    .to_home,
    .to_focus {
      padding: 3px 20px;
      text-align: center;
      color: #333;
      border: 1px solid #ccc;
      border-radius: 50px;
    }
  }
  // 底部的操作栏
  .footer_nav {
    width: 100%;
    height: 50px;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    position: fixed;
    bottom: 48px;
    left: 0;
    font-size: 13px;
    color: #131313;
    // 结算导航栏右边
    .count_right {
      display: flex;
      align-items: center;
      white-space: nowrap;
      .price {
        color: #ff3a44;
        font-size: 15px;
        margin-right: 10px;
      }
      .cash_btn {
        min-width: 93px;
        padding: 8px 5px;
        text-align: center;
        background: rgba(255, 57, 69, 1);
        border-radius: 25px;
        color: #fff;
        font-size: 15px;
      }
    }
    // 编辑导航栏右边
    .edit_right {
      display: flex;
      align-items: center;
      .clear_img {
        width: 15px;
        height: 15px;
        margin-right: 6px;
      }
      .clear_text {
        font-size: 14px;
        color: #707070;
      }
      .collection {
        width: 88px;
        padding: 6px 0;
        text-align: center;
        color: #ff9500;
        border: 1px solid #ff9500;
        border-radius: 25px;
        margin-left: 20px;
        margin-right: 8px;
      }
      .del {
        width: 60px;
        padding: 6px 0;
        text-align: center;
        color: #fc332e;
        border: 1px solid #fc332e;
        border-radius: 25px;
      }
    }
  }
}
</style>