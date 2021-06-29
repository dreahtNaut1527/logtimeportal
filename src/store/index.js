import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logtimeInfo: {
      userinfo: {},
      isLogtimeLoggedIn: false,
      isLogtimeConnect: true,
      appVersion: null,
      serverDateTime: ''
    }
  },
  plugins: [
    createPersistedState() 
  ],
  mutations: {
    CHANGE_USER_INFO: (state, data) => {
      state.logtimeInfo.userinfo = data
    },
    CHANGE_USER_LOGGING: (state, data) => {
      state.logtimeInfo.isLogtimeLoggedIn = data
    },
    CHANGE_CONNECTION: (state, data) => {
      state.logtimeInfo.isLogtimeConnect = data
    },
    CHANGE_APP_VERSION: (state, data) => {
      state.logtimeInfo.appVersion = data
    },
    CHANGE_SERVERDATETTIME: (state, data) => {
      state.logtimeInfo.serverDateTime = data
    }
  },
  actions: {

  },
  modules: {

  }
})
