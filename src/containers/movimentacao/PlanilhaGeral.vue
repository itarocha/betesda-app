<template>
  <div>
    <el-container v-if="state != 'browse'">
      <el-header>
        <el-row type="flex">  
          <div style="margin-right:10px;"><el-button type="primary" @click="getPlanilhaGeral">Gerar Planilha</el-button></div>
        </el-row>
      </el-header>
      <el-main>
        
        <el-row class="container" type="flex" justify="center" align="middle">
          <el-col :sm="24" :md="24" :lg="18">
              <el-form :model="form" :rules="rules" ref="form"
                label-position="top" size="small" label-width="140px">
                <el-form-item label="Data Inicial" prop="dataInicial" :error="getErro('dataInicial')">
                  <el-date-picker v-model="form.dataInicial" type="date" format="dd/MM/yyyy" value-format="yyyy-MM-dd" ref="edtdatainicial" style="width: 100%;" ></el-date-picker>
                </el-form-item>
                <el-form-item label="Data Final" prop="dataFinal" :error="getErro('dataFinal')">
                  <el-date-picker v-model="form.dataFinal" type="date" format="dd/MM/yyyy" value-format="yyyy-MM-dd" style="width: 100%;" ></el-date-picker>
                </el-form-item>
              </el-form>
          </el-col>
        </el-row>

      </el-main>
    </el-container>

    <el-container v-if="state == 'browse'">
      <el-header>
        <el-row type="flex">  
          <el-button type="primary" @click="handleSelect">Selecionar Período</el-button>
          <el-button type="primary" @click="handlePlanilhaGeral">Baixar Planilha</el-button>
          <div style="margin-left:10px; line-height:1em;">Período: {{periodoSelecionado()}} </div>
        </el-row>
      </el-header>
      <el-main>
        <el-row type="flex" justify="center" align="middle">
          <el-col :sm="24" :md="24" :lg="24">

            <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabClick">

              <el-tab-pane label="Movimentação" name="movimentacao">
                <el-table :data="dadosResumo" 
                  style="width: 100%" border size="small" 
                  :default-sort="{prop: 'pessoaNome', order: 'ascending'}"
                  :height="tableHeight">

                  <el-table-column prop="hospedagemId" label="Atendimento" fixed align="right" width="90" ></el-table-column>
                  <el-table-column prop="pessoa.id" label="Pessoa" fixed width="100" align="right" sortable></el-table-column>
                  <el-table-column prop="pessoa.nome" label="Nome" fixed width="300" sortable></el-table-column>
                  <el-table-column prop="pessoa.dataNascimento" :formatter="fmtDateFull" label="Nascimento" width="120"></el-table-column>
                  <el-table-column prop="pessoa.idade" label="Idade" align="right" width="80" header-align="left"></el-table-column>
                  <el-table-column prop="pessoa.faixaEtaria" label="Faixa Etária" width="120"></el-table-column>
                  <el-table-column prop="tipoUtilizacao" label="Tipo" width="120" ></el-table-column>
                  <el-table-column prop="entidadeNome" label="Encaminhador" sortable width="300" ></el-table-column>
                  <el-table-column prop="pessoa.cidade" label="Cidade de Origem" width="200"></el-table-column>
                  <el-table-column prop="pessoa.uf" label="UF Origem" width="80"></el-table-column>
                  <el-table-column prop="tipoHospedeDescricao" label="Tipo de Hospedagem" width="140" ></el-table-column>
                  <el-table-column prop="dataIni" :formatter="fmtDate" label="Dt. Ingresso" width="140" header-align="left" sortable></el-table-column>
                  <el-table-column prop="dataFim" :formatter="fmtDate" label="Dt. Desligamento" width="140" class-name="wordwrap" sortable></el-table-column>
                  <el-table-column prop="dias" label="Dias" align="right" width="90" ></el-table-column>
                </el-table>
              </el-tab-pane>

              <el-tab-pane v-for="(planilha, index) in planilhas" :key="index" :label="planilha.titulo">
                <el-table :data="planilha.lista" 
                  style="width: 100%" border size="small" 
                  :default-sort="{prop: 'quantidade', order: 'descending'}"
                  :height="tableHeight">
                  <el-table-column prop="nome" :label="planilha.labelChave" sortable width="300"></el-table-column>
                  <el-table-column prop="quantidade" label="Quantidade" align="right" sortable width="150" ></el-table-column>
                </el-table>
              </el-tab-pane>  

            </el-tabs>

          </el-col>
        </el-row>
      </el-main>
    </el-container>

  </div>

</template>

<script>

export default {

  name: 'PlanilhaGeral',

  created(){
    this.form.dataInicial = petraDateTime.primeiroDiaMesAnterior()
    this.form.dataFinal = petraDateTime.ultimoDiaMesAnterior()
  },

  mounted(){
    this.$store.dispatch('setAcao','Planilha Geral')

    this.windowHeight = window.innerHeight

    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        this.tableHeight = window.innerHeight - 200
      })
    })

  },

  data: () =>({
    dados: [],

    erros: [],

    state : 'edit',

    activeTabName: 'movimentacao',

    form : {
      dataInicial : null,
      dataFinal : null
    },

    dadosResumo: [],
    planilhas: [],

    dadosPlanilhaGeral:[],
    dadosRankingCidades:[],
    dadosRankingEncaminhamentos:[],

    windowHeight: 0,
    tableHeight : window.innerHeight - 270,

    rules: {
      dataInicial: [
        { required: true, message: "Data Inicial deve ser preenchida",trigger: "blur"},
      ],
      dataFinal: [
        { required: true, message: "Data Final deve ser preenchida",trigger: "blur"},
      ],
    },

    toolTipDelay: 500

  }),

  watch: {
    windowHeight(newHeight, oldHeight) {
      this.tableHeight = `${newHeight-270}`
    }    
  },  

  methods: {

    resetData(){

      this.form.dataInicial = petraDateTime.primeiroDiaMesAnterior()
      this.form.dataFinal = petraDateTime.ultimoDiaMesAnterior()
      /*
      this.form = {
        dataInicial : null,
        dataFinal : null
      }
      */
      this.erros = []
    },

    fmtDate(row, col, cellValue, index){
      return petraDateTime.formatDate(cellValue, "DD/MM");
    },

    fmtDateFull(row, col, cellValue, index){
      return petraDateTime.formatDate(cellValue, "DD/MM/YYYY");
    },

    getErro(campo){
      var retorno =  _.find(this.erros,{fieldName : campo})
      if (retorno){
        return retorno.errorMessage
      }
      return null
    },

    handleTabClick(tab, event) {
    },

    handleEdit(row){
      this.resetData()
      this.doGetById(row.id)
    },

    handleSelect(){
      this.state = "insert"
      this.resetData()
      //this.setDefaultData()
      this.$nextTick(() => {
        setTimeout(() => this.$refs.edtdatainicial.focus(), 500)
      })      
    },

    periodoSelecionado(){
      const dataInicial = petraDateTime.formatDate(this.form.dataInicial, "DD/MM/YYYY"); 
      const dataFinal = petraDateTime.formatDate(this.form.dataFinal, "DD/MM/YYYY"); 
      return dataInicial + " até " + dataFinal
    },

    getFileName(){
      const dataInicial = petraDateTime.formatDate(this.form.dataInicial, "YYYY-MM-DD"); 
      const dataFinal = petraDateTime.formatDate(this.form.dataFinal, "YYYY-MM-DD"); 
      return `planilhaGeral${dataInicial}_${dataFinal}.xls`
    },

    handleSave(){
      this.doSave()
    },
    
    getPlanilhaGeral(){
      this.getDadosPlanilhaGeral(this.form.dataInicial, this.form.dataFinal)
    },

    getDadosPlanilhaGeral(dataIni, dataFim) {
      var dados = {
        dataIni : dataIni,
        dataFim : dataFim
      }
      petra.axiosPost("/app/hospedagem/planilha_geral", dados)
        .then(response => {
          console.log(response.data)
          this.dadosResumo = response.data.resumoHospedagens
          this.planilhas = response.data.planilhas
          //this.dadosPlanilhaGeral = response.data.planilhaGeral
          //this.dadosRankingCidades = response.data.rankingCidades;
          //this.dadosRankingEncaminhamentos = response.data.rankingEncaminhamentos;

          this.state="browse"
        })
        .catch(error => {
          this.erros = petra.tratarErros(error)
        })
    },

    handlePlanilhaGeral(){
      var dados = {
        dataIni : this.form.dataInicial,
        dataFim : this.form.dataFinal
      }

      petra.axiosBlobPost("/app/hospedagem/planilha_geral_arquivo", dados)
        .then(response => {
            
            var blob = new Blob([response.data], {
              type: 'application/xls'
            });

             var FileSaver = require('file-saver');
             
             var fileName = this.getFileName();

             FileSaver.saveAs(blob, fileName);
        })
        .catch(error => {
          console.log("ERRO")
          console.log(error)
          this.erros = petra.tratarErros(error)
        })
    }


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

</style>
