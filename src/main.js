// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueLogger from 'vuejs-logger';
import * as Keycloak from 'keycloak-js'
import router from './router'
global.router = router

import ElementUI from 'element-ui';

//import { library } from '@fortawesome/fontawesome-svg-core'
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

const logOptions = {
  isEnabled: true,
  logLevel : Vue.config.productionTip  ? 'error' : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
};
Vue.use(VueLogger, logOptions);


/* eslint-disable no-new */
let initOptions = {
  url: 'http://localhost:8200/auth',
  realm: 'quarkus-quickstart',
  clientId: 'quarkus-front',
  onLoad: 'login-required',
  promiseType: 'native'
}

let keycloak = Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad }).success((auth) =>{
    
  if(!auth) {
    window.location.reload();
  } else {
    Vue.$log.info("Authenticated");
  }

  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  });

  localStorage.setItem("token", keycloak.token);
  localStorage.setItem("refresh-token", keycloak.refreshToken);
  localStorage.setItem("keycloak", keycloak)

  setTimeout(() =>{
    keycloak.updateToken(70).success((refreshed)=>{
      if (refreshed) {
        Vue.$log.debug('Token refreshed'+ refreshed);
      } else {
        Vue.$log.warn('Token not refreshed, valid for '
        + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      }
    }).error(()=>{
        Vue.$log.error('Failed to refresh token');
    });


  }, 1000)

}).error((e) =>{
  console.log(e);
  Vue.$log.error("Authenticated Failed");
});