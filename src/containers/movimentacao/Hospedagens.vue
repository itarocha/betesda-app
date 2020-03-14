<template>
  <div>
    <el-container v-if="state == 'browse'">
      <el-header>
        <el-row type="flex" style="line-height:1em;">
          <el-button type="primary" @click="getDadosSemanaAnterior(dados.dataIni)">Semana Anterior</el-button>
          <el-button type="primary" @click="getDadosHoje()">Hoje</el-button>
          <el-button type="primary" @click="getDadosProximaSemana(dados.dataFim)">Semana Seguinte</el-button>

          <div class="block-date">
            <span style="width:200px; text-align:right; margin-right: 10px; padding-top:10px;">Data Selecionada:</span>
            <el-date-picker v-model="dataAtual" type="date" format="dd/MM/yyyy" value-format="yyyy-MM-dd" style="width: 100%;" ></el-date-picker>
          </div>
        </el-row>

      </el-header>
      <el-main>
        <el-row type="flex" :gutter="10">
          <el-col :sm="24" :md="24" :lg="24">

            <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabClick">
              <el-tab-pane label="Mapa de Hospedagem" name="mapa">

                <el-container style="margin:2px;" v-if="renderMapa">
                  <el-container :style="styleContainerMapa">

                    <el-header style="line-height:20px; height:54px;">
                      <el-row type="flex">
                        <el-col>
                          <div class="thebox p4 laranja h60">
                            <span style="font-size: 12pt; align:center;">Quarto/</span>
                            <span style="font-size: 12pt; align:center;">Leito</span>
                          </div>
                        </el-col>

                        <el-col v-for="(dia, index) in dados.dias" :key="index" 
                          :class="{'white-text': isDataAtual(dia), 'teal-darken-2':isDataAtual(dia), 'amber-lighten-4':!isDataAtual(dia) }">
                          <div class="thebox p4 h60 " style="cursor:pointer; line-height:8px" @click="selecionarDia(dia, index)">
                            <p style="font-size: 9pt">{{diaSemana(dia)}}</p>
                            <p style="font-size: 12pt">{{formatDate(dia,'DD/MMM')}}</p>
                          </div>
                        </el-col>
                        <div class="w15"></div>
                      </el-row>                      
                    </el-header>
                    
                    <el-main style="padding-top:0px;">

                      <div :style="styleGrid" class="scroll-y p0">
                        <div class="container-mapa" v-for="(celula, index) in linhas" :key="index">
                          <div class="titulo">
                              <center v-if="celula.quartoNumero != '9999'">{{celula.quartoNumero}}-{{celula.leitoNumero}}</center>
                              <center v-if="celula.quartoNumero == '9999'">Parcial</center>
                          </div> 
                          <div>
                            <div class="container-linha" v-if="celula.hospedagens.length == 0">
                              <div v-for="(dia, idxDia) in dados.dias" :key="idxDia" class="celula-borda-cinza">
                                
                              </div>  
                            </div>

                            <div class="container-linha" v-for="(h, idx) in celula.hospedagens" :key="idx" >
                              <div v-for="(dia, idxDia) in dados.dias" :key="idxDia" class="celula-borda-cinza">
                                <div slot="reference" v-if="idxDia >= h.idxIni &&  idxDia <= h.idxFim" @click="showHospedagemInfo(h.hpdId)" style="cursor:pointer;"> 
                                    <div  v-if="h.idxIni == idxDia" :class="hospedagemClass(h.clsIni, h.clsFim, h.status)" 
                                          :style="calculateWidth(h.width, h.clsIni, h.clsFim)">
                                          <p v-if="idxDia == h.idxIni" class="texto-linha">{{h.nome}}</p>
                                    </div>
                                </div>  
                              </div>

                              <!--
                              <div v-for="(classe, idxClasses) in h.classes" :key="idxClasses" class="celula-borda-cinza">

                                <el-popover
                                    v-if="h.identificador != null && classe != ''"
                                    placement="top-start"
                                    width="300"
                                    :title="'HPD: '+ h.identificador"
                                    trigger="hover"
                                    :open-delay="1000"
                                    :content="h.nome">
                                    <div slot="reference" :class="newHospedagemClass(classe, h.statusHospedagem)" 
                                          @click="showHospedagemInfo(h.hospedagemId)">
                                          <p v-if="idxClasses == h.idxIni" class="texto-linha">{{getPrimeiroNome(h.nome)}}</p>
                                    </div>
                                </el-popover>

                              </div>
                              -->
                            </div>
                          </div>
                        </div>  
                      </div>

                    </el-main>
                  </el-container>
                </el-container>
              </el-tab-pane>

              <!-- :row-class-name="tableRowClassName"  -->
              <el-tab-pane label="Hóspedes na Semana" name="hospedes">
                <el-row type="flex" justify="center" align="middle">
                  <el-col :sm="24" :md="24" :lg="24" v-if="renderHospedes">


                    <el-table :data="hospedes" 
                       style="width: 100%" border size="small" :default-sort="{prop: 'pessoaNome', order: 'ascending'}"
                      :height="tableHeight"
                      :row-class-name="tableRowClassName">

                      <el-table-column fixed prop="pessoaNome" label="Nome" width="250" sortable></el-table-column>
                      <el-table-column prop="pessoaTelefone" label="Telefone" width="120" ></el-table-column>

                      <el-table-column prop="pessoaCidadeUfOrigem" label="Cidade Origem" width="200" sortable></el-table-column>

                      <el-table-column prop="dataPrimeiraEntrada" :formatter="fmtDate" label="Entrada" width="110" header-align="left" sortable></el-table-column>
                      <el-table-column prop="dataPrevistaSaida" :formatter="fmtDate" label="Prev.Saída" width="110" class-name="wordwrap" sortable></el-table-column>
                      <el-table-column prop="dataEfetivaSaida" :formatter="fmtDate" label="Hpd.Saída" width="110" sortable></el-table-column>
                      <!--<el-table-column prop="leitoDataSaida" :formatter="fmtDate" label="Saída" width="110" class-name="wordwrap" sortable></el-table-column>-->

                      <el-table-column prop="tipoUtilizacaoDescricao" label="Utilização" width="120" sortable></el-table-column>
                      <!--<el-table-column prop="leitoId" :formatter="fmtLeito" width="140" label="Quarto-Leito" sortable></el-table-column>-->
                      <el-table-column prop="destinacaoHospedagemDescricao" width="120" label="Destinação" sortable></el-table-column>

                      <el-table-column prop="statusHospedagem" label="Situação" width="120" sortable></el-table-column>

                      <!--<el-table-column prop="dataEntradaHospedagem" :formatter="fmtDate" label="Hpd.Início" width="120" header-align="left" sortable></el-table-column>-->

                      <!--<el-table-column header-align="left" align="right" prop="id" label="CODMOV" width="100" sortable></el-table-column>-->
                      <el-table-column header-align="left" align="right" prop="hospedagemId" label="CODHPD" width="100" sortable></el-table-column>
                      <el-table-column header-align="left" align="right" prop="pessoaId" label="CODPES" width="100"></el-table-column>

                      <el-table-column label="Ações" fixed="right" align="center" width="120">
                        <template slot-scope="scope">
                          
                          <el-tooltip content="Ver Detalhes" placement="bottom" :open-delay="300">
                            <el-button type="primary" plain size="mini" circle @click="showHospedagemInfo(scope.row.hospedagemId)">
                              <i class="fas fa-info"></i>
                            </el-button>
                          </el-tooltip>

                          <el-tooltip content="Editar Pessoa" placement="bottom" :open-delay="300">
                            <el-button type="primary" plain size="mini" circle @click="handleEditPessoa(scope.row.pessoaId)">
                              <i class="fas fa-pencil-alt"></i>
                            </el-button>
                          </el-tooltip>

                        </template>
                      </el-table-column>
                    </el-table>

                  </el-col>
                </el-row>
              </el-tab-pane>

              <el-tab-pane label="Hóspedes por Cidade de Origem" name="cidades">
                  <el-container :style="styleContainerMapa" v-if="renderCidades">
                    <el-main style="padding-top:0px;">          
                        <el-row :gutter="10">
                          <el-col :span="12">
                              <el-select v-model="formCidade" style="margin: 8px; width:100%">
                                <el-option v-for="(cidade, idxCidade) in cidades" :key="idxCidade" :label="cidade.nome" :value="cidade.nome"></el-option>
                              </el-select>
                          </el-col>
                        </el-row>
                        <el-row :gutter="10">
                          <el-col :span="24">
                            <div class="flex-container wrap">

                              <card-hospede v-for="(hq, idx) in hospedagensCidade" :key="idx" 
                                :model=hq
                                @editPessoa="handleEditPessoa" 
                                @showHospedagemInfo="showHospedagemInfo">
                              </card-hospede>

                            </div>
                          </el-col>    
                        </el-row>
                    </el-main>  
                </el-container>  
              </el-tab-pane>

              <el-tab-pane label="Quadro de Hospedagens" name="quadro">
                  <el-container :style="styleContainerMapa" v-if="renderQuadro">

                    <el-header style="line-height:20px; height:54px;">
                      <el-row type="flex">
                        <el-col v-for="(dia, index) in dados.dias" :key="index" 
                          :class="{'white-text': isDataAtual(dia), 'teal-darken-2':isDataAtual(dia), 'amber-lighten-4':!isDataAtual(dia) }">
                          <div class="thebox p4 h60 " style="cursor:pointer; line-height:8px; text-align:center; font-size: 10pt;"  @click="selecionarDia(dia, index)">
                            <p>{{diaSemana(dia)}}</p>
                            <p>{{formatDate(dia,'DD/MMM')}}</p>
                          </div>
                        </el-col>
                      </el-row>                      
                    </el-header>

                    <el-main style="padding-top:10px;">

                      <el-col :sm="10" :md="10" :lg="10">

                        <el-row type="flex" v-for="(quarto, index) in quadro.quartos" :key="index">
                          <el-col v-for="(leito, lid) in quarto.leitos" :key="lid">
                            <div v-if="leito.id != 0" :class="quadroClass(0, index, lid)" style="text-align:center; cursor:pointer;" @click="getHospedagensByLeitoId(leito.id)">
                              {{quarto.numero}}-{{leito.numero}}
                            </div>
                            <div class="thebox-circular cinza" v-if="leito.id == 0">
                              
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :sm="14" :md="14" :lg="14">
                          <div class="subtitulo bg-purple">Quarto {{quadroQuartoNumero}} Leito {{quadroLeitoNumero}}</div>

                          <div class="flex-container-center wrap">
                            <card-hospede v-for="(hq, idx) in hospedagensQuadro" :key="idx" 
                              :model=hq
                              @editPessoa="handleEditPessoa" 
                              @showHospedagemInfo="showHospedagemInfo">
                            </card-hospede>
                          </div>

                      </el-col>

                    </el-main>  
                </el-container>  
              </el-tab-pane>
            </el-tabs>

          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <tela-hospedagem v-if="state=='info'" @close="onCloseInfo" :id="hospedagemSelecionada"></tela-hospedagem>

    <div>
      <el-dialog title="Detalhes da Pessoa" :visible.sync="editPessoa" width="800px">
        <el-row type="flex">
          <el-col>
            <frame-pessoa :id="pessoaId" :canSelecionar="false" @cancel="onCancelPessoa" @save="onSavePessoa"></frame-pessoa>      
          </el-col>
        </el-row>
      </el-dialog>
    </div>

  </div>

</template>

<script>
  import TelaHospedagem from "../hpd/TelaHospedagem.vue"
  import FramePessoa from "../cadastros/FramePessoa"
  import CardHospede from "./CardHospede"


export default {
  name: 'Hospedagens',

  components: {
    TelaHospedagem,
    FramePessoa,
    CardHospede
	},

  created(){
  },

  mounted(){
    this.$store.dispatch('setAcao','Hospedagens')

    this.windowHeight = window.innerHeight

    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        this.tableHeight = window.innerHeight - 300
      })
    })

  },


  data: () =>({

    dados: [],

    erros: [],

    formCidade: null,

    activeTabName: 'mapa',
    renderMapa: true, // Primeiro
    renderHospedes: false,
    renderCidades: false,
    renderQuadro: false,

    showTelaHospedagem : false,
    state : "browse",
    hospedagemSelecionada : null,

    windowHeight: 0,
    styleGrid : 'max-height: 337px',
    styleContainerMapa : 'height:300px',
    
    tableHeight : window.innerHeight - 300,

    txt : '???',
    editPessoa : false,
    pessoaId : 0,
    dataAtual: null,
    
    //diaIndex representa o índice do dia clicado
    diaIndex: 0,
    quadroQuartoNumero : null,
    quadroLeitoNumero : null,

    form: {
      dataBase: null
    },
    dados: [],
    //pessoas:[],
    cidades:[],
    quadro:[],
    hospedagensCidade: [],
    hospedagensQuadro: [],
    hospedes:[],

    linhas:[],

    colorCache: {},

    toolTipDelay: 500,

    showDate: null, 

  }),

  watch: {

    activeTabName(val){
      this.renderMapa = val == 'mapa'
      this.renderCidades = val == 'cidades'
      this.renderHospedes = val == 'hospedes'
      this.renderQuadro = val == 'quadro'
    },

    dataAtual(){
      this.hospedagensQuadro = []
      this.hospedagensCidade = []
      this.quadroQuartoNumero = null
      this.quadroLeitoNumero = null
      this.formCidade = null

      const d = moment(this.dataAtual).toDate()
      this.diaIndex = petraDateTime.getIndiceData(this.dataAtual)

      this.setShowDate(d)
      this.getDadosSemanaAtual()
    },

    formCidade(){
      this.getHospedagensByCidade(this.formCidade)
    },

    windowHeight(newHeight, oldHeight) {
      this.txt = `mudou de ${oldHeight} para ${newHeight}`
      this.styleGrid = `max-height: ${newHeight - 272}px`
      this.styleContainerMapa = `height: ${newHeight-270}px`
      this.tableHeight = `${newHeight-270}`
    }    
  },

  created(){
    this.dataAtual = petraDateTime.hoje()
  },

  computed: {

    imageHeight () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '220px - xs'
        case 'sm': return '400px - sm'
        case 'md': return '500px - md'
        case 'lg': return '600px - lg'
        case 'xl': return '800px - xl' 
      }
    },

    alturaGrid () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'max-height: 337px'
        case 'sm': return 'max-height: 337px'
        case 'md': return 'max-height: 337px'
        
        case 'lg': return 'max-height: 337px'
        case 'xl': return 'max-height: 673px'
      }
    },
    
		userLocale() {
			return this.getDefaultBrowserLocale
		},
		dayNames() {
			return this.getFormattedWeekdayNames(this.userLocale, "long", 0)
		},
		themeClasses() {
			return {
				"theme-default": this.useDefaultTheme,
				"holiday-us-traditional": this.useHolidayTheme,
				"holiday-us-official": this.useHolidayTheme,
			}
		},
  },

  methods: {

    handleTabClick(tab, event) {
    },

    handleEditPessoa(id) {
      this.pessoaId = id
      this.editPessoa = true;
    },

    onCancelPessoa(id) {
      this.pessoaId = null
      this.editPessoa = false
    },

    onSavePessoa(id) {
      this.pessoaId = null
      this.editPessoa = false
      this.refreshMapa()
    },


    selecionarDia(dia, index){
      this.dataAtual = dia
    },

    //TODO Somente se dataAtual não estiver na lista de datas da semana. A não ser que force
    getDadosSemanaAtual(){
      var existe = this.contemElemento(this.dataAtual, this.dados.dias)
      if (!existe){
        this.getData(this.dataAtual)
      }
    },

    refreshMapa(){
      this.getData(this.dataAtual)
    },

    contemElemento(obj, list) {
      for (var x in list) {
          if (list[x] === obj) {
              return true;
          }
      }
      return false;
    },

    getDadosHoje(){
      this.dataAtual = petraDateTime.hoje()
    },

    getDadosSemanaAnterior(data){
      this.dataAtual = petraDateTime.semanaAnterior(data)
    },

    getDadosProximaSemana(data){
      this.dataAtual = petraDateTime.semanaSeguinte(data)
    },

    isDataAtual(data){
      return data == this.dataAtual ? true : false
    },

    isIndiceDataAtual(indice){
      return indice == petraDateTime.getIndiceData(this.dataAtual)
    },

    getData(data) {
      var dados = {
        data : data
      }
      petra.axiosPost("/app/hospedagem/mapa", dados)
        .then(response => {

            this.dados = response.data
            this.linhas = response.data.linhas;
            //this.hospedes = response.data.pessoas;
            this.hospedes = response.data.hospedes;

            this.cidades = response.data.cidades;

            if (this.cidades.length > 0){
              this.formCidade = this.cidades[0].nome
            }

            //this.pessoas = response.data.hospedagens

            this.quadro = response.data.quadro
            
        })
        .catch(error => {

        })
    },

    tableRowClassName({row, rowIndex}) {

      if (row.statusHospedagem == "ABERTA"){
        return 'green-row'
      } else
      if (row.statusHospedagem == "VENCIDA"){
        return 'red-row'
      } 
      return ''
    },
    
    fmtDate(row, col, cellValue, index){
      return petraDateTime.formatDate(cellValue, "DD/MM");
    },


    fmtLeito(row, col){
      return (row.leitoId != 0 ? row.quartoNumero + "-" + row.leitoNumero : "")
    },

    recarregar(){
      this.getDadosSemanaAtual()
    },

    onEncerrada(hospedagemId){
      this.refreshMapa()
    },

    onCloseHospedagemInfo(){
      this.refreshMapa();
    },

    formatDate(data,formato){
      return petraDateTime.formatDate(data,formato)
    },

    diaSemana(dia){
      return petraDateTime.diaSemana(dia)
    },

    quadroClass(dia, quarto, leito){
      const conteudo = this.quadro.quartos[quarto].leitos[leito].dias[this.diaIndex];

      if (conteudo == 1){
        return "thebox-circular teal-darken-2 fonte-branca";  
      }
      return "thebox-circular";
    },

    // NOVO
    newHospedagemClass(classe, status){

      const classeStatus =  this.newColorStatusItem(status)
      const retorno = 'grafico ' + classeStatus + ' ';
      
      if (classe != null){
        return retorno + 'grafico_' + classe;
      }

      return ''
    },  

    hospedagemClass(classeIni, classeFim, status){
      const classeStatus =  this.newColorStatusItem(status)
      const retorno = 'grafico ' + classeStatus + ' ';
      
      return retorno + 'grafico_' + classeIni + classeFim;
    },

    newColorStatusItem(status){
      if (status == 'ABERTA'){
        return 'bg-aberta' // '#FFF9C4' teal darken-2
      } else if (status == 'ENCERRADA'){
        return 'bg-encerrada' //'#d3dce6' // blue-grey lighten-1
      } else if (status == 'VENCIDA'){
        return 'bg-vencida' // '#FFCCBC' red accent-4
      }
      return 'blue'
    },

    calcularAlturaLeito(index){
      let qtd = 0

      if (this.dados && this.dados.leitos){
        qtd = this.dados.leitos[index].hospedagens.length
      }

      if (qtd <= 1) {
        return '28px'
      } else {
        return  (qtd*28)+'px'
      }
    },

    newCalcularAlturaLeito(qtd){
      if (qtd <= 1) {
        return '28px'
      } else {
        return  (qtd*28)+'px'
      }
    },

    getHospedagensByLeitoId(id){
      const hospedagensQuadro = []
      let quadroQuartoNumero = null
      let quadroLeitoNumero = null

      const diaIndex = this.diaIndex

      const lst = _.filter(this.dados.hospedes, {leitoId : id})

      for (var i = 0; i < lst.length; i++){
        const hospedagem = lst[i];

        const zeroOuUm = hospedagem.dias[diaIndex]
        if (zeroOuUm == 1){

          quadroQuartoNumero = hospedagem.quartoNumero
          quadroLeitoNumero = hospedagem.leitoNumero

          hospedagensQuadro.push(hospedagem)
        }
      }

this.hospedagensQuadro = hospedagensQuadro
      this.quadroQuartoNumero = quadroQuartoNumero
      this.quadroLeitoNumero = quadroLeitoNumero

      return this.hospedagensQuadro
    },

    //TODO OTIMIZAR. DEVE PROCURAR PELA LISTA DE LEITOS
    getHospedagensByCidade(nome_cidade){
      const hospedagensCidade = []
      const cidade = _.find(this.cidades, {nome:nome_cidade})

      if (cidade){
        _.forEach(cidade.ids, function(id){
            const hospedagem = _.find(this.dados.hospedes, {identificador : id})
            
            if (hospedagem){
              hospedagensCidade.push(hospedagem)
              return
            }
        })
      }

      this.hospedagensCidade = hospedagensCidade
      return this.hospedagensCidade
    },

    /*
    // percent
    getPrimeiroNome(nome, percent){
      if (nome.length > 10 && percent <= 100){
        nome = nome.substr(0,10) + "..."
      }
      return nome;
    },
    */

    showHospedagemInfo(id){
      if (id){
        this.state = "info"
        this.hospedagemSelecionada = id;
        this.showTelaHospedagem = true;
      }
    },

    calculateWidth(width, classeIni, classeFim){
      let toReduce = 8

      if (classeIni == "vindo"){
        toReduce = toReduce + 4
      }

      if (classeFim == "indo" || classeFim == "baixado"){
        toReduce = toReduce + 4
      }

      const w = width + ((width / 700) * 11)

      const retorno = toReduce > 0 ? `width: calc(${w}% - ${toReduce}px);` : `width: ${w}%;`
      return retorno
    },

    onCloseInfo(){
      this.state = "browse"
      this.hospedagemSelecionada = null;
      this.$store.dispatch('setAcao','Hospedagens')
      this.refreshMapa()
    },

    		setShowDate(d) {
			this.message = `Changing calendar view to ${d.toLocaleDateString()}`
      this.showDate = d
      this.dataAtual = moment(d).format("YYYY-MM-DD")
    },

  }
}
</script>

<style scoped>

  .block-date {
    display:flex;
    margin-left:10px;
    padding-left:4px;
  }

  .el-card__header {
    padding: 5px;
  }

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

:root {
  --margin: 2px;
}

.w15{
  min-width:15px;
  color:red;
}

.fonte-azul{
  color: blue;
}

.fonte-branca{
  color: white;
}

.grade {
  width: 100%;
}

.container-box {
  display: flex;
  flex-wrap: wrap;
}

.thebox {
  box-sizing: border-box;
  border-radius: 0px;
  margin: 0px;
  height: 30px;
  border: 1px #bdbdbd solid;
}

.thebox-circular {
  box-sizing: border-box;
  border-radius: 25px;
  margin: 0px;
  height: 30px;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 3px;
  padding-top:5px;
  border: 1px #bdbdbd solid;
  font-size: 10pt;
}

.h60 {
  height: 54px;
}

.hleito{
  height:28px;
}

.p0{
  padding:0px;
}

.p1{
  padding: 1px;
}

.p4 {
  padding:4px;
}

.laranja {
  background-color: #FFECB3;
}

.cinza {
  background-color: #d3dce6;
}

.grafico{
  margin-top: 1px;
  margin-bottom:1px;
  /*
  margin-left:-1px;
  margin-right:-1px;
  */
  margin-top: 0px;
  cursor:pointer;
  padding: 0px;
  margin-left:2px;
}

.grafico_inicio {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  /*
  width: calc(100% - 2px);
  margin-left: 3px;
  */
}

.grafico_iniciodurante {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  /*
  width: calc(100% - 2px);
  margin-left: 3px;
  */
}

.grafico_fim {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  /*
  width: calc(100% - 3px);
  */
}

.grafico_durantefim {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  /*
  width: calc(100% - 3px);
  */
}

.grafico_iniciofim {
  border-radius : 10px;
  /*
  margin-left: 3px;
  width: calc(100% - 6px);
  */
}

/*  https://css-tricks.com/the-shapes-of-css/ */
.grafico_inicioindo {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  /*
  width: calc(100% - 6px);
  margin-left: 3px;
  */  
  border-color:#000;
  border-style: dotted;
  border-width: 0px 4px 0px 0px;
}

.grafico_iniciobaixado {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  /*
  width: calc(100% - 6px);
  margin-left: 3px;
  */
  border-color:#000;
  border-style: dotted;
  border-width: 0px 4px 0px 0px;
}

.grafico_indo {
  border-color:#000;
  border-style: dotted;
  border-width: 0px 4px 0px 0px;
}

.grafico_indovindo {
  border-color:#000;
  border-style: dotted;
  border-width: 0px 4px 0px 4px;
}

.grafico_vindoindo {
  border-color:#000;
  border-style: dotted;
  border-width: 0px 4px 0px 4px;
}

.grafico_duranteindo{
  border-color:#000;
  border-style: dotted;
  border-width: 0px 4px 0px 0px;
}

.grafico_baixado {
  border-color:#000;
  border-style: solid;
  border-width: 0px 4px 0px 0px;
}

.grafico_durantebaixado {
  border-color:#000;
  border-style: solid;
  border-width: 0px 4px 0px 0px;
}

.grafico_vindo {
  border-color:#000;
  border-style: dotted;
  border-width: 0px 0px 0px 4px;
}

.grafico_vindodurante {
  border-color:#000;
  border-style: dotted;
  border-width: 0px 0px 0px 4px;
}

.grafico_vindofim {
  border-color:#000;
  border-style: dotted;

  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  /*
  width: calc(100% - 6px);
  */

  border-width: 0px 0px 0px 4px;
}

.teal-darken-2 {
  background-color: #00796B;
}

.white-text{
    color:white;
}
.amber-lighten-4{
    background-color:#FFECB3;
}

.flex-container {
  padding: 0;
  margin: 0;
  list-style: none;
  box-orient: horizontal;
  display: flex;
  justify-content: space-between;
}

.flex-container-center {
  padding: 0;
  margin: 0;
  list-style: none;
  box-orient: horizontal;
  display: flex;
  justify-content: center;
}

.wrap    { 
  flex-wrap: wrap;
}  

.wrap li {
  background: gold;
}

.texto-pq{
  font-size: 10pt;
}

.subtitulo {
  margin:0 10px;
  padding:5px;
  text-align: center;
  border-radius: 4px;
}

.bg-purple {
  background: #d3dce6;
}

.bg-aberta{
    background: #4DB6AC;
}

.bg-encerrada {
  background: #B0BEC5; /*#b0bec5;*/
}

.bg-vencida {
  background: #FF8A80;
}

.container-mapa {
  display: grid;
  grid-template-columns: 1fr 7fr;
}

.container-linha {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 8pt;
}

.container-mapa .container-linha div{
  height: 28px;
}

.container-mapa div.titulo {
  display:grid;
  border: 1px solid #CFD8DC;
}

.celula-borda-cinza {
  border: 1px solid #CFD8DC;
}

.texto-linha{
  margin:0; 
  padding: 5px 10px;
  color:#263238; 
  font-size:9pt;
  height:1em;
  overflow: hidden;
  z-index:2;
}

table {
  font-size: 9pt;
  border: 1px solid #CFD8DC;
  border-radius: 3px;
  background-color: #fff;
  border-collapse: collapse;
}

th {
  background-color: #42b983;
  color: rgba(255,255,255,0.66);
  border: 1px solid #CFD8DC;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
  border: 1px solid #CFD8DC;
}

th, td {
  padding: 8px 10px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}


</style>