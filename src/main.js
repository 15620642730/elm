// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Goods from './components/goods/goods'
import Ratings from './components/ratings/ratings'
import Seller from './components/seller/seller'


// import axios from 'axios' // 本地JSON
// import VueAxios from 'vue-axios' // 本地JSON
// Vue.use(VueAxios, axios)

// import Axios from 'axios'
// import qs from 'qs'
// Vue.prototype.$axios = Axios

// import axios from 'axios'
// Vue.prototype.$http=axios

import 'common/stylus/index.styl'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.config.productionTip = false

const router = new VueRouter({
  linkActiveClass:'active',

  routes:[

    {
      path:"/goods",
      component:Goods
    },
    {
      path:"/ratings",
      component:Ratings
    },
    {
      path:"/seller",
      component:Seller
    },
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
