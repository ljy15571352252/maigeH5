<template>
  <div class="v-personal-Settings-information">
    <navbar
      :title="'个人信息'"
      defaultColor="linear-gradient(45deg, rgba(255, 58, 67, 1) 0%, rgba(255, 49, 98, 1) 100%)"
      color="#fff"
    ></navbar>
    <van-cell is-link center title="头像" style="padding: 25px 16px;" @click="uploadimg">
      <template slot="title">
        <div class="avatars">
          头像
          <img :src="userData.headImgUrl" alt />
        </div>
      </template>
    </van-cell>
    <van-cell title="昵称" is-link :value="userData.userName" @click="ediotName" />
    <van-cell title="账号" :value="userData.userAccount" />
    <van-cell title="性别" @click="gendershow = true" :value="userData.sex==1?'男':'女'" />
    <van-cell title="出生日期" @click="timeshow = true" :value="showTime" />
    <!-- 选择性别 -->
    <van-popup v-model="gendershow" round>
      <div class="gender">
        <div class="tip">性别</div>
        <van-radio-group v-model="userData.sex" @change="choose">
          <van-radio :name="1">
            男
            <img slot="icon" slot-scope="props" :src="props.checked ? activeIcon : inactiveIcon" />
          </van-radio>
          <van-radio :name="2">
            女
            <img slot="icon" slot-scope="props" :src="props.checked ? activeIcon : inactiveIcon" />
          </van-radio>
        </van-radio-group>
      </div>
    </van-popup>

    <!-- 日期选择器 -->
    <div style="position: absolute;width: 100%;bottom: 0;">
      <van-datetime-picker
        v-if="timeshow"
        v-model="currentDate"
        :max-date="birthday"
        @confirm="tiemrchange"
        type="date"
        @cancel="timeshow = false"
      />
    </div>

    <van-popup v-model="picture" position="bottom" :style="{ height: '115px' }">
      <div class="localload">
        <van-uploader :before-read="loadimg">
          <span class="size">本地上传</span>
        </van-uploader>
      </div>
      <div class="localload cancel" @click="cancelLoad">取消</div>
    </van-popup>
  </div>
</template>

<script>
// 引入nav栏
import navbar from "@/components/navbar/nav";
import { myStorage } from "@/utils/cache.js";
// 接口
import { uploadFile, useredit, usercurrent } from "@/configs/interface.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      gendershow: false, //选择性别弹窗
      picture: false, //控制图片弹窗
      //用户信息
      userData: "",
      activeIcon: require("@/assets/images/personal/inactiveIcon.png"),
      inactiveIcon: require("@/assets/images/personal/activeIcon.png"),
      //时间
      currentDate: "",
      //控制时间组件
      timeshow: false,
      //展示选定时间
      showTime: "",
      birthday: new Date()
    };
  },
  methods: {
    //选择性别
    choose(val) {
      const obj = {};
      obj.sex = this.userData.sex;
      this.gendershow = false;
      this.useredit(obj);
    },
    //点击用户昵称
    ediotName() {
      this.$router.push({
        path: "/personal/Settings/information/username"
      });
    },
    //上传图片
    loadimg(val) {
      let param = new FormData();
      param.append("file", val);
      this.$http({
        method: "POST",
        url: uploadFile,
        headers: { "Content-Type": "multipart/form-data" },
        data: param
      }).then(res => {
        if (res.code == 200) {
          const obj = {};
          obj.headImgUrl = res.data.domain + res.data.filePath;
          this.userData.headImgUrl = res.data.domain + res.data.filePath;
          this.useredit(obj);
        }
      });
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
        }
      });
    },
    //取消上传
    cancelLoad() {
      this.picture = false;
    },
    //上传图片
    uploadimg() {
      this.picture = true;
    },
    //选择时间完成
    tiemrchange(val) {
      this.showTime = this.timeFormat(val);
      const obj = {};
      obj.birthday = this.showTime + " 00:00:00";
      this.useredit(obj);
      this.timeshow = false;
    },
    //格式化日期
    timeFormat(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return year + "-" + month + "-" + day;
    }
  },
  components: {
    navbar
  },
  mounted() {
    const data = myStorage.get("userData");
    if (data) {
      this.userData = data;
      if (data.birthday) {
        this.showTime = data.birthday.slice(0, 10);
      }
    }
  }
};
</script>

<style  lang="scss">
@import "@/assets/css/local.scss";
.v-personal-Settings-information {
  background: $lightColor;
  height: 100%;
  padding-top: 60px;
  .avatars {
    display: flex;
    div {
      word-break: keep-all;
    }
    img {
      border-radius: 50%;
      width: 45px;
      height: 45px;
      position: absolute;
      right: 36px;
      top: 14px;
    }
    .custom-title {
      margin-left: 10px;
    }
  }
  .van-cell {
    padding: 13px 16px;
  }
  .line {
    margin-top: 10px;
  }
  .gender {
    width: 280px;
    height: 150px;
  }
  .van-popup--center.van-popup--round {
    border-radius: 10px;
  }
  .gender {
    .tip {
      font-size: 16px;
      color: #333333;
      display: flex;
      justify-content: center;
      margin-top: 17px;
    }
    img {
      width: 15px;
      height: 15px;
      position: absolute;
      right: 15px;
    }
  }
  .van-radio {
    position: relative;
    font-size: 14px;
    margin-left: 15px;
    margin-top: 30px;
  }
  .van-popup--bottom {
    background-color: rgba(0, 0, 0, 0);
    padding: 0 10px;
    .localload {
      background: white;
      border-radius: 10px;
      height: 50px;
      font-size: 15px;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: center;
      .van-uploader {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        .size {
          font-size: 15px !important;
        }
      }
    }
    .cancel {
      margin-top: 7px;
    }
  }
}
</style>