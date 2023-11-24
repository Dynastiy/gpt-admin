<template>
  <div class="tw-bg-white tw-p-6">
    <h4 class="tw-font-semibold">All Transactions</h4>
    <table-component
      :items="items"
      :fields="fields"
      :busy="busy"
      :dropdownItem="['approve', 'decline']"
      @approve="updateStatus($event, 'completed')"
      @decline="updateStatus($event, 'canceled')"
      @view="viewOrder"
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
      items: [],
      fields: [
        {
          key: "id",
          label: "#",
          formatter: (val) => {
            let result = val.slice(0, 5);
            return `#${result}`;
          },
        },

        {
          key: "total_quantity",
          label: "Order Qty",
          formatter: (item) => {
            return item ? Number(item).toLocaleString() : "0";
          },
        },

        {
          key: "total_amount",
          label: "Total Amount",
          formatter: (item) => {
            return item
              ? Number(item).toLocaleString("en-US", {
                  style: "currency",
                  currency: "NGN",
                })
              : "NGN 0.00";
          },
        },

        {
          key: "user.username",
          label: "Customer",
        },

        {
          key: "item-status",
          label: "Status",
        },

        {
          key: "created_at",
          label: "Date",
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
    // list(page = 1) {
    //   this.busy = true;
    //   console.log(page, "kkk");
    //   this.$request.get(`admin/orders?page=` + page)
    //     .then((res) => {
    //       let resPayload = res.data;
    //       this.items = resPayload.data;
    //       this.totalRows = resPayload.total;
    //       this.showFrom = resPayload.from;
    //       this.showTo = resPayload.to;
    //       this.totalRecords = resPayload.total;
    //       this.currentPage = resPayload.current_page;
    //       this.perPage = resPayload.per_page;
    //       this.pages = resPayload.last_page
    //       console.log(res.data);
    //       this.busy = false;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       this.busy = false;
    //     });
    // },

    viewOrder(e) {
      this.$router.push(`/order/${e.id}`);
    },

    // updateStatus(e, value) {
    //   let payload = {
    //     status: value
    //   }
    //   this.$request.post(`admin/orders/update-status/${e.id}`, payload)
    //     .then((res) => {
    //       console.log(res);
    //       this.list()
    //       this.busy = false;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       this.busy = false;
    //     });
    //   console.log(e, value);
    // },

  },

  beforeMount() {
    // this.list();
  },
};
</script>

<style></style>
