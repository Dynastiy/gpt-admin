import IndexViewVue from "@/modules/Home/IndexPage.vue";

import Orders from "@/modules/Orders/IndexPage.vue";
import OrderDetails from "@/modules/Orders/uuid/_uuid.vue";


const router = [
  {
    path: "/",
    name: "analytics",
    component: IndexViewVue,
    meta: {
      layout: "AppDashboardLayout",
      parent: "analytics",
      name: "home",
      requiresAuth: true
    },
  },

  {
    path: "/transactions",
    name: "transaction",
    component: Orders,
    meta: {
      layout: "AppDashboardLayout",
      parent: "transactions",
      name: "home",
      requiresAuth: true
    },
  },

  {
    path: "/transaction/:id",
    name: "transaction-details",
    component: OrderDetails,
    meta: {
      layout: "AppDashboardLayout",
      parent: "transactions",
      name: "home",
      requiresAuth: true
    },
  },

 
];

export default router;
