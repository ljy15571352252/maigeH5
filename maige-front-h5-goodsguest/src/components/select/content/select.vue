<template>
  <div class="c-select">
    <!-- <van-field
      readonly
      clickable
      :value="current.label"
      :placeholder="placeholder"
      @click="showPicker = true"
      :right-icon="showPicker ? 'arrow-up' : 'arrow-down'"
    />-->
    <van-field
      readonly
      clickable
      :value="current.label"
      :placeholder="placeholder"
      @click="showPicker = true"
    />
    <van-popup v-model="showPicker" @open="openModal" position="bottom">
      <van-picker
        show-toolbar
        :columns="list"
        :value-key="labelText"
        :default-index="current.index"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
/**
 * 移动端的select选择器
 */
export default {
  name: "commonselect",
  data() {
    return {
      // 当前选择的地址编号
      addressValue: "",
      // 是否展示弹出层
      showPicker: false,
      // 渲染列表数组
      list: []
    };
  },
  props: {
    // 输入的地址编号 v-model=""
    value: {
      default: ""
    },
    // 列表的数据
    columns: {
      default: []
    },
    // 地址的名字
    label: {
      default: ""
    },
    // 地址的名字变量代表的字符串，默认为label
    labelText: {
      default: "label"
    },
    // 地址的id值代表的字符串，默认为value
    valueText: {
      default: "value"
    },
    // 占位字符
    placeholder: {
      default: ""
    }
  },
  components: {},
  watch: {
    // 监听传过来的value值, 赋值给addressValue
    value: {
      handler(newValue) {
        this.addressValue = newValue;
      }
    },
    // 监听传过来的columns数组
    columns: {
      handler(newValue) {
        this.list = JSON.parse(JSON.stringify(newValue)) || [];
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 当前选中地址的信息（包括label，value，以及index序号）
    current() {
      let label = this.label;
      let value = "";
      let index = 0;
      this.list.map((item, num) => {
        if (this.addressValue === item[this.valueText]) {
          label = item[this.labelText];
          value = this.addressValue;
          index = num;
        }
      });
      return {
        label,
        value,
        index
      };
    }
  },
  methods: {
    // 点击确认按钮时选择的地址
    onConfirm(item) {
      this.addressValue = item[this.valueText];
      this.showPicker = false;
      this.$emit("change", item);
    },
    // 点击弹出层触发
    openModal() {
      this.$emit("open", null);
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/local.scss";
</style>