<template>
  <div>

    <!-- begin frame-hospedagem -->
    <el-container v-if="hospedagem != null && state == 'browse'">
      <el-main style="padding:5px; line-height:1.5em; height:370px;">
        <el-row>
          <el-col :span="24">
            <el-tabs type="border-card" >
              <el-tab-pane label="Hospedagem" style="height:280px;">
                <!-- TODO: Componentizar esse resumo de hospedagem. Isso é utilizado em FrameAcrescentarHospede -->
                <el-row :gutter="10">
                  <el-col :span="8">Código</el-col>
                  <el-col :span="6" class="font-weight-bold">{{config.hospedagemId}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">Data de Entrada</el-col>
                  <el-col :span="6" class="font-weight-bold">{{formatDate(hospedagem.dataEntrada)}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">Data Prevista de Saída</el-col>
                  <el-col :span="6" class="font-weight-bold">{{formatDate(hospedagem.dataPrevistaSaida)}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">Data Efetiva de Saída</el-col>
                  <el-col :span="6" class="font-weight-bold">{{formatDate(hospedagem.dataEfetivaSaida)}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">Destinação de Hospedagem</el-col>
                  <el-col :span="6" class="font-weight-bold">{{destinacaoHospedagem.descricao}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">Tipo de Utilização</el-col>
                  <el-col :span="6" class="font-weight-bold">{{tipoUtilizacao(hospedagem.tipoUtilizacao)}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">Situação</el-col>
                  <el-col :span="6" class="font-weight-bold">{{hospedagem.status}}</el-col>
                </el-row>
                <el-row :gutter="10" v-if="servicos.length > 0">
                  <el-col :span="8">Serviços</el-col>
                  <el-col :span="16" class="font-weight-bold">
                    <el-tag v-for="(servico, idx) in servicos" :key="idx" type="success" size="medium" class="tags">{{servico.descricao}}</el-tag>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">Observações</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-input type="textarea" class="font-size-10" rows="5" v-model="hospedagem.observacoes" readonly></el-input>                      
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="Hóspede(s)" style="height:280px;">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-collapse v-for="(hpd, i) in hospedagem.hospedes" :key="i" v-model="activeName" accordion>
                      <el-collapse-item  :title="hpd.pessoa.nome + ' - ' + hpd.tipoHospede.descricao" :name="i" 
                        :class="{'grey-lighten-4' : !isBaixado(hpd), 'amber-lighten-4' : isBaixado(hpd)}">   
                        <el-row v-if="hpd.baixado == 'S'" class="font-weight-bold">
                          BAIXADO
                        </el-row>
                        <el-row v-if="permitirEditar" :gutter="10">
                          <el-col>
                            <!-- showSelecionarDataBaixa(hpd.id, hospedagem.dataPrevistaSaida) -->
                            <el-button type="primary" size="mini" v-if="hospedagem.dataEfetivaSaida == null && hpd.baixado != 'S'" 
                              @click.native="handleSelecionarDataBaixa(hpd)">Baixar
                            </el-button>
                            <el-button type="primary" size="mini" v-if="hospedagem.dataEfetivaSaida == null && hpd.baixado != 'S' && hospedagem.tipoUtilizacao == 'T'" 
                              @click.native="handleSelecionarTransferencia(hpd)">Transferir
                            </el-button>
                            <el-button type="primary" size="mini" v-if="hospedagem.dataEfetivaSaida == null" 
                              @click.native="handleRemoverHospede(hpd)">Remover
                            </el-button>
                          </el-col>
                        </el-row>

                        <el-row :gutter="10">
                          <el-col :span="4">Nascimento</el-col>
                          <el-col :span="20" class="font-weight-bold">{{formatDate(hpd.pessoa.dataNascimento)}}</el-col>
                        </el-row>
                        <el-row :gutter="10">
                          <el-col :span="4">Endereço</el-col>
                          <el-col :span="20" class="font-weight-bold">{{hpd.pessoa.endereco != null ? hpd.pessoa.endereco.descricao : ''}}</el-col>
                        </el-row>

                        <div xs12 sm12 md12 v-if="hospedagem.tipoUtilizacao == 'T'">
                          <el-row>
                            <el-col>Histórico de Leitos</el-col>
                          </el-row>

                          <el-row v-for="(leito, leitoIndex) in hpd.leitos" :key="leitoIndex" class="body-1 pa-1 pl-3">
                              <el-col>
                              #{{leito.id}} - {{formatDate(leito.dataEntrada)}} - Quarto {{leito.quartoNumero}} Leito {{leito.leitoNumero}}
                              <span v-if="(hpd.baixado == 'S') && (leitoIndex == hpd.leitos.length-1)" class="font-weight-bold"> - Baixado em {{formatDate(leito.dataSaida)}}</span>
                              </el-col>
                          </el-row>
                        </div> 
                      </el-collapse-item>
                    </el-collapse> 
                  </el-col>
                </el-row>
              </el-tab-pane>

              <el-tab-pane label="Encaminhador" style="height:280px;">
                <div v-if="entidade != null">
                  <el-row :gutter="5" class="font-size-10">
                    <el-col :span="16">
                      Encaminhador
                    </el-col>
                    <el-col :span="8">
                      Cargo
                    </el-col>
                  </el-row>

                  <el-row :gutter="5">
                    <el-col :span="16">
                      <el-input size="mini" readonly v-model="encaminhador.nome"></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input size="mini" readonly v-model="encaminhador.cargo"></el-input>
                    </el-col>
                  </el-row>

                  <el-row :gutter="5" class="font-size-10">
                    <el-col :span="8">
                      Telefone
                    </el-col>
                    <el-col :span="16">
                      Email
                    </el-col>
                  </el-row>

                  <el-row :gutter="5">
                    <el-col :span="8">
                      <el-input size="mini" readonly v-model="encaminhador.telefone"></el-input>
                    </el-col>
                    <el-col :span="16">
                      <el-input size="mini" readonly v-model="encaminhador.email"></el-input>
                    </el-col>
                  </el-row>

                  <el-row :gutter="5" class="font-size-10">
                    <el-col :span="16">
                      Entidade
                    </el-col>
                    <el-col :span="8">
                      CNPJ
                    </el-col>
                  </el-row>

                  <el-row :gutter="5">
                    <el-col :span="16">
                      <el-input size="mini" readonly v-model="entidade.nome"></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input size="mini" readonly v-model="entidade.cnpj"></el-input>
                    </el-col>
                  </el-row>

                  <el-row :gutter="5" class="font-size-10">
                    <el-col :span="8">
                      Telefone
                    </el-col>
                    <el-col :span="16">
                      Email
                    </el-col>
                  </el-row>

                  <el-row :gutter="5">
                    <el-col :span="8">
                      <el-input size="mini" readonly v-model="entidade.telefone"></el-input>
                    </el-col>
                    <el-col :span="16">
                      <el-input size="mini" readonly v-model="entidade.email"></el-input>
                    </el-col>
                  </el-row>

                  <el-row :gutter="5" class="font-size-10">
                    <el-col :span="12">
                      Endereço
                    </el-col>
                    <el-col :span="4">
                      Número
                    </el-col>
                    <el-col :span="8">
                      Complemento
                    </el-col>
                  </el-row>

                  <el-row :gutter="5"  v-if="entidade != null && entidade.endereco != null">
                    <el-col :span="12">
                      <el-input size="mini" readonly v-model="entidade.endereco.logradouro"></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-input size="mini" readonly v-model="entidade.endereco.numero"></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input size="mini" readonly v-model="entidade.endereco.complemento"></el-input>
                    </el-col>
                  </el-row>

                  <el-row :gutter="5" class="font-size-10">
                    <el-col :span="8">
                      Bairro
                    </el-col>
                    <el-col :span="4">
                      CEP
                    </el-col>
                    <el-col :span="8">
                      Cidade
                    </el-col>
                    <el-col :span="4">
                      UF
                    </el-col>
                  </el-row>
                  <el-row :gutter="5" v-if="entidade != null && entidade.endereco != null">
                    <el-col :span="8">
                      <el-input size="mini" readonly v-model="entidade.endereco.bairro"></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-input size="mini" readonly v-model="entidade.endereco.cep"></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input size="mini" readonly v-model="entidade.endereco.cidade"></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-input size="mini" readonly v-model="entidade.endereco.uf"></el-input>
                    </el-col>
                  </el-row>
                </div>    

              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-container v-if="hospedagem != null && state == 'baixar'">
      <el-main style="padding:5px; line-height:2.2em; height:370px;" >
        <listagem-erros :errors="errors"></listagem-erros>        
        <el-row>
          <el-col style="text-align:center">
            <h4>Informe a data de Baixa</h4>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">Hóspede a ser baixado</el-col>
          <el-col :span="16" class="font-weight-bold">{{hospedeSelecionado.pessoa.nome}}</el-col>
        </el-row>

        <el-row>
          <el-form :model="formBaixa" label-position="left" label-width="140px;">
            <el-row type="flex">
              <el-col>
                <el-form-item label="Data de Baixa">
                  <el-date-picker type="date" v-model="formBaixa.dataBaixa" format="dd/MM/yyyy" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>    
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>

        <el-row>
          <el-col>
            <el-button type="danger" size="mini" @click.native="handleBaixarHospede" :disabled="formBaixa.dataBaixa == null">Confirmar</el-button>
            <el-button type="primary" size="mini" @click.native="state = 'browse'">Cancelar</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>    

    <el-container v-if="hospedagem != null && state == 'transferir'">
      <el-main style="padding:10px; line-height:1.2em; height:370px;" >
        <listagem-erros :errors="errors"></listagem-erros>        
        <el-row >
          <el-col style="text-align:left; padding:0;">
            <h4 style="margin:10px 0px;">TRANSFERÊNCIA DE LEITO - {{hospedeSelecionado.pessoa.nome}}</h4>
          </el-col>
        </el-row>
        <el-row>
          <el-form :model="formTransferencia" label-width="200px;">
            <el-row type="flex">
              <el-col>
                <el-form-item label="Data de Transferência" label-position="left"  size="small">
                  <el-date-picker type="date" v-model="formTransferencia.dataTransferencia" format="dd/MM/yyyy" value-format="yyyy-MM-dd" ></el-date-picker>    
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>

        <el-row style="margin-bottom:10px; height:225px;">
          <selecao-leito ref="frameSelecaoLeito" :config="configTransferencia" :height="140" @onSelecionar="onSelecionarLeito"></selecao-leito>
        </el-row>

        <el-row>
          <el-col>
            <el-button type="danger" size="mini" @click.native="handleTransferirHospede" 
              :disabled="(formTransferencia.dataTransferencia == null) || (formTransferencia.acomodacao == null)">Confirmar</el-button>
            <el-button type="primary" size="mini" @click.native="state = 'browse'">Cancelar</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>    

  </div>
</template>

<script>

import ListagemErros from "../../components/ListagemErros"
import SelecaoLeito from "./SelecaoLeito.vue"

export default {
  name: 'FrameHospedagem',
  
  components: {
    ListagemErros,
    SelecaoLeito,
  },

  computed: {
  },

  watch: {
    config:{
      deep: true,
      handler() {
        this.open(this.config.hospedagemId, this.config.permitirEditar)
      }
    }
  },

  props:['config'],

  data: () =>({
    state : 'browse',

    hospedagemId: 0,
    hospedagem:{},
    hospedeSelecionado:null,

    tipoHospede:{},
    destinacaoHospedagem:{},
    hospede: {},
    hospedes: [],
    servicos: [],
    entidade:{},
    encaminhador:{},

    activeName:null,

    dados: [],
    erros:[],
    
    permitirEditar : false,
    tabActive : 0,

    formBaixa : {
      dataBaixa : null
    },

    formTransferencia : {
      dataTransferencia : null,
      acomodacao : null
    },

    configTransferencia : {
      hospede : null,
      destinacaoHospedagemId : null,
      dataEntrada : null,
      dataPrevistaSaida : null
    },

    errors: [],
  }),

  created(){
    this.reset()
  },

  mounted(){
    this.open(this.config.hospedagemId, this.config.permitirEditar)
  },

  methods: {

    // public
    open(hospedagemId, permitirEditar){
      this.reset()
      this.permitirEditar = permitirEditar || false
      this.hospedagemId = hospedagemId
      this.getInfo(hospedagemId)
    },

    // public
    getHospedagem(){
      return this.hospedagem
    },

    handleSelecionarDataBaixa(hpd){
      this.hospedeSelecionado = hpd
      this.formBaixa.dataBaixa = null
      this.state = 'baixar'
    },

    handleBaixarHospede(){
      if (this.hospedeSelecionado != null && this.formBaixa.dataBaixa != null){
        this.baixarHospede(this.hospedeSelecionado.id, this.formBaixa.dataBaixa)
      }
    },

    baixarHospede(hospedeId, data) {
      const dados = {
        hospedeId : hospedeId,
        data : data
      }
      
      petra.axiosPost("/app/hospedagem/mapa/baixar", dados, false)
        .then(response => {
          this.getInfo(this.hospedagemId)
          petra.showMessageSuccess('Hóspede baixado com sucesso')
          this.state = 'browse'
        }).catch(error => {
          this.errors = petra.tratarErros(error);
          //console.log(this.errors)
          petra.showMessageError(this.errors)
        })
    },



    onSelecionarLeito(acomodacao){
      this.formTransferencia.acomodacao = acomodacao
    },

    handleRemoverHospede(hpd){
      this.hospedeSelecionado = hpd

      /*
      this.formTransferencia.dataTransferencia = null
      this.state = 'transferir'
      this.configTransferencia = {
        hospede : hpd,
        destinacaoHospedagemId : this.destinacaoHospedagem.id,
        dataEntrada : this.hospedagem.dataEntrada,
        dataPrevistaSaida : this.hospedagem.dataPrevistaSaida
      }
      //this.$refs.frameSelecaoLeito.openDialog(hpd, this.destinacaoHospedagem.id, this.hospedagem.dataEntrada, this.hospedagem.dataPrevistaSaida)
      */
    },



    handleSelecionarTransferencia(hpd){
      this.hospedeSelecionado = hpd
      this.formTransferencia.dataTransferencia = null
      this.state = 'transferir'
      this.configTransferencia = {
        hospede : hpd,
        destinacaoHospedagemId : this.destinacaoHospedagem.id,
        dataEntrada : this.hospedagem.dataEntrada,
        dataPrevistaSaida : this.hospedagem.dataPrevistaSaida
      }
      //this.$refs.frameSelecaoLeito.openDialog(hpd, this.destinacaoHospedagem.id, this.hospedagem.dataEntrada, this.hospedagem.dataPrevistaSaida)
    },

    handleTransferirHospede(){
      if (this.hospedeSelecionado != null && this.formTransferencia.dataTransferencia != null && this.formTransferencia.acomodacao != null){
        this.transferirHospede(this.hospedeSelecionado.id, this.formTransferencia)
      }
    },

    transferirHospede(hospedeId, data){
      //var selecao = this.$refs.frameSelecaoLeito.getSelecao()
      const dados = {
        hospedeId : hospedeId,
        leitoId : data.acomodacao.leito.id,
        data : data.dataTransferencia
      }

      //console.log("dados para transferencia:",dados);
      petra.axiosPost("/app/hospedagem/mapa/transferir", dados)
        .then(response => {
          this.getInfo(this.hospedagemId)
          petra.showMessageSuccess('Hóspede transferido com sucesso')
          this.state = 'browse'
          this.dialogVisible = false
        }).catch(error => {
          this.errors = petra.tratarErros(error);
          //console.log(this.errors)
          //petra.showMessageError(this.errors)
        })
    },

    formatDate(data, formato){
      return petraDateTime.formatDate(data) || '---'
    },
   
    tipoUtilizacao(tipo){
      return tipo == "T" ? "Total" : "Parcial"
    },

    isBaixado(hospede){
      return hospede.baixado == 'S'
    },

    getInfo(hospedagemId) {
      var dados = {
        hospedagemId : hospedagemId
      }

      petra.axiosPost("/app/hospedagem/mapa/hospedagem_info", dados, false)
        .then(response => { 
            this.hospedagem = response.data
            this.entidade = (this.hospedagem && this.hospedagem.entidade) ? this.hospedagem.entidade : null
            this.encaminhador = (this.hospedagem && this.hospedagem.encaminhador) ? this.hospedagem.encaminhador : null
            this.hospedes = this.hospedagem.hospedes
            this.servicos = (this.hospedagem && this.hospedagem.servicos) ? this.hospedagem.servicos : []
            this.tipoHospede = this.hospedagem.hospedes[0].tipoHospede
            this.destinacaoHospedagem = this.hospedagem.destinacaoHospedagem
            this.$emit('refresh',this.hospedagem)
          }).catch(error => {
            this.errors = petra.tratarErros(error);
          })
    },

    reset(){
      this.form = {
        id : null,
        descricao : null
      },
      this.errors = []
    },

    getErrors(fieldName){
      return petra.getErrors(fieldName, this.errors)
    }

  }
}
</script>
<style scoped>

  .font-weight-bold {
    font-weight: bold;    
  }
  .font-size-10 {
    font-size: 10pt;
  }
  .tags {
    margin-right: 5px;
  }

</style>