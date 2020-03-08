<template>
  <div>
    <!-- <el-button type="primary" size="mini" plain>Selecionar</el-button> -->
    <el-dialog title="Acrescentar Hóspede" :visible.sync="showing" :before-close="handleClose" width="910px">
      <listagem-erros :errors="errors"></listagem-erros>
      <el-row v-if="state != 'zbrowse'">
        <el-form :model="form" label-position="left" label-width="120px">
          <el-row type="flex">
            <el-col :span="12">
              <el-form-item label="Hóspede">
                <el-input
                  placeholder="Selecione o hóspede"
                  v-model="pessoaSelecionada"
                  :class="'input-with-select'"
                  readonly >
                  <el-button slot="append" icon="el-icon-search" @click="handleSelectState('hospede')"></el-button>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Quarto/Leito:">
                <el-input
                  placeholder="Selecione o leito"
                  v-model="leitoSelecionado"
                  :class="'input-with-select'"
                  readonly >
                  <el-button slot="append" icon="el-icon-search" @click="handleSelectState('leito')"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex">

            <el-col :span="12">  
              <el-form-item label="Tipo de Hóspede">
                <el-select v-model="form.tipoHospedeId" placeholder="Selecione um Tipo" style="width: 100%;"> 
                  <el-option
                    v-for="item in itensTipoHospede"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Data de Entrada">
                <el-date-picker type="date" v-model="form.data" format="dd/MM/yyyy" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>    
              </el-form-item>
            </el-col>


          </el-row>
        </el-form>
      </el-row>
      <el-row v-if="state != 'browse'" class="font-weight-bold">
        {{estadoSelecionado}}
      </el-row>

      <el-row type="flex" v-if="state != 'browse'">
        <el-col :sm="24" :md="24" :lg="24" style="height:280px;">
          <div v-if="state == 'hospede'">
            <el-row>
              <el-col :sm="24" :md="24" :lg="24">
                <edit-search :itens="itensBusca" @search="handleSearchPessoa"></edit-search>
              </el-col>
            </el-row>  
            <!-- todo componentizar -->
            <el-row type="flex" justify="center" align="middle">
              <el-col :sm="24" :md="24" :lg="24">
                <el-table :data="dados" stripe style="width: 100%" border size="small" :default-sort="{prop: 'descricao', order: 'ascending'}" :height="240">
                  <el-table-column fixed header-align="left" align="right" prop="id" label="Código" width="100"></el-table-column>
                  <el-table-column fixed prop="nome" sortable label="Nome" width="250"></el-table-column>
                  <el-table-column prop="dataNascimento" label="Nascimento" header-align="left" width="120" sortable></el-table-column>
                  <el-table-column prop="endereco.descricao" label="Endereço" class-name="wordwrap" width="350"></el-table-column>
                  <el-table-column prop="naturalidadeCidade" sortable label="Naturalidade" width="120"></el-table-column>
                  <el-table-column prop="naturalidadeUf" sortable label="UF"></el-table-column>
                  <el-table-column label="Ações" fixed="right" align="center" width="140">
                    <template slot-scope="scope">
                      <el-tooltip content="Selecionar para Hospedagem" placement="bottom" :open-delay="500">
                        <el-button type="warning" plain size="mini" circle @click="handleSelecionarParaHospedagem(scope.row)">
                          <i class="fas fa-star"></i>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>

          </div>
          <tab-selecao-leito :config="configTabSelecaoLeito" @select="onSelect" v-if="state == 'leito'"></tab-selecao-leito>
        </el-col>
      </el-row>    
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="doSelecionarTransferencia(false)">Cancelar</el-button>
        <el-button type="primary" :disabled="form.acomodacao == null || form.data == null || form.pessoa == null || form.tipoHospedeId == null" 
            @click="doSelecionarTransferencia(true)">Confirmar</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import TabSelecaoLeito from "../movimentacao/TabSelecaoLeito"
import ListagemErros from "../../components/ListagemErros"
import EditSearch from "../../components/EditSearch"

export default {
  name: "DialogoAcrescentarHospede",
  
  components: {
    TabSelecaoLeito,
    ListagemErros,
    EditSearch
  },

  props : ['visible', 'config'],

  watch: {
    config:{
      deep: true,
      handler(){
        console.log("this.config = ",this.config)

        var hospede = this.config ? this.config.hospede : null
        this.nomeHospede = hospede ? hospede.pessoa.nome : ""
        this.hospedeId = hospede ? hospede.id : null
        this.hospedagemId = this.config ? this.config.hospedagemId : null

        var dataIni = this.config ? this.config.dataIni : null
        var dataFim = this.config ? this.config.dataFim : null

        var destinacaoHospedagemId = this.config ? this.config.destinacaoHospedagemId : null

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

  computed: {
    leitoSelecionado(){
      return this.form.acomodacao == null ? "Selecione..." : `Quarto ${this.form.acomodacao.quarto.numero} Leito ${this.form.acomodacao.leito.numero}`
    },

    pessoaSelecionada(){
      return this.form.pessoa == null ? "Selecione o hóspede" : this.form.pessoa.nome
    },

    estadoSelecionado(){
      return this.state == 'hospede' ? "Selecione o hóspede" : 'Selecione o Quarto e Leito'
    }
  },

  data: () =>({

    state : "browse", // browse | hospede | leito

    configTabSelecaoLeito: {
      hospedagemId : null,
      destinacaoHospedagemId : null,
      dataIni : null,
      dataFim : null
    }, 

    form : {
      data : null,
      acomodacao : null,
      pessoa: null,
      tipoHospede: null
    },

    itensBusca: [
      {text: "Nome", value: "nome", type: "text"},
      {text: "CPF", value: "cpf", type: "text"},
      {text: "RG", value: "rg", type: "text"},
      {text: "Cartão do SUS", value: "cartaoSus", type: "text"},
      {text: "Telefone", value: "telefone", type: "text"},
      {text: "Telefone2", value: "telefone2", type: "text"},
    ],

    dados : [],
    itensTipoHospede : [],

    errors : [],

    hospedagemId : null,
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

    this.loadListas()

  },

  methods: {

    onSelect(acomodacao){
      this.form.acomodacao = acomodacao
    },

    handleSelectState(state){
      this.state = state
    },

    handleSearchPessoa(searchField, searchValue){
      this.searchField = searchField
      this.searchValue = searchValue
      this.doGetAll(true)
    },

    doGetAll(showMessage) {
      if (this.searchValue.length < 3){
        if (showMessage) {
          petra.showMessageError("Texto de busca deve ter pelo menos 3 caracteres");
        }
        return
      }

      var searchRequest = {
        fieldName : this.searchField,
        value : this.searchValue
      }

      petra.axiosPost("/app/pessoas/filtrar", searchRequest).then(response => {
        this.dados = response.data;
      });
    },

    loadListas() {
      this.itensDestinacaoHospedagem = [];
      petra.axiosGet("/app/quarto/listas",false).then(
        response => {
          this.itensTipoHospede = response.data.listaTipoHospede
        })
    },

    handleSelecionarParaHospedagem(row){
      this.form.pessoa = row
    },

    doGetById(id) {
      petra.axiosGet(`/app/pessoas/${id}`).then(response => {
        this.form = response.data;
        this.state = "edit";
        this.$nextTick(() => {
          setTimeout(() => {
          }, 500);
        });
      });
    },

    handleClose(){
      this.doSelecionarTransferencia(false)
    },

    doSelecionarTransferencia(ok){

      if (ok){
        var dados = {
          hospedagemId : this.hospedagemId,
          pessoaId : this.form.pessoa.id,
          tipoHospedeId : this.form.tipoHospedeId,
          leitoId : this.form.acomodacao.leito.id,
          data : this.form.data 
        }
        
        petra.axiosPost("/app/hospedagem/mapa/adicionar", dados)
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
      this.form.acomodacao = null
      this.form.data = null
      this.form.pessoa = null
      this.form.tipoHospede = null
    },

  }  
};
</script>
