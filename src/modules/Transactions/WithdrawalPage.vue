<template>
  <div class="tw-bg-white tw-p-6">
    <h4 class="tw-font-bold tw-mb-6">Withdrawal Requests</h4>
    <div class="tw-w-full tw-flex tw-justify-end">
      <filter-params
        @filterByStatus="filterByStatus($event)"
        @filterByOrder="filterByOrder($event)"
        @filterByPerPage="filterByPerPage($event)"
      />
    </div>
    <table-component
      :items="items"
      :fields="fields"
      :busy="busy"
      :dropdownItem="['approve', 'decline']"
      @approve="updateTxnStatus($event, 'approve')"
      @decline="updateTxnStatus($event, 'decline')"
      @viewTxn="viewTxn"
      @viewUser="viewUser"
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
    />
  </div>
</template>

<script>
import TableComponent from "@/components/TableComponent.vue";
import FilterParams from "@/components/Modals/FilterParams.vue";
import DetailsModal from "@/components/Modals/DetailsModal.vue";
// import FilterTabs from "@/components/Utils/FilterTabs.vue";
export default {
  components: { TableComponent, FilterParams, DetailsModal },
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

        {
          key: "status",
          label: "Status",
        },

        // { key: "actions", label: "Actions" },

        { key: "dots", label: "Actions" },
      ],
      per_page: 10,
      page: 1,
      status: "admin_pending",
      order: "ASC",
      modal: false,
      title: "",
      displayKey: null,
      metaData: null,
    };
  },

  methods: {
    filterByStatus(e) {
      this.status = e;
      this.getTransactions();
    },

    filterByOrder(e) {
      this.order = e;
      this.getTransactions();
    },

    filterByPerPage(e) {
      this.per_page = e;
      this.getTransactions();
    },

    getTransactions() {
      this.$store.dispatch("user/list", {
        page: this.page,
        txn_type: this.status === "" ? this.txn_type : this.status,
        meta_key:
          this.status === ""
            ? "transaction_type_category"
            : "transaction_approval_status",
        order: this.order,
        per_page: this.per_page,
      });
    },

    updateTxnStatus(e, value) {
      let payload = {
        action: value,
        id: e.transaction_id,
        page: this.page,
        txn_type: this.status === "" ? this.txn_type : this.status,
        meta_key:
          this.status === ""
            ? "transaction_type_category"
            : "transaction_approval_status",
        order: this.order,
        per_page: this.per_page,
      };
      this.$store.dispatch("user/updateStatus", payload);
    },

    changePage(value) {
      if (value === "prev") {
        this.page--;
      } else {
        this.page++;
      }
    },

    viewUser(e) {
      this.title = "User Data";
      this.metaData = {
        full_name:
          e.transaction_owner_user_metas.first_name +
          " " +
          e.transaction_owner_user_metas.last_name,
        email: e.transaction_owner_user_metas._user_email,
        user_id: e.transaction_owner_user_metas._user_id,
        username: e.transaction_owner_user_metas._username,
        wallet_address:
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
        "wallet_address",
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
      this.metaData = {
        balance_before: e.metas.balance_before,
        balance_after: e.metas.balance_after,
        transaction_approval_status: e.metas.transaction_approval_status,
        transaction_hash: e.metas.transaction_hash,
      };
      this.displayKey = [
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
  },
};
</script>

<style></style>
