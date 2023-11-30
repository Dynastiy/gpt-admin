<template>
  <div class="tw-bg-white tw-p-6">
    <h4 class="tw-font-bold tw-mb-6">{{ header }}</h4>
    <table-component
      :items="items"
      :fields="fields"
      :busy="busy"
      @approve="updateTxnStatus($event, 'approve')"
      @decline="updateTxnStatus($event, 'decline')"
      @view="viewTxn"
      :disableEditAction="true"
      :disableDeleteAction="true"
      :disableViewAction="true"
      :currentPage="currentPage"
      :totalRows="totalRows"
      :perPage="perPage"
      :pages="pages"
    >
    </table-component>
    <div class="tw-flex tw-justify-between tw-mt-3">
      <button v-if="page > 1" class="gpt-btn gpt-primary" @click="changePage('prev')">
        previous {{ +page - 1 }}
      </button>
      <div class="tw-self-end">
        <button class="gpt-btn gpt-primary" @click="changePage('next')">
          next {{ +page + 1 }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "@/components/TableComponent.vue";
export default {
  components: { TableComponent },
  data() {
    return {
      // items: [],
      fields: [
        {
          key: "transaction_id",
          label: "#",
          // formatter: (val) => {
          //   let result = val.slice(0, 5);
          //   return `#${result}`;
          // },
        },

        {
          key: "amount_formatted",
          label: "Amount",
          // formatter: (item) => {
          //   return item ? Number(item).toLocaleString() : "0";
          // },
        },

        {
          key: "date_time",
          label: "Date",
          // formatter: (item) => {
          //   return item
          //     ? Number(item).toLocaleString("en-US", {
          //         style: "currency",
          //         currency: "NGN",
          //       })
          //     : "NGN 0.00";
          // },
        },

        {
          key: "transaction_type",
          label: "Transaction Type",
        },

        // { key: "actions", label: "" },
      ],
      totalRows: null,
      currentPage: null,
      perPage: null,
      showFrom: null,
      showTo: null,
      totalRecords: null,
      pages: null,
      page: 1
    };
  },

  methods: {
    viewTxn(e) {
      this.$router.push(`/transaction/${e.transaction_id}`);
    },

    getTransactions() {
      this.$store.dispatch("user/list", {page: this.page, txn_type: this.txn_type});
    },

    updateTxnStatus(e, value) {
      let payload = {
        action: value,
        id: e.transaction_id,
        page: this.page,
        txn_type: this.txn_type
      };
      this.$store.dispatch("user/updateStatus",  payload );
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
  },

  computed: {
    items() {
      let transactions = this.$store.getters["user/getTransactions"];
      return transactions;
    },

    busy(){
      return this.$store.getters["user/getLoading"]
    },

    txn_type(){
      return this.$route.meta.filter
    },

    header(){
      return this.$route.meta.header
    }
  },
};
</script>

<style></style>
