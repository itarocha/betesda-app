<template>
  <div>
    <el-dialog title="Detalhes da Pessoa" :visible.sync="visible" width="800px">
      <el-row type="flex">
        <el-col>
          <frame-pessoa :id="id" :canSelecionar="false" @cancel="onCancel" @save="onSave"></frame-pessoa>      
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>

import ListagemErros from "../../components/ListagemErros"
import FramePessoa from "./FramePessoa"


export default {
  name: "DialogoPessoa",
  
  props : ['visible','id'],

  components:{
    ListagemErros,
    FramePessoa
  },

  data: () =>({
    
    errors : [],
  }),

  methods: {
    onSave(){
      this.$emit('close',true)
    },

    onCancel(){
      this.$emit('close',false)
    },

    reset(){
      this.errors=[]
    }
  }  
};
</script>
