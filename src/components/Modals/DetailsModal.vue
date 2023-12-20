<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="30%"
    >
      <div class="tw-flex tw-flex-col tw-gap-3">
        <span
          v-for="(value, name) in details"
          :key="name"
          class="tw-block tw-border-b tw-border-gray-200 tw-py-1 tw-flex tw-items-center tw-gap-1"
        >
          <span class="tw-text-gray-600 tw-capitalize tw-break-all"
            >{{ name.split("_").join(" ") }}:</span
          >
          <span class="tw-text-dark tw-flex tw-items-center tw-font-semibold tw-break-all">
            {{ value }}
            <span v-if="name === 'email'">
              <i-icon
                :class="
                  isUserVerified === 'yes'
                    ? 'tw-text-green-600'
                    : 'tw-text-red-600'
                "
                :icon="
                  isUserVerified === 'yes'
                    ? 'solar:verified-check-bold'
                    : 'ic:round-cancel'
                "
                class="tw-text-lg"
              />
            </span>
          </span>
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
    isUserVerified: {
      type: String,
      default: "",
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
