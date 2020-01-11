<template>
  <div>
    {{fmtDate}}
  </div>
</template>

<script>

import {mask} from 'vue-the-mask'

export default {
  name: "ItaDate",

  directives: {mask},

  props:['date'],

  computed: {
    fmtDate() {
      return petraDateTime.formatDate(this.date)  || '---'
    }
  },
};
</script>