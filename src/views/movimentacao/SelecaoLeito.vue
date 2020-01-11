<template>
  <div >

      <el-row type="flex">
        <el-col v-if="acomodacao == null" style="font-weight:bold; padding-bottom:5px;">
          Clique sobre um leito para selecioná-lo
        </el-col>
        <el-col v-if="acomodacao != null" style="font-weight:bold; padding-bottom:5px;">
          Seleção: Quarto {{acomodacao.quarto.numero}} Leito {{acomodacao.leito.numero}}
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :sm="24" :md="24" :lg="24">
          <el-radio-group v-model="q">
            <el-radio-button v-for="(quarto,index) in itensQuarto" :key="index" :label="quarto">Quarto {{quarto.numero}}</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>  
      <el-row type="flex">
        <el-col :sm="24" :md="24" :lg="24">
          <div class="flex-container wrap">
            <el-card :class="classeSituacaoLeito(leito)" v-for="(leito, i) in leitos" :key="i" shadow="never" style="width:94px;" body-style="bodystyle"
               @click.native="newSelecionarLeito(leito)" >
              <div class="clearfix elcardheader" style="text-align:left;">
                <span class="numero_leito">{{leito.numero}}</span>
              </div> 
              <div style="font-size:0.8em">{{leito.tipoLeito.descricao}}</div>
              <div style="font-size:0.8em">{{leito.tipoLeito.quantidadeCamas}} cama(s)</div>
            </el-card>
          </div>
        </el-col>
      </el-row>  

      <!--  
      <el-row type="flex">

        <el-col :sm="24" :md="24" :lg="24">
          <el-tabs type="border-card" ref="tab" v-model="activeTabName" @tab-click="handleTabClick" >
            <el-tab-pane v-for="(quarto, index) in itensQuarto" :key="index" :label="'Quarto ' + quarto.numero" :name="getNomeTab(quarto)" :style="estilo">

              <div class="flex-container wrap">
                <el-card :class="classeSituacaoLeito(leito)" v-for="(leito, i) in leitos" :key="i" 
                    shadow="never" style="width:120px;" @click.native="selecionarLeito(quarto, leito)" body-style="bodystyle">
                  <div class="clearfix elcardheader">
                    <span class="numero_leito">{{leito.numero}}</span>
                  </div> 
                  <div style="font-size:0.8em">{{leito.tipoLeito.descricao}} - {{leito.tipoLeito.quantidadeCamas}} cama(s)</div>                      
                </el-card>
              </div>

            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>    
      -->
  </div>
</template>

<script>

export default {
  name: "SelecaoLeito",
  
  props : ['config', 'height'],

  dataIni : null,
  dataFim : null,



  data: () =>({

    dialogVisible : false,

    activeTabName: null,

    q : null,

    _quarto : null,


    nomeHospede : "",
    hospede : null,

    acomodacao : null,


    leitos : [],
    quartos : [],
    leitosOcupados : []
  }),

  created(){
    this.reset()
  },

  mounted(){
    this.openDialog(this.config.hospede, this.config.destinacaoHospedagemId, this.config.dataEntrada,this.config.dataPrevistaSaida)
  },

  watch: {
    config:{
      deep: true,
      handler(){
        //console.log('frameSelecaoLeito. mudou o config ', this.config)
        
      }
    },

    q:{
      deep:true,
      handler(){
        //console.log('q mudou ', this.q)
        this.refreshLeitos(this.q.id)
      }
    }
  },

  computed : {
    itensQuarto() {
      if (this.quartos){
        return this.quartos
      } else {
        return []
      }
    },

    estilo() {
      var height = this.height;
      var maxHeight = this.height - 10
      return `height:${height}px; max-height:${maxHeight}; overflow: auto;`
    }
  },

  methods: {

    openDialog(hospede, destinacaoHospedagemId, dataIni, dataFim){
      this.reset()

      var hoje = petraDateTime.hoje()
      this.dataIni = dataIni || hoje
      this.dataFim = dataFim || hoje

      this.loadLeitosOcupados(() =>{
        this.loadQuartosPorTipoUtilizacao(destinacaoHospedagemId)
      })

      this.hospede = hospede
      this.nomeHospede = hospede.pessoa.nome
      this.dialogVisible = true
    },

    handleTabClick(tab){
      var quarto = this.quartos[tab.index]
      if (quarto){
        this.leitos = quarto.leitos
      }
    },

    getNomeTab(quarto){
      var retorno = `quarto${quarto.numero}`
      return retorno
    },

    loadQuartosPorTipoUtilizacao(destinacaoHospedagemId){
      this.quartos = [];
      if (destinacaoHospedagemId != null){
        petra.axiosGet("/app/quarto/por_destinacao_hospedagem/"+destinacaoHospedagemId)
          .then(response => {
            this.quartos = response.data

            if (this.quartos.length > 0){
              var q = this.quartos[0]
              this.leitos = q.leitos
              this.activeTabName = `quarto${q.numero}`
            }
          })
      }
    },

    refreshLeitos(quartoId){
      var leitos = []
      for(var i=0; i < this.quartos.length; i++){
        if (this.quartos[i].id == quartoId){
          leitos = this.quartos[i].leitos
          console.log(leitos)
          break
        }
      }
      this.leitos = leitos
    },

    leitoSelecionado(id){
      return this.acomodacao && id == this.acomodacao.leito.id
    },

    classeSituacaoLeito(leito){
      var id = leito ? leito.id : -1

      var leitoSelecionado = this.leitoSelecionado(id)
      var leitoOcupado = this.isLeitoOcupado(id)
      return leitoSelecionado ? "flex-item leito-selecionado" : leitoOcupado ? "flex-item leito-ocupado" : "flex-item  leito-livre"
    },

    isLeitoOcupado(id){
      return (this.leitosOcupados.indexOf(id) >= 0);
    },

    selecionarLeito(quarto, leito){
      if (this.isLeitoOcupado(leito.id)){
        // mensagem
      } else {
        this.acomodacao = {quarto: {id: quarto.id, numero: quarto.numero}, leito: {id: leito.id, numero: leito.numero}}
        this.$emit('onSelecionar', this.acomodacao)
      }

    },

    newSelecionarLeito(leito){
      if (this.isLeitoOcupado(leito.id)){
        // mensagem
      } else {
        var quarto = this.q
        this.acomodacao = {quarto: {id: quarto.id, numero: quarto.numero}, leito: {id: leito.id, numero: leito.numero}}
        this.$emit('onSelecionar', this.acomodacao)
      }

    },
    

    // publico
    getSelecao(){
      var item = null
      
      for (var i = 0; i < this.quartos.length; i++) {
        if (this.quarto == this.quartos[i].id){
          item = {
            hospede : this.hospede,
            acomodacao : this.acomodacao
          }
          return item
        }
      }
      return null
    },

    loadLeitosOcupados(callback, reject) {

      var request = {
        dataIni : this.dataIni,
        dataFim : this.dataFim
      }

      this.leitosOcupados = []
      petra.axiosPost("/app/hospedagem/leitos_ocupados", request).then(
        response => {
          this.leitosOcupados = response.data
          callback(response)
        })
    },

    reset(){
      this.tipoHospede = null
      this.acomodacao = null
      this.$emit('onSelecionar', this.acomodacao)
      this.leitos = []
    },

  }  
};
</script>

<style scoped>

.elcardheader{
  padding:2px;
}

 .bodystyle{
   padding:0px;
 } 

.el-card .body {
  padding: 10px;
}
.el-card__head {
  padding: 10px;
}

.flex-container {
  padding: 0;
  margin: 0;
  list-style: none;
  /*border: 1px solid silver;*/
  box-orient: horizontal;
  /*-ms-box-orient: horizontal;*/
  display: flex;
  justify-content: start;
}

.wrap    { 
  flex-wrap: wrap;
}  

.wrap li {
  background: gold;
}

.flex-item {
  border-radius: 4px;
  line-height:1em;
  padding-right:5px;
  /*line-height: 1.5em;*/
  /*background: #FFF8E1;*/
  /*background: #FFF9C4;*/
  color: #455A64;
  padding: 0px;

  width: 300px;
  /*height: 100px;*/
  margin-top: 5px;
  margin-right: 0px;
  
  /*
  line-height: 100px;
  color: white;
  font-weight: bold;
  font-size: 2em;
  text-align: center;
  */
}

.leito-selecionado {
  background: #FFE57F;
}

.leito-ocupado {
  background: #D32F2F;
  color: white;
}

.leito-livre {
  background:white;
}


</style>

