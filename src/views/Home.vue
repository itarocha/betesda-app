<template>
  <div>
    <el-row class="container" type="flex" justify="center" align="middle">
      <el-col>
        <img src="@/assets/cartaz.jpg" alt="Casa Betesda">
        <blockquote>
          A Casa Betesda é uma organização sem fins lucrativos que oferece hospedagem diária e gratuita a mulheres ou crianças em tratamento no HC de Uberlândia.
        </blockquote>

      </el-col>
    </el-row>
  </div>

</template>

<script>

export default {

  name: 'Home',

  mounted(){

    this.$store.dispatch('setAcao','')
      
  },

  data: {
  },

  methods: {
  }
}
</script>

<style scoped>


.container{
  text-align: center;
  height: 500px;
}

.el-col{
  padding-bottom:0px;
}


</style>
