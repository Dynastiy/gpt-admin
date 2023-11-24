<template>
  <div class="tw-bg-white tw-p-6">
    <h4 class="tw-font-semibold">All Transactions</h4>
    <table-component
      :items="items"
      :fields="fields"
      :busy="busy"
      :dropdownItem="['approve', 'decline']"
      @approve="updateTxnStatus($event, 'approve')"
      @decline="updateTxnStatus($event, 'decline')"
      @view="viewTxn"
      :disableEditAction="true"
      :disableDeleteAction="true"
      :currentPage="currentPage"
      :totalRows="totalRows"
      :perPage="perPage"
      :pages="pages"
    >
    </table-component>
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
          key: "amount_formatted_disp",
          label: "Amount",
          // formatter: (item) => {
          //   return item ? Number(item).toLocaleString() : "0";
          // },
        },

        {
          key: "post_date",
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
          key: "txn_type",
          label: "Transaction Type",
        },

        {
          key: "status",
          label: "Status",
        },
        
        { key: "actions", label: "" },
        { key: "dots", label: "" },
      ],
      busy: false,
      totalRows: null,
      currentPage: null,
      perPage: null,
      showFrom: null,
      showTo: null,
      totalRecords: null,
      pages: null,
    };
  },

  methods: {
    viewTxn(e) {
      this.$router.push(`/transaction/${e.transaction_id}`);
    },

    updateTxnStatus(e, value) {
      let payload = {
        actioon: value,
        id: e.transaction_id
      }
      this.$store.dispatch('user/updateStatus', payload)
    },

  },

  beforeMount() {
    this.$store.dispatch('user/list') 
  },

  computed: {
    items() {
      let transactions = this.$store.getters['user/getTransactions']
      return transactions
    }
  }
};
</script>

<style></style>
