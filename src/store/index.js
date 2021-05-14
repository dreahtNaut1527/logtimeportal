import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logtimeuserinfo: {},
    isLoggedIn: false,
    isConnect: true,
    appVersion: null,
    serverDateTime: ''
  },
  plugins: [
    createPersistedState() 
  ],
  mutations: {
    CHANGE_USER_INFO: (state, data) => {
      state.logtimeuserinfo = data
    },
    CHANGE_USER_LOGGING: (state, data) => {
      state.isLoggedIn = data
    },
    CHANGE_CONNECTION: (state, data) => {
      state.isConnect = data
    },
    CHANGE_APP_VERSION: (state, data) => {
      state.appVersion = data
    },
    CHANGE_SERVERDATETTIME: (state, data) => {
      state.serverDateTime = data
    }
  },
  actions: {

  },
  modules: {

  }
})
