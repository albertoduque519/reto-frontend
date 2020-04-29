import Vue from 'vue'
import Vuex from 'vuex'

import { alert } from './alert.module'
import { authentication } from './authentication.module'
import { users } from './users.module'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    empresa: [],
    empresas: [],
    dataEmpresas: []
  },
  modules: {
    alert,
    authentication,
    users,
  },
  mutations: {
    setEmpresa(state, empresa) {
      state.empresa = empresa
    },
    loadClientes(state, clientes) {
      state.empresas = clientes
    },
    loadDataClientes(state, clientes) {
      state.dataEmpresas = clientes
    },
  },
})

Vue.prototype.$store = store
