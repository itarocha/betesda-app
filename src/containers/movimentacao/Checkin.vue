<template>
  <div>
    <dialogo-selecao-leito :visible="dialogoSelecaoLeitoVisible" :config="configSelecaoLeito" @onSelecionar="onSelecionarLeito"></dialogo-selecao-leito>

    <el-container v-if="state == 'insert'">
      <el-header>
        <el-tooltip content="Limpar infomações" placement="bottom" :open-delay="toolTipDelay">
          <el-button type="primary" @click="handleLimpar">Limpar</el-button>
        </el-tooltip>
        <el-tooltip content="Insere nova Hospedagem com as informações" placement="bottom" :open-delay="toolTipDelay">
          <el-button type="primary" @click="handleLancarHospedagem" :disabled="btLancarHospedagemClicked">Lançar Hospedagem</el-button>
        </el-tooltip>
      </el-header>

      <el-main style="padding-top:0px; padding-left:5px; padding-right:5px; padding-bottom:5px;">
        <listagem-erros :errors="errors"></listagem-erros>
        <el-form :model="form" :rules="rules" ref="form" label-position="left" size="small" label-width="100px">
        <el-row type="flex" justify="center">
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-container>
              <el-header style="padding-left:0; padding:5px; line-height:40px;">
                <el-row>
                  <el-col>
                    <div class="subtitulo bg-purple">OPÇÕES</div>
                  </el-col>
                </el-row>
              </el-header>
              <el-main style="padding: 0px 5px;">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-form-item label="Entidade" prop="entidadeId" :error="getErro('entidadeId')">
                      <el-select v-model="form.entidadeId" ref="entidadeId" style="width: 100%;" size="mini">
                        <el-option v-for="item in itensEntidades" :key="item.value" :label="item.text" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-form-item label="Encaminhador" prop="encaminhadorId" :error="getErro('encaminhadorId')">
                      <el-select v-model="form.encaminhadorId" style="width: 100%;" size="mini">
                        <el-option v-for="item in itensEncaminhadores" :key="item.value" :label="item.text" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="Dt.Entrada" prop="dataEntrada" :error="getErro('dataEntrada')">
                      <el-date-picker v-model="form.dataEntrada" type="date" format="dd/MM/yyyy" value-format="yyyy-MM-dd" style="width: 100%;" size="mini"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Prev. Saída" prop="dataPrevistaSaida" :error="getErro('dataPrevistaSaida')">
                      <el-date-picker v-model="form.dataPrevistaSaida" type="date" format="dd/MM/yyyy" value-format="yyyy-MM-dd" style="width: 100%;" size="mini"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="Destinação" prop="destinacaoHospedagemId" :error="getErro('destinacaoHospedagemId')">
                      <el-select v-model="form.destinacaoHospedagemId" style="width: 100%;" size="mini">
                        <el-option v-for="item in itensDestinacaoHospedagem" :key="item.value" :label="item.text" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Utilização" prop="tipoUtilizacao" :error="getErro('tipoUtilizacao')">
                      <el-select v-model="form.tipoUtilizacao" style="width: 100%;" size="mini">
                        <el-option v-for="item in itensUtilizacao" :key="item.value" :label="item.text" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10" v-if="(form.tipoUtilizacao == 'P')">
                  <el-col :span="24">
                    <el-form-item label="Serviços" prop="destinacoes" :error="getErro('destinacoes')">
                      <el-select v-model="form.servicos" multiple placeholder="Selecione um ou mais" style="width:100%">
                        <el-option
                          v-for="item in itensTipoServico"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-form-item label="Observacoes" prop="fixme" :error="getErro('observacoes')">
                      <el-input type="textarea" rows="5" v-model="form.observacoes" size="mini"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-main>
            </el-container>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12">

            <el-container>
              <el-header style="padding-left:0; padding:5px; line-height:40px; ">
                <el-row>
                  <el-col>
                    <div class="subtitulo bg-purple">HÓSPEDES</div>
                  </el-col>
                </el-row>
              </el-header>
              <el-main style="padding: 0px 5px;">
                <el-row>
                  <el-col>
                    <el-card v-for="(item, i) in aguardando" :key="i" shadow="never" style="margin-bottom: 10px;">

                      <div slot="header" class="clearfix" >
                        <span class="card-header">{{item.pessoa.nome}}</span>

                        <el-tooltip content="Remover da Hospedagem" placement="bottom" :open-delay="toolTipDelay">
                            <el-button @click="removerHospede(item)" style="float: right; margin-left:10px" plain size="small" circle ><i class="fas fa-trash"></i></el-button>
                        </el-tooltip>

                        <el-tooltip v-if="(form.tipoUtilizacao == 'T') && (form.destinacaoHospedagemId != null)" content="Selecionar Leito" placement="bottom" :open-delay="toolTipDelay">
                            <el-button @click="selecionarLeito(item)" style="float: right; margin-left:10px" plain size="small" circle ><i class="fas fa-bed"></i></el-button>
                        </el-tooltip>

                        <el-tooltip content="Alterar Tipo de Hóspede" placement="bottom" :open-delay="toolTipDelay">
                            <el-button @click="doSelecionarTipoHospede(item)" style="float: right; margin-left:10px" plain size="small" circle ><i class="fas fa-users"></i></el-button>
                        </el-tooltip>

                        <!-- desabilitado temporariamente -->
                        <el-tooltip v-if="false" content="Conferir/Editar dados do Hóspede" placement="bottom" :open-delay="toolTipDelay">
                            <el-button @click="editarHospede(item)" style="float: right; margin-left:10px" plain size="small" circle ><i class="fas fa-pencil-alt"></i></el-button>
                        </el-tooltip>
                      </div> 

                      <div class="card-detail">
                        <div v-if="(item.tipoHospede == null)" class="red-lighten-4">Selecione o Tipo de Hóspede</div> 
                        <div v-if="(item.tipoHospede != null)">{{item.tipoHospede.descricao}}</div>
                        <div v-if="(form.tipoUtilizacao == 'T') && (form.destinacaoHospedagemId == null)" class="red-lighten-4">Selecione a Destinação da Hospedagem</div> 
                        <div v-if="(form.tipoUtilizacao == 'T') && (form.destinacaoHospedagemId != null) && (item.acomodacao == null)" class="red-lighten-4">Selecione o Leito</div> 
                        <div v-if="item.acomodacao != null">Quarto: {{item.acomodacao.quarto.numero}} Leito: {{item.acomodacao.leito.numero}}</div>
                      </div>

                    </el-card>
                  </el-col>
                </el-row>
              </el-main>
            </el-container>

          </el-col>
        </el-row>
        </el-form>
      </el-main>
    </el-container>

    <el-container v-if="state == 'browse'">
      <el-header>
        <el-tooltip content="Preparar para incluir nova Hospedagem" placement="bottom" :open-delay="toolTipDelay">
          <el-button type="primary" @click="handleIncluirHospedagem">Incluir</el-button>
        </el-tooltip>
      </el-header>

      <el-main style="padding-top:0px; padding-left:5px; padding-right:5px; padding-bottom:5px;">
        <frame-hospedagem :config="configHospedagem"></frame-hospedagem>
      </el-main>
    </el-container>


    <el-dialog title="Selecionar Tipo de Hóspede" :visible.sync="dialogSelecionarTipoHospede" width="500px">
      <el-form :model="formTipoHospede" label-position="left" label-width="140px;">
        <el-row type="flex">
          <el-col>
            <h4>{{hospedeSelecionado == null ? "" : hospedeSelecionado.pessoa.nome}}</h4>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col>
            <el-form-item label="Tipo de Hóspede">
              <el-select v-model="formTipoHospede.tipoHospedeId" placeholder="Selecione um Tipo" style="width: 100%;"> 
                <el-option
                  v-for="item in itensTipoHospede"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleSelecionarTipoHospede(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleSelecionarTipoHospede(true)" :disabled="formTipoHospede.tipoHospedeId == null">Confirmar</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>

import DialogoSelecaoLeito from "./DialogoSelecaoLeito.vue"
import FrameHospedagem from "./FrameHospedagem.vue"
import ListagemErros from "../../components/ListagemErros.vue"

export default {

  name: 'Checkin',

  components:{
    DialogoSelecaoLeito,
    FrameHospedagem,
    ListagemErros
  },

  created(){
  },

  mounted(){
    this.$store.dispatch('setAcao','Checkin')
    this.resetData()

    this.form = this.$store.getters.formHospedagem

    this.loadListas()
      this.$nextTick(() => {
        setTimeout(() => this.$refs.entidadeId.focus(), 500)
      })      
  },

  watch: {
    configSelecaoLeito:{
      deep: true,
      handler(){
      }
    }
  },


  data: () =>({
    dados: [],

    errors: [],

    state: "insert",

    btLancarHospedagemClicked : false,

    hospedes: [],

    itensDestinacaoHospedagem : [],
    itensTipoHospede : [],
    itensEntidades : [],
    itensEncaminhadores : [],
    itensUtilizacao: [{ text: "Total", value: "T" }, { text: "Parcial", value: "P" }],

    dialogSelecionarTipoHospede : false,

    dialogoSelecaoLeitoVisible : false,

    form : {
      entidadeId: null,
      encaminhadorId: null,
      dataEntrada: null,    
      dataPrevistaSaida: null,
      destinacaoHospedagemId: null,
      tipoUtilizacao: null,
      servicos: [],
      observacoes : null
    },

    formTipoHospede: {
      tipoHospedeId : null
    },

    hospedeSelecionado : null,

    configHospedagem : {
      hospedagemId : 0,
      permitirEditar : false
    },

    configSelecaoLeito : {
      hospede : null, 
      destinacaoHospedagemId : null,
      dataIni : null, 
      dataFim: null
    },

    rules: {
      descricao: [
        { required: true, message: "Preencha a descrição",trigger: "blur"},
        { min: 3, max: 32, message: "Descrição deve ter de 3 a 32 caracteres",trigger: "blur"}
      ],
    },

    toolTipDelay: 500

  }),

  computed: {

    destinacaoHospedagemId(){
      return this.form.destinacaoHospedagemId
    },

    tipoUtilizacao(){
      return this.form.tipoUtilizacao
    },

    entidadeId(){
      return this.form.entidadeId
    },

    itensSelecaoTipoHospede(){
      return this.itensTipoHospede
    },

    servicos(){
      return this.form.servicos
    },

    aguardando(){
      return this.$store.getters.aguardando;
    },

  },

  watch : {
    form: {
      deep:true,
      handler(){
        this.updateFormHospedagem()
      }
    },

    destinacaoHospedagemId(){
      this.clearLeitos()
    },

    tipoUtilizacao(value){
      if (value == "P"){
        this.clearLeitos()
      }
    },

    entidadeId(newValue, oldValue){
      if (newValue == null){
        this.itensEncaminhadores = []
      } else {
        this.loadEncaminhadores(newValue)
      }
    },

  },


  methods: {

    resetData(){
      this.form = {
        entidadeId: null,
        encaminhadorId: null,
        dataEntrada: null,    
        dataPrevistaSaida: null,
        destinacaoHospedagemId: null,
        tipoUtilizacao: "T",
        servicos: [],
        observacoes : null
      },
      this.hospedes = []
      this.errors = []
      this.hospedagemGravadaId = 0
      //this.itensEncaminhadores = []
      //this.itensTipoServico = []
      //this.itensEntidades = []
    },

    updateFormHospedagem(){
      this.$store.dispatch('setFormHospedagem',this.form)
    },

    setDefaultData(){
      this.form.ativo = 'S'
    },

    fmtSimNao(row, col){
      return (row.ativo == 'S' ? 'Sim' : 'Não')
    },

    getErro(campo){
      const retorno =  _.find(this.erros,{fieldName : campo})
      if (retorno){
        return retorno.errorMessage
      }
      return null
    },

    loadListas() {
      this.itensDestinacaoHospedagem = [];
      petra.axiosGet("/app/quarto/listas",false).then(
        response => {
          this.itensDestinacaoHospedagem = response.data.listaDestinacaoHospedagem
          this.itensTipoLeito = response.data.listaTipoLeito
          this.itensSituacaoLeito = response.data.listaSituacaoLeito
          this.itensTipoServico = response.data.listaTipoServico
          this.itensTipoHospede = response.data.listaTipoHospede
          this.itensEntidades = response.data.listaEntidade
        })
    },

    loadEncaminhadores(id) {
      this.itensEncaminhadores = [];
      const endpoint = "/app/encaminhadores/lista/"+id
      petra.axiosGet("/app/encaminhadores/lista/"+id).then(
        response => {
          this.itensEncaminhadores = response.data
        })
    },

    clearLeitos(){
      for (var i = 0; i < this.aguardando.length; i++) {
        this.aguardando[i].acomodacao = null
      }      
    },

    handleLimpar(){
      this.resetData()
      this.$store.dispatch("limparHospedagem")
    },

    handleIncluirHospedagem() {
      this.configHospedagem.hospedagemId = 0
      this.estado = 'browse'
    },

    removerHospede(item){
      this.$store.dispatch("removerHospede", item)
     },

    handleLancarHospedagem(){
      if (this.btLancarHospedagemClicked) {
        return
      }
      this.postarHospedagem()
    },

    doSelecionarTipoHospede(hospede) {
      this.hospedeSelecionado = hospede 
      this.formTipoHospede.tipoHospedeId = null
      if (hospede.tipoHospede){
        this.formTipoHospede.tipoHospedeId = hospede.tipoHospede.id
      }
      this.dialogSelecionarTipoHospede = true
    },

    handleSelecionarTipoHospede(opcao){
      this.dialogSelecionarTipoHospede = false
      if (!opcao) {
        return
      }

      if (this.formTipoHospede.tipoHospedeId && this.hospedeSelecionado){
        const pessoaId = this.hospedeSelecionado.pessoa.id
        const th =  _.find(this.itensTipoHospede, {value : this.formTipoHospede.tipoHospedeId})

        if (th){
          const data = {
            pessoaId : pessoaId,
            tipoHospede : {
              id : th.value,
              descricao : th.text
            }
          }
          this.$store.dispatch("setTipoHospede", data)
        }
      }
    },

    selecionarLeito(hospede) {
      this.hospedeSelecionado = hospede

      this.configSelecaoLeito = {
        hospede : hospede, 
        destinacaoHospedagemId : this.form.destinacaoHospedagemId,
        dataIni : this.form.dataEntrada, 
        dataFim: this.form.dataPrevistaSaida        
      }

      this.dialogoSelecaoLeitoVisible = true

    },

    onSelecionarLeito(acomodacao){
      this.dialogoSelecaoLeitoVisible = false

      this.configSelecaoLeito = {
        hospede : null, 
        destinacaoHospedagemId : null,
        dataIni : null, 
        dataFim: null
      }

      if (!acomodacao) {
        return
      }

      if (this.hospedeSelecionado) {
        const data = {
          pessoaId : this.hospedeSelecionado.pessoa.id,
          acomodacao : acomodacao
        }

        this.$store.dispatch("setAcomodacao", data)
      }
    },

    postarHospedagem() {
      this.btLancarHospedagemClicked = true

      this.errors = []

      var toSave = {
        entidadeId : this.form.entidadeId,
        encaminhadorId : this.form.encaminhadorId,
        dataEntrada : this.form.dataEntrada,
        dataPrevistaSaida : this.form.dataPrevistaSaida,
        destinacaoHospedagemId : this.form.destinacaoHospedagemId,
        tipoUtilizacao : this.form.tipoUtilizacao,
        observacoes : this.form.observacoes,
        servicos : [],
        hospedes : []

      }
      if (this.form.tipoUtilizacao == "P") {
        toSave.servicos = this.form.servicos
      }
      for (var i = 0; i < this.aguardando.length; ++i){
        let hospede = this.aguardando[i]

        hospede = {
          pessoaId : hospede.pessoa.id,
          pessoaNome : hospede.pessoa.nome,
          tipoHospedeId : hospede.tipoHospede == null ? null : hospede.tipoHospede.id,
        }

        if ((this.form.tipoUtilizacao == "T") && (this.aguardando[i].acomodacao != null)){ 
          hospede.acomodacao = {
            quartoId : this.aguardando[i].acomodacao.quarto.id,
            quartoNumero : this.aguardando[i].acomodacao.quarto.numero,
            leitoId : this.aguardando[i].acomodacao.leito.id,
            leitoNumero : this.aguardando[i].acomodacao.leito.numero,
          }
        }
        toSave.hospedes.push(hospede)
      }

      petra.axiosPost("/app/hospedagem", toSave)
        .then(response => {
          this.handleLimpar()
          this.doShowHospedagemGravada(response.data.id)
          this.btLancarHospedagemClicked = false
        })
        .catch(error => {
          this.btLancarHospedagemClicked = false
          this.errors = petra.tratarErros(error)
        })
    },

    doShowHospedagemGravada(id){
      this.configHospedagem.hospedagemId = id
      this.state = 'browse'
    },

  }
}
</script>

<style scoped>

  .el-header {
    line-height: 60px;
  }

  .container{
    width:800px;
  }

  .el-col{
    padding-bottom:0px;
  }

  .el-form{
    padding:10px;
  }

  .subtitulo {
    text-align: center;
    border-radius: 4px;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .card-header{
    font-size: 10pt;
    font-weight: bold;
  }

  .card-detail{
    font-size: 10pt;
  }

  .red-lighten-4{
    padding:2px;
    background: #FFCDD2;
  }

</style>
