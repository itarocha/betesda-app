<template>
  <div>

    <el-tabs type="border-card" ref="tab" v-model="activeTabName" @tab-click="handleTabClick">
      <el-tab-pane v-for="(quarto, index) in itensQuarto" :key="index" :label="'Quarto ' + quarto.numero" :name="getNomeTab(quarto)" style="height:200px;">

        <div class="flex-container wrap">
          <el-card :class="classeSituacaoLeito(leito)" v-for="(leito, i) in leitos" :key="i" 
              shadow="never" style="width:120px;" @click.native="selecionarLeito(quarto, leito)" body-style="bodystyle">
            <div class="clearfix elcardheader">
              <span class="numero_leito">{{leito.numero}}</span>
            </div> 
            <div style="font-size:0.8em">{{leito.tipoLeito.descricao}}</div>                      
            <div style="font-size:0.8em">{{leito.tipoLeito.quantidadeCamas}} cama(s)</div>                      
          </el-card>
        </div>

      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>

export default {
  name: "TabSelecaoLeito",
  
  props : ['config'],

  hospedagemId : null,
  dataIni : null,
  dataFim : null,

  data: () =>({
    activeTabName: null,

    acomodacao : null,

    leitos : [],
    quartos : [],
    leitosOcupados : [],

  }),

  created(){
    this.openDialog()
  },

  mounted(){
    this.openDialog()
  },

  watch: {
    config:{
      deep: true,
      handler(){
        this.openDialog()
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

  },

  methods: {

    openDialog(){
      this.reset()

      var dataIni = this.config ? this.config.dataIni : null
      var dataFim = this.config ? this.config.dataFim : null
      var destinacaoHospedagemId = this.config ? this.config.destinacaoHospedagemId : null
      var hospedagemId = this.config ? (this.config.hospedagemId ? this.config.hospedagemId : null) : null

      var hoje = petraDateTime.hoje()
      this.dataIni = dataIni || hoje
      this.dataFim = dataFim || hoje
      this.hospedagemId = hospedagemId || 0

      console.log("loadLeitosOcupados")
      this.loadLeitosOcupados(() =>{
        this.loadQuartosPorTipoUtilizacao(destinacaoHospedagemId)
      })

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
      var leitoOcupado = this.getLeitoOcupado(id)

      if (leitoOcupado){
        console.log(leitoOcupado)
      }

      if (leitoSelecionado){
        return "flex-item leito-selecionado"
      } else {
        if (leitoOcupado){
          return leitoOcupado.esta == true ? "flex-item  leito-local" : "flex-item  leito-ocupado"
        } else {
          return "flex-item  leito-livre"
        }
      }
      //return leitoSelecionado ? "flex-item leito-selecionado" : leitoOcupado ? "flex-item leito-ocupado" : "flex-item  leito-livre"

      return "flex-item  leito-livre"
    },

    getLeitoOcupado(id){
      return _.find(this.leitosOcupados,{leitoId : id});
    },

    selecionarLeito(quarto, leito){
      var leitoOcupado = this.getLeitoOcupado(leito.id)

      /*
      if (!leitoOcupado || (leitoOcupado && leitoOcupado.esta)){
        this.acomodacao = {quarto: {id: quarto.id, numero: quarto.numero}, leito: {id: leito.id, numero: leito.numero}}
        this.$emit('select',this.acomodacao)
      }
      */

      // Agora poderá selecionar qualquer um. A validação ficará por conta do serviço
      this.acomodacao = {quarto: {id: quarto.id, numero: quarto.numero}, leito: {id: leito.id, numero: leito.numero}}
      this.$emit('select',this.acomodacao)

    },

    doSelecionarLeito(){
        this.$emit('onSelecionar', this.acomodacao)
    },

    // publico
    getSelecao(){
      var item = null
      
      for (var i = 0; i < this.quartos.length; i++) {
        if (this.quarto == this.quartos[i].id){
          item = {
            acomodacao : this.acomodacao
          }
          return item
        }
      }
      return null
    },

    loadLeitosOcupados(callback, reject) {

      var request = {
        hospedagemId : this.hospedagemId,
        dataIni : this.dataIni,
        dataFim : this.dataFim
      }

      console.log("chamando leitos ocupados")
      this.leitosOcupados = []
      petra.axiosPost("/app/hospedagem/leitos_ocupados", request).then(
        response => {
          console.log("leitos ocupados")
          console.log(response.data)
          this.leitosOcupados = response.data
          callback(response)
        })
    },

    reset(){
      this.hospedagemId = null
      this.tipoHospede = null
      this.acomodacao = null
      this.leitos = []
    },

  }  
};
</script>

<style scoped>

.elcardheader{
  padding:3px;
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
  /*line-height: 1.5em;*/
  /*background: #FFF8E1;*/
  /*background: #FFF9C4;*/
  color: #455A64;
  padding: 5px;

  width: 300px;
  /*height: 100px;*/
  margin: 5px;
  
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
  background:whitesmoke;
}

.leito-local {
  background:#4DB6AC;
  color: white;
}


</style>

