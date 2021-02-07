<template>
  <div class="v-address-addoredit">
    <navbar
      :title="this.$route.params.addressId ? '编辑收货地址' : '添加收货地址'"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    >
      <template v-slot:right>
        <span @click="deleteAddress">删除</span>
      </template>
    </navbar>
    <div class="form_content">
      <div>
        <div>
          <van-field
            v-model="form.consignee"
            clearable
            :left-icon="require('assets/images/address/name.png')"
            placeholder="请输入联系人"
            maxlength="20"
          />
          <van-divider />
        </div>
        <div>
          <van-field
            v-model="form.phone"
            clearable
            :left-icon="require('assets/images/address/phone.png')"
            placeholder="请输入手机号"
            maxlength="11"
          />
          <van-divider />
        </div>
        <div>
          <div class="area_box">
            <img class="area_img" src="~assets/images/address/area.png" alt />
            <common-select
              class="area_item"
              v-model="form.province"
              :label="form.provinceName"
              valueText="regionId"
              labelText="regionName"
              :columns="provinceArr"
              placeholder="省"
              @change="provinceChange"
              @open="provinceOpen"
            />
            <common-select
              class="area_item"
              v-model="form.city"
              :label="form.cityName"
              :columns="cityArr"
              placeholder="市"
              valueText="regionId"
              labelText="regionName"
              @change="cityChange"
              @open="cityOPen"
            />
            <common-select
              class="area_item"
              v-model="form.district"
              :label="form.districtName"
              :columns="areaArr"
              valueText="regionId"
              labelText="regionName"
              placeholder="区"
              @change="areaChange"
              @open="areaOpen"
            />
            <common-select
              class="area_item"
              v-if="showTown"
              v-model="form.town"
              :label="form.townName"
              :columns="townArr"
              valueText="regionId"
              labelText="regionName"
              placeholder="镇/街道"
              @change="townChange"
              @open="townOpen"
            />
          </div>
          <van-divider />
        </div>
        <div>
          <van-field
            v-model="form.address"
            clearable
            :left-icon="require('assets/images/address/area_detail.png')"
            placeholder="请输入详细街道"
            maxlength="50"
          />
          <van-divider />
        </div>
        <div>
          <van-field
            v-model="form.zipcode"
            clearable
            :left-icon="require('assets/images/address/code.png')"
            placeholder="请输入邮编"
            maxlength="6"
          />
          <van-divider />
        </div>
        <div class="switch_box">
          <div>
            <div class="switch_desc">设为默认地址</div>
            <div class="switch_tip">提醒：每次默认推荐使用该地址</div>
          </div>
          <CommonSwitch v-model="form.def" @change="value => form.def = value" />
        </div>
        <van-divider />
      </div>
      <div class="save_btn">
        <van-button round size="small" type="primary" @click="submit">保存</van-button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 地址的新建/编辑
 */
// 头部nav栏
import navbar from "@/components/navbar/nav";
import { isMobile } from "@/configs/reg.js"; // 验证手机号正则
import { Toast } from "vant";
import {
  deleteAddress,
  addressInfo,
  casecadeInfo,
  updateAddress,
  saveAddress
} from "@/configs/interface.js";
export default {
  name: "addoredit",
  data() {
    return {
      // 当前地址信息
      form: {
        // 用户姓名
        consignee: "",
        // 用户手机号
        phone: "",
        // 省
        province: "",
        // 市
        city: "",
        // 区
        district: "",
        // 街道
        town: "",
        //详细街道字符串
        address: "",
        // 湘西街道字符串的名
        addressName: "",
        // 邮编
        zipcode: "",
        // 是否选择默认
        def: false
      },
      // 是否显示第四级的镇及街道
      showTown: true,
      // 省的区域列表
      provinceArr: [],
      // 市区列表
      cityArr: [],
      // 区列表
      areaArr: [],
      // 街道列表
      townArr: []
    };
  },
  props: {},
  created() {
    // 如果是编辑则查详情
    if (this.$route.params.addressId) {
      this.findinfobyid();
    }
  },
  components: {
    navbar
  },
  methods: {
    //获取地址信息
    findinfobyid() {
      this.$http({
        method: "get",
        url: addressInfo,
        data: {
          addressId: this.$route.params.addressId
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data || {};
          this.form = data;
          // 默认是否显示第四级
          if (this.form.town) {
            this.showTown = true;
          } else {
            this.showTown = false;
          }
        }
      });
    },
    //获取省市区地址
    getAddressList(val) {
      return this.$http({
        method: "GET",
        url: casecadeInfo,
        data: {
          parentId: val
        }
      });
    },
    // 省的变化事件 item为目标对象
    provinceChange(item) {
      this.form.province = item.regionId;
      this.form.provinceName = item.regionName;
      this.form.city = "";
      this.form.cityName = "";
      this.form.district = "";
      this.form.districtName = "";
      this.form.town = "";
      this.form.townName = "";
      if (!this.form.province) {
        Toast("请先选择省");
        return;
      }
      this.getAddressList(this.form.province).then(res => {
        let data = res.data || {};
        this.cityArr = data.list;
      });
    },
    provinceOpen() {
      this.getAddressList(1).then(res => {
        this.provinceArr = res.data.list;
      });
    },
    // 市的变化事件 item为目标对象
    cityChange(item) {
      this.form.city = item.regionId;
      this.form.cityName = item.regionName;
      this.form.district = "";
      this.form.districtName = "";
      this.form.town = "";
      this.form.townName = "";
      if (!this.form.city) {
        Toast("请先选择市");
        return;
      }
      this.getAddressList(this.form.city).then(res => {
        let data = res.data || {};
        this.areaArr = data.list;
      });
    },
    // 打开市弹窗初始化列表
    cityOPen() {
      if (!this.form.province) {
        Toast("请先选择省");
        return;
      }
      this.getAddressList(this.form.province).then(res => {
        let data = res.data || {};
        this.cityArr = data.list;
      });
    },
    // 区的变化事件 item为目标对象
    areaChange(item) {
      this.form.district = item.regionId;
      this.form.districtName = item.regionName;
      this.form.town = "";
      this.form.townName = "";
      if (!this.form.district) {
        Toast("请先选择区");
        return;
      }
      this.getAddressList(this.form.district).then(res => {
        let data = res.data || {};
        this.townArr = data.list;
        if (this.townArr.length === 0) {
          this.showTown = false;
        }
      });
    },
    // 打开区弹窗初始化列表
    areaOpen() {
      if (!this.form.city) {
        Toast("请先选择市");
        return;
      }
      this.getAddressList(this.form.city).then(res => {
        let data = res.data || {};
        this.areaArr = data.list;
      });
    },
    // 镇/街道的变化事件
    townChange(item) {
      this.form.town = item.regionId;
      this.form.townName = item.regionName;
    },
    // 打开镇/街道弹窗
    townOpen() {
      if (!this.form.district) {
        Toast("请先选择区");
        return;
      }
      this.getAddressList(this.form.district).then(res => {
        let data = res.data || {};
        this.townArr = data.list || [];
      });
    },
    submit() {
      if (!isMobile(this.form.phone)) {
        Toast("手机号格式不正确");
        return;
      }
      if (!this.form.province) {
        Toast("请选择省");
        return;
      }
      if (!this.form.city) {
        Toast("请选择市");
        return;
      }
      if (!this.form.district) {
        Toast("请选择区");
        return;
      }
      if (!this.form.address || !this.form.address.replace(/\s/g, "")) {
        Toast("请填写详情地址");
        return;
      }
      const addressId = this.$route.params.addressId;
      if (addressId) {
        this.ediotAdree();
      } else {
        this.saveResult();
      }
    },
    //修改地址
    ediotAdree() {
      const data = this.form;
      data.addressId = this.$route.params.addressId;
      this.$http({
        method: "PUT",
        url: updateAddress,
        data: data
      }).then(res => {
        if (res.code == 200) {
          this.$router.go(-1);
          // 更新仓库里的对应的单地址
          let singleAddress = this.$store.state.common.singleAddress;
          if (singleAddress.addressId === this.$route.params.addressId) {
            this.$store.commit("common/setSingle", data);
          }
          // 更新仓库里对应的多地址商品信息
          let list = this.$store.state.common.assignAddress || [];
          list.map(item => {
            item.children &&
              item.children.map((sub, num) => {
                if (sub.addressId === this.$route.params.addressId) {
                  item.children.splice(num, 1);
                  data.quantity = 1;
                  item.children.push(data);
                }
              });
          });
          this.$store.commit("common/setMutipleAddress", list);
          Toast("修改成功");
        }
      });
    },
    // 新增地址
    saveResult() {
      const data = this.form;
      data.addressName = data.address;
      this.$http({
        method: "POST",
        url: saveAddress,
        data: data
      }).then(res => {
        if (res.code == 200) {
          Toast("修改成功");
          this.$router.go(-1);
        }
      });
    },
    // 删除收货地址
    deleteAddress() {
      this.$http({
        method: "delete",
        url: deleteAddress,
        data: {
          addressId: this.$route.params.addressId
        }
      }).then(res => {
        if (res.code == 200) {
          Toast("删除成功");
          // 更新仓库里的对应的地址
          let singleAddress = this.$store.state.common.singleAddress;
          if (singleAddress.addressId === this.$route.params.addressId) {
            this.$store.commit("common/setSingle", "");
          }
          // 更新仓库里对应的多地址商品信息
          let list = this.$store.state.common.assignAddress || [];
          list.map(item => {
            item.children &&
              item.children.map((sub, num) => {
                if (sub.addressId === this.$route.params.addressId) {
                  item.children.splice(num, 1);
                }
              });
          });
          this.$store.commit("common/setMutipleAddress", list);
          this.$router.go(-1);
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
.v-address-addoredit {
  background: $lightColor;
  padding-top: 60px;
  .form_content {
    width: 100%;
    padding: 10px 10px 50px 10px;
    height: calc(100vh - 60px);
    background: #fff;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // 图标和占位字符的样式
    .van-cell {
      align-items: center;
      overflow: auto;
      // 左边图标的样式
      .van-field__left-icon {
        margin-right: 15px;
      }
      .van-icon__image,
      .van-image__img {
        width: 20px;
        height: 20px;
      }
      // 占位符的字体样式
      input::-webkit-input-placeholder {
        color: #c7c7c7;
        font-size: 12px;
      }
      input::-moz-placeholder {
        color: #c7c7c7;
        font-size: 12px;
      } /* firefox 19+ */
      input:-ms-input-placeholder {
        color: #c7c7c7;
        font-size: 12px;
      } /* Internet Explorer 10+ */
      input:-moz-placeholder {
        color: #c7c7c7;
        font-size: 12px;
      } /* firefox 14-18 */
    }
    .van-cell:not(:last-child)::after {
      border-bottom: 0;
    }
    // 联动选择地址的区域样式
    .area_box {
      display: flex;
      align-items: center;
      padding-left: 12px;
      .van-cell {
        padding: 0;
      }
      .area_img {
        width: 20px;
        height: 20px;
        margin-right: 18px;
      }
      .area_item {
        flex: 1;
      }
    }
    // 切换的样式
    .switch_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px;
      .switch_desc {
        font-size: 14px;
        color: #707070;
        font-weight: 400;
      }
      .switch_tip {
        color: #c7c7cc;
        font-size: 11px;
      }
    }
    .save_btn {
      text-align: center;
      position: fixed;
      bottom: 30px;
      width: calc(100% - 30px);
      text-align: center;
      .van-button--primary {
        width: 100%;
        height: 35px;
      }
    }
  }
}
</style>