<template>
  <div>
    <el-dialog title="Selecionar Data e Leito para Transferência" :visible.sync="showing" :before-close="handleClose" width="770px">
      <listagem-erros :errors="errors"></listagem-erros>
      <el-row type="flex">
        <el-col :span="18">
          <div class="font-weight-bold" style="font-size:1.2em; padding-bottom:5px;">{{nomeHospede}}</div>
        </el-col>
        <el-col :span="6">
          <h4 v-if="acomodacao != null">Seleção: Quarto {{acomodacao.quarto.numero}} Leito {{acomodacao.leito.numero}}</h4>
        </el-col>
      </el-row>
      <el-row>
        <el-form :model="form" label-position="left" label-width="140px;">
          <el-row type="flex">
            <el-col>
              <el-form-item label="Data de Transferência">
                <el-date-picker type="date" v-model="form.data" format="dd/MM/yyyy" size="small" value-format="yyyy-MM-dd" ></el-date-picker>    
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row type="flex">
        <el-col :sm="24" :md="24" :lg="24">
          <tab-selecao-leito :config="configTabSelecaoLeito" @select="onSelect"></tab-selecao-leito>
        </el-col>
      </el-row>    

      <span slot="footer" class="dialog-footer">
        <el-button @click="doSelecionarTransferencia(false)">Cancelar</el-button>
        <el-button type="primary" :disabled="acomodacao == null || form.data == null" @click="doSelecionarTransferencia(true)">Confirmar</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import TabSelecaoLeito from "../movimentacao/TabSelecaoLeito"
import ListagemErros from "../../components/ListagemErros"

export default {
  name: "DialogoTransferenciaLeito",
  
  components: {
    TabSelecaoLeito,
    ListagemErros
  },

  props : ['visible', 'config'],

  watch: {
    config:{
      deep: true,
      handler(){
        const hospede = this.config ? this.config.hospede : null

        this.nomeHospede = hospede ? hospede.pessoa.nome : ""
        this.hospedeId = hospede ? hospede.id : null
        this.hospedagemId = this.config ? this.config.hospedagemId : null

        const dataIni = this.config ? this.config.dataIni : null
        const dataFim = this.config ? this.config.dataFim : null
        const destinacaoHospedagemId = this.config ? this.config.destinacaoHospedagemId : null

        this.configTabSelecaoLeito = {
          hospedagemId : this.hospedagemId,
          destinacaoHospedagemId : destinacaoHospedagemId,
          dataIni : dataIni,
          dataFim : dataFim
        } 
      }
    },

    visible: {
      handler(){
        this.showing = this.visible
      }
    }

  },

  data: () =>({

    configTabSelecaoLeito: {
      hospedagemId : null,
      destinacaoHospedagemId : null,
      dataIni : null,
      dataFim : null
    }, 

    form : {
      data : null
    },
    acomodacao : null,
    
    errors : [],

    hospedagemId : 0,
    hospedeId : null,
    nomeHospede : "",

    showing : false,

  }),

  created(){
    this.reset()
  },

  mounted(){

    this.configTabSelecaoLeito = {
      hospedagemId : null,
      destinacaoHospedagemId : null,
      dataIni : null,
      dataFim : null
    } 

  },

  methods: {

    onSelect(acomodacao){
      this.acomodacao = acomodacao
    },

    handleClose(){
      this.doSelecionarTransferencia(false)
    },

    doSelecionarTransferencia(ok){
      if (ok){
        const dados = {
          hospedeId : this.hospedeId,
          leitoId : this.acomodacao.leito.id,
          data : this.form.data 
        }
        
        petra.axiosPost("/app/hospedagem/mapa/transferir", dados)
          .then(response => {
            this.reset()
            this.$emit('selecionar', true)
          }).catch(error => {
            this.errors = petra.tratarErros(error);
          })

      } else {
        this.reset()
        this.$emit('selecionar', false)
      }
    },

    reset(){
      this.acomodacao = null
      this.form.data = null
    },

  }  
};
</script>
