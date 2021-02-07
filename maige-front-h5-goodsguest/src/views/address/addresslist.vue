<template>
  <div class="v-address-addresslist">
    <navbar
      title="我的收货地址"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    ></navbar>
    <div class="list_content">
      <van-radio-group v-model="choose" checked-color="#ff3a44">
        <div :key="item.addressId" v-for="(item, index) in addressData">
          <van-radio :name="index" @click="chooseChange(item)">
            <div class="address">
              <div>
                <div class="user_phone">
                  <span>{{item.consignee}}</span>
                  <span class="divider">|</span>
                  <span>{{item.phone}}</span>
                </div>
                <div class="address_detail two-txt-cut">
                  <span class="default_tip" v-if="item.def">默认</span>
                  <span>{{item.provinceName + item.districtName + item.cityName + item.address}}</span>
                </div>
              </div>
              <img
                 v-if="$route.query.address !== 'sale'"
                class="edit_icon"
                src="~assets/images/address/edit.png"
                @click.stop="editAddress(item)"
              />
            </div>
          </van-radio>
          <van-divider />
        </div>
      </van-radio-group>
      <div class="add_btn" v-if="$route.query.address !== 'sale'">
        <van-button round size="small" type="primary" @click="addNew">添加新地址</van-button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 我的收货地址选择列表
 */

// 头部nav栏
import navbar from "@/components/navbar/nav";

import { getAddressList } from "@/configs/common.js";
import { Toast } from "vant";
export default {
  name: "addresslist",
  data() {
    return {
      // 选中的结果
      choose: "",
      // 我的收货地址列表
      addressData: []
    };
  },
  props: {},
  created() {
    this.getList();
  },
  components: {
    navbar
  },
  methods: {
    // 添加新地址
    addNew() {
      this.$router.push({
        name: "addAddress"
      });
    },
    // 选择添加地址
    chooseChange(item) {
      const address = this.$route.query.address;
      if (address === "single") {
        this.singleAddress(item);
      }
      if (address === "more") {
        this.moreAddress(item);
      }
      //申请售后的修改地址,屏蔽新增和修改功能
      if(address === 'sale'){
        this.aftersale(item);
      }
    },
    // 点击编辑地址
    editAddress(item) {
      // 跳转到编辑页面
      this.$router.push({
        name: "editAddress",
        params: { addressId: item.addressId }
      });
    },
    // 获取用户的所有地址
    getList() {
      getAddressList().then(res => {
        if (res.code == 200) {
          let data = res.data || [];
          this.addressData = data;
        }
      });
    },
    //申请售后时修改地址
    aftersale(item){
      this.$store.commit("common/setSaleadress", item);
      this.$router.go(-1);
    },
    // 单地址分配时选择单地址
    singleAddress(item) {
      this.choose = item;
      this.$store.commit("common/setSingle", item);
      this.$router.go(-1);
    },
    // 多地址分配商品时的选择地址,item表示当前地址
    moreAddress(item) {
      // 从仓库获取已分配多地址的商品信息
      let list = this.$store.state.common.assignAddress;
      // 当前点击添加多地址的商品
      let current = this.$store.state.common.currentGoods;
      if (!current) {
        Toast("请重新选择商品");
        return;
      }
      // 遍历商品信息列表找到添加的商品，如果地址不存在则添加
      if (!current.children) {
        current.children = [];
      }
      let isExit = false;
      current.children.map(sub => {
        if (sub.addressId === item.addressId) {
          Toast("该地址已经添加，请删除后再添加");
          isExit = true;
        }
      });
      if (!isExit) {
        item.quantity = 1; // 默认添加数量1
        current.children.push(item);
      }
      // 将该商品替换
      list.map(sub => {
        if (sub.skuId === current.skuId) {
          sub = current;
        }
      });
      this.$store.commit("common/setMutipleAddress", list);
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-address-addresslist {
  background: $lightColor;
  padding-top: 60px;
  // 单选的样式调整
  .van-radio__label {
    flex: 1;
  }
  .list_content {
    width: 100%;
    padding: 10px 15px 50px 15px;
    height: calc(100vh - 60px);
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: auto;
    margin-top: 60px;
    .address {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .user_phone {
        font-size: 14px;
        color: #484653;
        font-weight: bold;
        .divider {
          color: #707070;
          font-weight: normal;
          margin: 0 15px;
        }
      }
      .address_detail {
        color: #ccc;
        .default_tip {
          color: #fff;
          display: inline-block;
          padding: 0 5px;
          border-radius: 4px;
          background: #ff3a44;
          margin-right: 10px;
        }
      }
      .edit_icon {
        width: 17px;
        height: 17px;
      }
    }
    .add_btn {
      text-align: center;
      position: absolute;
      bottom: 30px;
      width: calc(100% - 30px);
      .van-button--primary {
        width: 100%;
        height: 35px;
      }
    }
  }
}
</style>

