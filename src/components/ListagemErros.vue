<template>
  <div>
    <el-row type="flex" v-for="(item, i) in errors" :key="i">
      <el-col :span="24">
        <el-alert
          :title="item.errorMessage"
          type="error">
        </el-alert>
      </el-col>
    </el-row>    
  </div>
</template>

<script>

export default {
  name: "ListagemErros",

  props:['errors'],
  
};
</script>

<style scoped>
</style>

