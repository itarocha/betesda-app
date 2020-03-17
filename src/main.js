// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import * as Keycloak from 'keycloak-js'
import router from './router'
global.router = router


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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

import ElementUI from 'element-ui';
Vue.use(ElementUI);

//import './filters/ItaDateFilter.js'

import * as filters from './filters/filtros'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import VueLogger from 'vuejs-logger';
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
  realm: 'casa-betesda',
  clientId: 'betesda-front',
  onLoad: 'login-required',
  promiseType: 'native'
}
let keycloak = Keycloak(initOptions);


const refreshTokenTimeout = () => {
  setTimeout(function () {
    console.log('chamando timeout '+new Date())

    keycloak.updateToken(5).success((refreshed)=>{
      if (refreshed) {
        console.log('Token refreshed: ', refreshed);
        //Vue.$log.debug('Token refreshed: '+ refreshed);

        localStorage.setItem("token", keycloak.token);
        localStorage.setItem("refresh-token", keycloak.refreshToken);

      } else {
        //Vue.$log.warn('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
        console.log('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      }
    }).error(()=>{
        Vue.$log.error('Failed to refresh token');
        window.location.reload();
    });

    refreshTokenTimeout();
  }, 60000);
}


import pluginKc from './plugins/pluginKc.js'
Vue.use(pluginKc, {keycloak: keycloak});

keycloak.init({ onLoad: initOptions.onLoad }).success((auth) =>{
    
  if(!auth) {
    //localStorage.clear()
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

  refreshTokenTimeout();

}).error((e) =>{
  console.log(e);
  Vue.$log.error("Authenticated Failed");
});