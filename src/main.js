// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
global.router = router

import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';

// https://origin.fontawesome.com/how-to-use/on-the-web/using-with/vuejs
/*
npm i --save @fortawesome/fontawesome-svg-core \
  npm i --save @fortawesome/free-solid-svg-icons \
  npm i --save @fortawesome/vue-fontawesome
*/

import { library } from '@fortawesome/fontawesome-svg-core'
//import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//library.add(faCoffee)

Vue.component('font-awesome-icon', FontAwesomeIcon)


import '@/assets/fontawesome-free-5.7.0-web/css/all.css'
import '@/assets/scss/style.scss'

import lang from 'element-ui/lib/locale/lang/pt-br'
import locale from 'element-ui/lib/locale'
locale.use(lang)


import store from './vuex/store'
global.store = store

import axios from 'axios'
global.axios = axios


import VueTheMask from 'vue-the-mask'

import petra from './petra'
global.petra = petra

import apiBetesda from './apiBetesda'
global.apiBetesda = apiBetesda

import petraDateTime from './petra-date-time'
global.petraDateTime = petraDateTime

import VueLodash from 'vue-lodash'

var moment = require('moment')
moment.locale('pt-br')
global.moment = moment


Vue.config.productionTip = false

Vue.use(ElementUI);

//import './filters/ItaDateFilter.js'

import * as filters from './filters/filtros'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
