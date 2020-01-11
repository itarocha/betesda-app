import Vue from 'vue';
import petraDateTime from '../petra-date-time';

Vue.filter('itaDateFilter', value =>{
    return petraDateTime.formatDate(value) || "---"
})