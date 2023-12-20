<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="40%"
    >
      <div class="tw-flex tw-flex-col tw-gap-3">
        <span
          v-for="(value, name) in details"
          :key="name"
          class="tw-block tw-border-b tw-border-gray-200 tw-py-1 tw-flex tw-items-center tw-gap-1"
        >
          <h6
            class="tw-text-gray-600 tw-capitalize tw-break-all tw-text-wrap tw-text-xs tw-mb-0"
          >
            {{ name.split("_").join(" ") }}:
          </h6>
          <span
            class="tw-flex tw-items-center tw-font-semibold tw-break-all"
            :class="[
              name === 'amount'
                ? txnType === 'DEBIT'
                  ? 'tw-text-red-600'
                  : 'tw-text-green-600'
                : 'tw-text-dark',
            ]"
          >
            {{
              name === "amount" ? (txnType === "DEBIT" ? "-" + value : "+" + value) : value
            }}
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
    txnType: {
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
