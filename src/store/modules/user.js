/* eslint-disable no-undef */
// import Vue from "vue";
import $request from "@/https/axios";

// import toastify from "toastify-js";

const getDefaultState = () => {
  return {
    transactions: []
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    getTransactions: (state) => state.transactions,
  },

  mutations: {
    SET_TRANSACTIONS(state, payload) {
      state.transactions = payload;
    },

    async LOGOUT(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.clear();
    },

    RESET(state) {
      Object.keys(state).forEach((key) => {
        Object.assign(state[key], null);
      });
    },
  },
  actions: {
    // List Transactions
    list({ commit }) {
    $request.get('/transactions')
    .then((res)=> {
        console.log(res);
        commit('SET_TRANSACTIONS', res.data)
    })
    .catch((err)=>{
        console.log(err);
    })
    },

  },
};
