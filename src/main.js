import Vue from 'vue'
import axios from 'axios'
import md5 from 'md5'
import swal from 'sweetalert2'
import moment from 'moment'
// import socketio from 'socket.io-client'
// import VueSocketIO from 'vue-socket.io'
import VueMask from 'v-mask'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import mixins from './plugins/mixins';

// const url = process.env.VUE_APP_SERVER

// export const SocketInstance = socketio(url)

// Vue Config
Vue.config.productionTip = false

// Vue Prototype
Vue.prototype.axios = axios
Vue.prototype.md5 = md5
Vue.prototype.swal = swal
Vue.prototype.moment = moment


// Vue Use
Vue.use(mixins)
Vue.use(VueMask)
// Vue.use(new VueSocketIO({
//   debug: false,
//   connection: SocketInstance
// }))

new Vue({
  router,
  store,
  vuetify,
  // sockets: {
  //   connect() {

  //   },
  //   disconnect() {

  //   }
  // },
  render: h => h(App)
}).$mount('#app')
