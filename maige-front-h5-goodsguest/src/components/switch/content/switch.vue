<template>
  <div
    class="weui-switch"
    :style="{borderColor: isChecked ? openColor : closeColor, backgroundColor: isChecked ? openColor : closeColor, opacity: disabled ? '0.5' : '1'}"
    :value="value"
    @click="toggle"
  >
    <div :class="isChecked ? 'switch_btn switch_btn_open' : 'switch_btn'"></div>
    <div :class="isChecked ? 'text_open' : 'text_close'">{{isChecked ? leftText : rightText}}</div>
  </div>
</template>

<script>
export default {
  name: "commonswitch",
  props: {
    // 控制其打开或关闭，默认打开
    value: {
      type: Boolean,
      default: true
    },
    // 是否禁用 true禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 打开时的文本(在左边)
    leftText: {
      type: String,
      default: ""
    },
    // 关闭时的文本(在右边)
    rightText: {
      type: String,
      default: ""
    },
    // 打开时左边的颜色
    openColor: {
      type: String,
      default: "#ff3a44"
    },
    // 关闭时底色
    closeColor: {
      type: String,
      default: "#dfdfdf"
    }
  },
  data() {
    return {
      isChecked: this.value
    };
  },
  computed: {},
  watch: {
    // 简单数据类型监听新值并获取父组件的值
    value(val) {
      this.isChecked = val;
    }
  },
  methods: {
    toggle() {
      if (this.disabled) {
        return;
      }
      this.isChecked = !this.isChecked;
      this.$emit("change", this.isChecked);
    }
  }
};
</script>
<style>
/* 未打开时的样式 */

/* 盒子最外面 */
.weui-switch {
  display: block;
  position: relative;
  width: 52px;
  height: 24px;
  border: 1px solid #dfdfdf;
  outline: 0;
  border-radius: 16px;
  box-sizing: border-box;
  transition: background-color 0.1s, border 0.1s;
  transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  cursor: pointer;
}

/* 圆点按钮的起始样式 */
.switch_btn {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 22px;
  height: 22px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}

/* 文字的位置样式 */
.text_close {
  width: 100%;
  height: 100%;
  position: absolute;
  padding: 0 5px;
  right: 2px;
  line-height: 22px;
  color: #7a7a7a;
  text-align: right;
  user-select: none;
}

/* 打开时的样式 */

/* 盒子里的圆点 */
.switch_btn_open {
  transform: translateX(28px);
}

/* 文字的位置样式 */
.text_open {
  width: 100%;
  height: 100%;
  position: absolute;
  padding: 0 5px;
  line-height: 22px;
  color: #fff;
  user-select: none;
}
</style>