<template>
  <div>
    <div class="tw-flex tw-flex-col tw-gap-6">
      <!-- <div>
        {{ user }}
      </div> -->
      <div class="tw-bg-white tw-p-8 tw-rounded-lg">
        <h4 class="tw-font-bold tw-mb-5">Swap Settings</h4>
        <div class="tw-flex tw-flex-col tw-gap-4">
          <div>
            <label for="" class="tw-text-sm tw-font-medium tw-text-gray-500"
              >Currency From:</label
            >
            <select name="" v-model="selected" id="" class="tw-py-2 tw-text-[14px]">
              <option value="" selected disabled>
                --Select Currency from--
              </option>
              <option
                :value="item"
                v-for="(item, idx) in filteredCurrenciesFrom"
                :key="idx"
              >
                {{ item.wallet_name }}
              </option>
            </select>
          </div>

          <div>
            <label for="" class="tw-text-sm tw-font-medium tw-text-gray-500"
              >Currency To:</label
            >
            <select
              v-model="selected2"
              name=""
              id=""
              class="tw-py-2 tw-text-[14px]"
              @change="swapRate"
            >
              <option value="" selected disabled>--Select Currency to--</option>
              <option
                :value="item"
                v-for="(item, idx) in filteredWallets"
                :key="idx"
              >
                {{ item.wallet_name }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <div v-if="loading" class="tw-bg-white tw-p-8 tw-rounded-lg">
          <i-icon icon="eos-icons:bubble-loading" class="tw-text-3xl" />
        </div>
        <div v-else>
          <div
            v-if="Object.keys(rate).length > 0"
            class="tw-bg-white tw-p-8 tw-rounded-lg"
          >
            <h6
              class="tw-font-semibold tw-bg-primary tw-text-white tw-p-3 tw-rounded-md tw-mb-2"
            >
              Rate Details
            </h6>
            <div class="tw-flex tw-flex-col tw-gap-3">
              <span v-for="(name, value) in swapValues" :key="name">
                <span class="tw-capitalize tw-text-gray-500"
                  >{{ value.split("_").join(" ") }}:
                </span>
                <span class="tw-font-semibold">{{ name }}</span>
              </span>
            </div>
            <div class="mt-3">
              <button class="gpt-btn gpt-primary" @click="getData">
                Update Rate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal to update Swap Settings  -->
    <div>
      <el-dialog title="Update Rate" :visible.sync="dialogVisible" width="30%">
        <div>
          <validation-observer v-slot="{ invalid, handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)">
              <span
                v-if="error"
                class="tw-mb-5 tw-block tw-text-xs tw-text-red-600"
                >{{ error }}</span
              >
              <div>
                <validation-provider
                  name="rate"
                  rules="required"
                  v-slot="{ dirty, invalid, errors }"
                >
                  <label for="rate">Rate</label>
                  <input
                    :class="{
                      'tw-text-red-600': dirty && invalid,
                    }"
                    type="text"
                    name="text"
                    id="rate"
                    v-model="dataObj.rate"
                    placeholder="rate"
                    class="tw-p-2"
                  />
                  <span class="tw-text-xs tw-text-red-600" v-if="errors">{{
                    errors[0]
                  }}</span>
                </validation-provider>
              </div>

              <div class="my-3">
                <validation-provider
                  name="Maximum Quantity to Swap"
                  v-slot="{ dirty, invalid, errors }"
                >
                  <label for="mxn">Quantity to Add</label>
                  <input
                    :class="{
                      'tw-text-red-600': dirty && invalid,
                    }"
                    type="text"
                    name="text"
                    id="mxn"
                    v-model="dataObj.maximum_quantity_to_swap"
                    placeholder="Add quantity to swap"
                    class="tw-p-2"
                  />
                  <span class="tw-text-xs tw-text-red-600" v-if="errors">{{
                    errors[0]
                  }}</span>
                </validation-provider>
              </div>

              <div class="tw-mt-4">
                <button
                  class="gpt-btn gpt-primary w-100"
                  v-bind:disabled="invalid"
                  :class="{ 'tw-bg-gray-400': invalid || busy }"
                >
                  <span>Update</span>
                </button>
              </div>
            </form>
          </validation-observer>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { pick } from "lodash";
export default {
  data() {
    return {
      currencies: [
        {
          wallet_id: "szcb",
          wallet_name: "SZCB Main",
        },
        {
          wallet_id: "bnb",
          wallet_name: "BNB Main",
        },
        {
          wallet_id: "usdt",
          wallet_name: "USDT Main",
        },
        {
          wallet_id: "szcb_referral_bonus",
          wallet_name: "SZCB Referral Bonus",
        },
        {
          wallet_id: "usdt_referral_bonus",
          wallet_name: "USDT Referral Bonus",
        },
        {
          wallet_id: "bnb_referral_bonus",
          wallet_name: "BNB Referral Bonus",
        },
        {
          wallet_id: "usdt_staking_interest",
          wallet_name: "USDT Staking Interest",
        },
      ],
      selected: {},
      selected2: {},
      isSelected: false,
      isSelected2: false,
      filteredWallets: [],
      rate: {},
      displayKey: ["key", "current_rate", "remaining_quantity"],
      loading: false,
      dialogVisible: false,
      dataObj: {
        maximum_quantity_to_swap: "",
        rate: "",
      },
      requestId: "",
      error: null,
      busy: false,
    };
  },
  methods: {
    selectWallet(e) {
      this.selected = e;
      console.log(this.selected, "ommmo");
      this.isSelected = true;
      //   this.swapRate();
    },

    getData() {
      this.dialogVisible = !this.dialogVisible;
    },

    onSubmit() {
      var token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token}`
      }
      console.log(this.rate);
      let payload = {
        request_id: this.requestId,
        user_id: this.user.user_id,
        // maximum_quantity_to_swap: Number(this.dataObj.maximum_quantity_to_swap),
        swap_rate: Number(this.dataObj.rate),
        wallet_id_from: this.rate.wallet_id_from,
        wallet_id_to: this.rate.wallet_id_to,
        swap_quantity_to_add: Number(this.dataObj.maximum_quantity_to_swap),
        swap_minimum_quantity_per_request: 5,
        swap_maximum_quantity_per_request: 100,
        swap_user_id_to_debit_for_funding: 1,
      };
      this.busy = true;
      this.$axios
        .put(`https://middleware-rimplenet-general.samzugagpt.com/swap/rate-setting`, payload, { headers})
        .then((res) => {
          console.log(res.data, "hmmm");
          this.busy = false;
          this.dialogVisible = !this.dialogVisible;
          this.swapRate();
          // this.rate = res.data.data;
        })
        .catch((err) => {
          this.busy = false;
          console.log(err, "ommmo");
        });
    },

    swapRate() {
      this.loading = true;
      var token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token}`
      }
      this.$axios
        .get(
          `https://middleware-rimplenet-general.samzugagpt.com/swap/conversion-rate?wallet_id_from=${this.selected.wallet_id}&wallet_id_to=${this.selected2.wallet_id}&user_id=${this.user.user_id}`,
          { headers }
        )
        .then((res) => {
          console.log(res.data.data, "hmmm");
          this.loading = false;
          this.rate = res.data.data;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err, "ommmo");
        });
    },

    getBulkRates() {
      var token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token}`
      }
      this.$axios
        .get(
          `https://middleware-rimplenet-general.samzugagpt.com/swap/conversion-rate?wallet_id_from=${this.selected.wallet_id}&wallet_id_to=${this.selected2.wallet_id}&user_id=${this.user.user_id}`,
          { headers }
        )
        .then((res) => {
          console.log(res.data.data, "testing");
        })
        .catch((err) => {
          this.loading = false;
          console.log(err, "ommmo");
        });
    },
  },

  beforeMount() {
    this.getBulkRates();
    var result = Math.round(+new Date() / 1000);
    this.requestId = `${result}`;
  },

  watch: {
    selected: {
      handler(val) {
        if (val.wallet_id === "usdt") {
          var value = this.currencies.filter(
            (item) => item.wallet_id === "szcb"
          );
        } else if (val.wallet_id === "usdt_referral_bonus") {
          value = this.currencies.filter(
            (item) => item.wallet_id === "szcb" || item.wallet_id === "usdt"
          );
        } else if (val.wallet_id === "bnb") {
          value = this.currencies.filter((item) => item.wallet_id === "szcb");
        }
        else if (val.wallet_id === "bnb_referral_bonus") {
          value = this.currencies.filter((item) => item.wallet_id === "bnb" || item.wallet_id === "szcb");
        } 
        else if (val.wallet_id === "szcb_referral_bonus") {
          value = this.currencies.filter((item) => item.wallet_id === "szcb");
        } else if (val.wallet_id === "usdt_staking_interest") {
          value = this.currencies.filter(
            (item) => item.wallet_id === "szcb" || item.wallet_id === "usdt"
          );
        }
        this.filteredWallets = value;
        if (val.wallet_id === this.selected2.wallet_id) {
          this.selected2 = {};
          this.rate = {};
        } else if (Object.keys(this.selected2).length > 0) {
          this.swapRate();
        }
      },
    },

    rate: {
      handler(val) {
        this.dataObj = {
          rate: val.rate,
        };
      },
    },
  },

  computed: {
    swapValues() {
      let value = {
        key: this.rate.swap_rate_key,
        current_rate: this.rate.swap_rate,
        remaining_quantity: this.rate.swap_total_quantity_available,
      };
      return pick(value, this.displayKey);
    },

    filteredCurrenciesFrom() {
      var value = this.currencies.filter((item) => item.wallet_id !== "szcb");
      return value;
    },

    user(){
      return this.$store.getters['auth/getUser']
    }
  },
};
</script>

<style></style>
