<template>
  <div>
    <el-dialog title="Confirmação" :visible.sync="visible" width="500px">
      <listagem-erros :errors="errors"></listagem-erros>
      <el-row type="flex">
        <el-col>
          Deseja realmente remover o(a) Hóspede
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="font-weight-bold">
          {{nomeHospede}}?
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleConfirmar(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleConfirmar(true)" >Confirmar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import ListagemErros from "../../components/ListagemErros"


export default {
  name: "DialogoRemoverHospede",
  
  props : ['visible','config'],

  components:{
    ListagemErros
  },

  watch: {
    config:{
      deep: true,
      handler(){
        var hospede = this.config ? this.config.hospede : null
        this.nomeHospede = hospede ? hospede.pessoa.nome : ""
        this.hospedeId = hospede ? hospede.id : null
        this.hospedagemId = this.config ? this.config.hospedagemId : null
      }
    },
  },


  data: () =>({
    nomeHospede : "",
    hospedeId : null,
    hospedagemId : null,
    errors : [],
  }),

  methods: {
    handleConfirmar(ok){
      if (ok){
        this.doConfirmar()
      } else {
        this.reset()
        this.$emit('close',false)
      }
    },

    doConfirmar() {
      var dados = {
        hospedagemId : this.hospedagemId,
        hospedeId : this.hospedeId
      }

      petra.axiosPost("/app/hospedagem/remover_hospede", dados, false)
        .then(response => {
          this.reset()
          this.$emit('close',true)
          petra.showMessageSuccess('Hóspede removido com sucesso')
        }).catch(error => {
          this.errors = petra.tratarErros(error);
        })
      
    },

    reset(){
      this.errors=[]
    }
  }  
};
</script>
