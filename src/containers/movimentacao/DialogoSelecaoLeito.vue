<template>
  <div>
    <el-dialog title="Selecionar Leito" :visible.sync="visible" width="770px">
      <el-row type="flex">
        <el-col :span="18">
          <h4>{{nomeHospede}}</h4>
        </el-col>
        <el-col :span="6">
          <h4 v-if="acomodacao != null">Seleção: Quarto {{acomodacao.quarto.numero}} Leito {{acomodacao.leito.numero}}</h4>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :sm="24" :md="24" :lg="24">
          
          <tab-selecao-leito :config="configTabSelecaoLeito" @select="onSelect"></tab-selecao-leito>

        </el-col>
      </el-row>    

      <span slot="footer" class="dialog-footer">
        <el-button @click="doSelecionarLeito(false)">Cancelar</el-button>
        <el-button type="primary" :disabled="acomodacao == null" @click="doSelecionarLeito(true)">Confirmar</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import TabSelecaoLeito from "./TabSelecaoLeito"

export default {
  name: "DialogoSelecaoLeito",
  
  components: {
    TabSelecaoLeito
  },

  props : ['visible', 'config'],

  watch: {
    config:{
      deep: true,
      handler(){
        var hospede = this.config ? this.config.hospede : null
        this.nomeHospede = hospede ? hospede.pessoa.nome : ""

        var dataIni = this.config ? this.config.dataIni : null
        var dataFim = this.config ? this.config.dataFim : null

        var destinacaoHospedagemId = this.config ? this.config.destinacaoHospedagemId : null

        this.configTabSelecaoLeito = {
          destinacaoHospedagemId : destinacaoHospedagemId,
          dataIni : dataIni,
          dataFim : dataFim
        } 
      }
    }
  },

  data: () =>({

    configTabSelecaoLeito: {
      destinacaoHospedagemId : null,
      dataIni : null,
      dataFim : null
    }, 

    nomeHospede : "",

    acomodacao : null,

  }),

  created(){
    this.reset()
  },

  mounted(){

    this.configTabSelecaoLeito = {
      destinacaoHospedagemId : null,
      dataIni : null,
      dataFim : null
    } 

  },

  methods: {

    onSelect(acomodacao){
      this.acomodacao = acomodacao
    },

    doSelecionarLeito(ok){
      if (ok){
        this.$emit('onSelecionar', this.acomodacao)
        this.acomodacao = null
      } else {
        this.$emit('onSelecionar', null)
        this.acomodacao = null
      }
    },

    reset(){
      this.acomodacao = null
    },

  }  
};
</script>
