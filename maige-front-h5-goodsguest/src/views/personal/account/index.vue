<template>
  <div class="v-personal-account">
    <navbar :showLeft="false">
      <template v-slot:left>
        <span @click="$router.push({path:'/home'})" class="back">
          <van-icon name="arrow-left" />返回
        </span>
      </template>
    </navbar>
    <div class="avantar">
      <img src="~assets/images/account/default_avantar.png" />
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import navbar from "components/navbar/nav";
export default {
  name: "order_index",
  components: { navbar },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "@/assets/css/local.scss";
.v-personal-account {
  height: 100%;
  background-color: $lightColor;
  // padding-top: 60px;
  .back {
    display: flex;
    align-items: center;
    color: #fff;
    .van-icon-arrow-left {
      font-size: 26px;
    }
  }
  .avantar {
    background: url("~assets/images/account/bg@2x.png");
    background-size: 100% 100%;
    width: 100%;
    height: 128px;
    text-align: center;
    img {
      margin-top: 12px;
      width: 64px;
    }
  }
  .content {
    position: relative;
    top: -42px;
    width: 358px;
    box-sizing: border-box;
    margin: auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    padding: 42px 20px;
  }
}
</style>