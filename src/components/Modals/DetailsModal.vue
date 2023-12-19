<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="30%"
    >
      <div class="tw-flex tw-flex-col tw-gap-3">
        <span v-for="(value, name) in details" :key="name" class="tw-block tw-border-b tw-border-gray-200 tw-py-1">
          <span class="tw-text-gray-600 tw-capitalize">{{ name.split('_').join(' ') }}:</span>
          <span class="tw-text-dark tw-font-semibold"> {{ value }} </span>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pick } from "lodash";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: "Details",
    },
    displayKey: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      dialogVisible: false,
    };
  },

  methods: {
    handleClose() {
      this.$emit("toggleClose");
    },
  },

  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val;
      },
      immediate: true,
    },
  },

  computed: {
    details() {
      return pick(this.data, this.displayKey);
    },
  },
};
</script>

<style></style>
