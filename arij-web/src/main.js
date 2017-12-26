// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import moment from 'moment'

import Notifications from 'vue-bs-notify'
import Icon from 'vue-awesome/components/Icon'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'vue-awesome/icons'

Vue.use(VueResource)
Vue.use(Notifications)

Vue.component('icon', Icon)

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm')
  }
})

Vue.filter('fromNow', function (value) {
  if (value) {
    return moment(String(value)).startOf('hour').fromNow()
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
