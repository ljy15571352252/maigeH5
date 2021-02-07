<template>
  <div class="v-personal-Settings-information-ediotname">
    <navbar
      :title="'修改昵称'"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    ></navbar>
    <van-cell-group>
      <van-field v-model="userName" placeholder="请输入昵称" required />
    </van-cell-group>
    <div class="tip">4-20个字符，可由中英文、数字、“_”、“-”组成</div>
    <div class="btn-div">
      <van-button type="default" size="large" class="btn" @click="submit">确定</van-button>
    </div>
  </div>
</template>

<script>
// 引入nav栏
import navbar from "@/components/navbar/nav";
import { uploadFile, useredit, usercurrent } from "@/configs/interface.js";
import { myStorage } from "@/utils/cache.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      userName: "" //昵称
    };
  },
  methods: {
    submit() {
      const obj = {};
      if (this.userName.length < 4) {
        Toast.fail("昵称长度不能小于四位");
        return false;
      }
      obj.userName = this.userName;
      this.useredit(obj);
    },
    //修改用户信息
    useredit(data) {
      const userData = myStorage.get("userData");
      data.userId = userData.userId;
      this.$http({
        method: "PUT",
        url: useredit,
        data: data
      }).then(res => {
        if (res.code == 200) {
          Toast.success(res.message);
          this.picture = false;
          this.userdata();
        }
      });
    },
    //获取用户信息
    userdata() {
      this.$http({
        method: "GET",
        url: usercurrent,
        data: {}
      }).then(res => {
        if (res.code == 200) {
          myStorage.set("userData", res.data);
          this.$router.go(-1);
        }
      });
    }
  },
  created() {
    const userData = myStorage.get("userData");
    this.userName = userData.userName;
  },
  components: {
    navbar
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-Settings-information-ediotname {
  background: #f5f8fc;
  height: 100%;
  padding-top: 60px;
  .tip {
    margin-top: 10px;
    margin-left: 15px;
    color: #999999;
  }
  .btn-div {
    padding: 0 10px;
    .btn {
      margin-top: 40px;
      background-color: rgb(255, 52, 89);
      color: white;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>