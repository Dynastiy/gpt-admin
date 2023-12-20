<template>
  <div class="tw-bg-white tw-p-6">
    <h4 class="tw-font-bold tw-mb-6">{{ header }}</h4>

    <div class="tw-flex tw-w-full tw-gap-3 tw-justify-end tw-items-center">
      <div
        v-if="txn_type === 'staking_interest'"
        class="tw-flex tw-gap-3"
      >
        <span
          class="tw-text-xs tw-w-max tw-font-medium tw-block tw-px-3 tw-py-3 tw-rounded-md"
          :class="[
            item.key === staking_status
              ? 'tw-bg-primary tw-text-white'
              : 'tw-bg-gray-300',
          ]"
          role="button"
          @click="filterStaking(item.key)"
          v-for="(item, idx) in staking"
          :key="idx"
        >
          {{ item.label.split("_").join(" ") }}
        </span>
      </div>
      <div class="">
        <filter-params
          @filterByOrder="filterByOrder($event)"
          @filterByPerPage="filterByPerPage($event)"
          :approval_filter="false"
        />
      </div>
    </div>
    <table-component
      :items="items"
      :fields="fields"
      :busy="busy"
      @viewUser="viewUser"
      @viewTxn="viewTxn"
      :disableEditAction="true"
      :disableDeleteAction="true"
      :disableViewAction="true"
      :showBaseCount="false"
    >
    </table-component>

    <div class="tw-flex tw-justify-between tw-mt-3">
      <button
        v-if="page > 1"
        class="gpt-btn gpt-primary"
        @click="changePage('prev')"
      >
        previous {{ +page - 1 }}
      </button>
      <div class="tw-self-end">
        <button class="gpt-btn gpt-primary" @click="changePage('next')">
          next {{ +page + 1 }}
        </button>
      </div>
    </div>

    <!-- Modal to View Transaction and user Details  -->
    <details-modal
      :visible="modal"
      @toggleClose="toggleClose"
      :displayKey="displayKey"
      :data="metaData"
      :title="title"
      :isUserVerified="isUserVerified"
      :txnType="txnType"
    />
  </div>
</template>

<script>
import TableComponent from "@/components/TableComponent.vue";
import DetailsModal from "@/components/Modals/DetailsModal.vue";
import FilterParams from "@/components/Modals/FilterParams.vue";
export default {
  components: { TableComponent, DetailsModal, FilterParams },
  data() {
    return {
      // items: [],
      fields: [
        {
          key: "transaction_id",
          label: "#",
        },

        {
          key: "amountEdited",
          label: "Amount",
        },

        {
          key: "fullName",
          label: "User",
        },

        {
          key: "date_time",
          label: "Date",
        },

        // {
        //   key: "transaction_type",
        //   label: "Transaction Type",
        // },

        {
          key: "status_actions",
          label: "Status/Actions",
        },

        // {
        //   key: "transaction_type",
        //   label: "Transaction Type",
        // },
      ],
      staking: [
        {
          key: "staking_interest",
          label: "staking_interest",
        },
        {
          key: "staking_from_wallet",
          label: "staking_requests",
        },
        {
          key: "staking_to_wallet",
          label: "staking_locked",
        },
      ],
      // , "staking_requests", "staking_locked"],
      staking_status: "staking_interest",
      txn: "",
      per_page: 10,
      order: "DESC",
      page: 1,
      modal: false,
      title: "",
      displayKey: null,
      metaData: null,
      isUserVerified: "",
      txnType: ""
    };
  },

  methods: {
    getTransactions() {
      this.$store.dispatch("user/list", {
        meta_key: "transaction_type_category",
        page: this.page,
        txn_type: this.txn,
        per_page: this.per_page,
        order: this.order,
      });
    },

    filterByOrder(e) {
      this.order = e;
      this.getTransactions();
    },

    filterByPerPage(e) {
      this.per_page = e;
      this.getTransactions();
    },

    filterStaking(e) {
      this.staking_status = e;
      this.txn = this.staking_status;
      this.getTransactions();
    },

    viewUser(e) {
      this.title = "User Data";
      this.isUserVerified =
        e.transaction_owner_user_metas.nll_user_email_address_verified;
      this.metaData = {
        full_name:
          e.transaction_owner_user_metas.first_name +
          " " +
          e.transaction_owner_user_metas.last_name,
        email: e.transaction_owner_user_metas._user_email,
        user_id: e.transaction_owner_user_metas._user_id,
        username: e.transaction_owner_user_metas._username,
        user_deposit_address:
          e.transaction_owner_user_metas.eth_crypto_wallet_deposit_address,
        current_balance:
          e.transaction_owner_user_metas._current_user_balance_formatted,
        phone_number: e.transaction_owner_user_metas.phone_number,
        referred_by: e.transaction_owner_user_metas.rimplenet_referrer_sponsor,
        registered_as_community_member:
          e.transaction_owner_user_metas.registered_as_community_member,
      };
      this.displayKey = [
        "full_name",
        "email",
        "user_id",
        "username",
        "user_deposit_address",
        "current_balance",
        "phone_number",
        "referred_by",
        "registered_as_community_member",
      ];
      this.modal = true;
    },

    viewTxn(e) {
      this.title = "Transaction Data";
      console.log(e);
      this.txnType = e.transaction_type;
      this.metaData = {
        amount: e.amount_formatted,
        transaction_id: e.transaction_id,
        request_id: e.request_id,
        balance_before: e.metas.balance_before,
        balance_after: e.metas.balance_after,
        transaction_approval_status: e.metas.transaction_approval_status,
        transaction_hash: e.metas.transaction_hash,
      };
      this.displayKey = [
        "amount",
        "transaction_id",
        "request_id",
        "balance_before",
        "balance_after",
        "transaction_approval_status",
        "transaction_hash",
      ];
      this.modal = true;
    },

    toggleClose() {
      this.modal = false;
    },

    changePage(value) {
      if (value === "prev") {
        this.page--;
      } else {
        this.page++;
      }
    },
  },

  beforeMount() {
    this.getTransactions();
  },

  watch: {
    page(oldVal, newVal) {
      if (oldVal !== newVal) {
        this.getTransactions();
      }
    },

    txn_type: {
      handler(val) {
        console.log(val, "ommmo");
        if (val === "staking_interest") {
          this.txn = this.staking_status;
        } else {
          this.txn = val;
        }
      },
      immediate: true,
    },
  },

  computed: {
    items() {
      let transactions = this.$store.getters["user/getTransactions"];
      return transactions;
    },

    busy() {
      return this.$store.getters["user/getLoading"];
    },

    txn_type() {
      return this.$route.meta.filter;
    },

    header() {
      return this.$route.meta.header;
    },
  },
};
</script>

<style></style>
