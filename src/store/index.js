import Vue from 'vue'
import Vuex from 'vuex'
import createdPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    isRemember: false,
    isLoggedIn: false,
    isConnect: false
  },
  mutations: {
    CHANGE_USER_INFO: (state, data) => {
      state.userInfo = data
    },
    CHANGE_REMEMBER_USER: (state, data) => {
      state.isRemember = data
    },
    CHANGE_USER_LOGGING: (state, data) => {
      state.isLoggedIn = data
    },
    CHANGE_CONNECTION: (state, data) => {
      state.isConnect = data
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createdPersistedState()
  ]
})
