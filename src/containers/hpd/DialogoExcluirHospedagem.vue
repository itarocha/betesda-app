<template>
  <div>
    <el-dialog title="Confirmação de Exclusão" :visible.sync="visible" width="500px">
      <listagem-erros :errors="errors"></listagem-erros>
      <span>Deseja realmente excluir esta Hospedagem?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleConfirmar(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleConfirmar(true)">Confirmar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import ListagemErros from "../../components/ListagemErros"

export default {
  name: "DialogoExcluirHospedagem",
  
  props : ['visible','hospedagemId'],

  components:{
    ListagemErros
  },

  data: () =>({
    form : {
      data : null
    },
    
    errors : [],
  }),

  methods: {
    handleConfirmar(ok){
      if (ok){
        this.$emit('close',true)
        //this.doConfirmar(this.hospedagemId)
      } else {
        this.reset()
        this.$emit('close',false)
      }
    },

    /*
    doConfirmar(hospedagemId) {

      petra.axiosDelete("/app/hospedagem/"+this.hospedagemId, false)
        .then(response => {
          this.reset()
          this.$emit('close',true)
          petra.showMessageSuccess('Hóspedagem excluíuda com sucesso')
        }).catch(error => {
          this.errors = petra.tratarErros(error);
        })
    },
    */

    reset(){
      this.errors=[]
      this.form.data = null
    }
  }  
};
</script>
