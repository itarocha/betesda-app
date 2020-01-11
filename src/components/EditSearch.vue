<template>
  <div>

    <el-input placeholder="Entre com o texto para busca" v-model="searchValue" ref="edtLocalizar" :class="'input-with-select'">
      <el-select v-model="searchField" slot="prepend" style="width:200px;">
        <el-option v-for="item in itens" :key="item.value" :label="item.text" :value="item.value"></el-option>
      </el-select>
      <el-button slot="append" @click="handleSearch" icon="el-icon-search"></el-button>
    </el-input>

  </div>
</template>

<script>

export default {
  name: "EditSearch",
  
  props : ['itens'],
  /*
  Exemplo: 
  itens: [
    {text: "Nome", value: "nome", type: "text"},
    {text: "CPF", value: "cpf", type: "text"},
    {text: "RG", value: "rg", type: "text"},
    {text: "Cartão do SUS", value: "cartaoSus", type: "text"},
    {text: "Telefone", value: "telefone", type: "text"},
    {text: "Telefone2", value: "telefone2", type: "text"},
  ],
  */

  data: () =>({
    searchField : 'nome',

    searchValue : '',
  }),

  mounted(){
    setTimeout(() => this.$refs.edtLocalizar.focus(), 500)    
  },

  methods: {
    handleSearch(){
      this.$emit('search', this.searchField, this.searchValue)
    },
  }  
};
</script>

<style scoped>

</style>

