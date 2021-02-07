<template>
  <div class="v-address-addresslist">
    <navbar
      title="我的收货地址"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    ></navbar>
    <div class="list_content">
      <van-radio-group v-model="choose" checked-color="#ff3a44">
        <div :key="item.addressId" v-for="(item) in addressData">
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
              class="edit_icon"
              src="~assets/images/address/edit.png"
              @click.stop="editAddress(item)"
            />
          </div>
          <!-- </van-radio> -->
          <van-divider />
        </div>
      </van-radio-group>
      <div class="add_btn">
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
      .van-button--primary {
        width: 100%;
        height: 35px;
      }
    }
  }
}
</style>

