/* eslint-disable no-undef */
// import Vue from "vue";
import $request from "@/https/axios";

import $middleware from "@/https/middleware";

import toastify from "toastify-js";

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

    // Change Status
    updateStatus({ dispatch }, payload) {
        $middleware.put(`/payments/${payload.txn_id}/${payload.action}`)
        .then((res)=> {
            console.log(res);
            toastify({
                text: `${res.data.message}`,
                className: "info",
                position: "center",
                style: {
                  background: "green",
                  fontSize: "12px",
                  borderRadius: "5px",
                },
              }).showToast();
            dispatch('list')
        })
        .catch((err)=>{
            console.log(err);
            toastify({
                text: `${err.data.message}`,
                className: "info",
                position: "center",
                style: {
                  background: "green",
                  fontSize: "12px",
                  borderRadius: "5px",
                },
              }).showToast();
        })
        },

  },
};
