<template>
  <div class="divmain">

    <el-container v-if="state == 'browse'">
      <el-header>
        <el-tooltip content="Incluir novo Quarto" placement="bottom" :open-delay="toolTipDelay">
          <el-button type="primary" @click="handleInsertQuarto">Incluir</el-button>
        </el-tooltip>
      </el-header>
      <el-main>
        <el-row type="flex" justify="center" align="middle">
          <el-col :sm="24" :md="24" :lg="24">

            <el-tabs type="border-card" ref="tab" v-model="activeTabName">
              <el-tab-pane v-for="(quarto, index) in dados" :key="index" :label="'Quarto ' + quarto.numero" :name="getNomeTab(quarto)">

                <el-row type="flex" style="margin-bottom:10px">
                  <el-col>
                  <el-button type="primary" size="mini" @click="handleInsertLeito(quarto)">Novo Leito</el-button>
                  <el-button type="primary" size="mini" @click="handleEditQuarto(quarto.id)">Alterar Quarto</el-button>
                  <el-button type="danger" size="mini" @click="handleConfirmDeleteQuarto(quarto)">Excluir Quarto</el-button>
                  </el-col>
                </el-row>

                <el-row type="flex" justify="center">
                  <el-col><span class="subtitle">Destinações de Hospedagem:</span><el-tag v-for="(dest, idx) in quarto.destinacoes" :key="idx" type="success" size="medium" class="destinacoes">{{dest.descricao}}</el-tag></el-col>
                </el-row>

                <div class="flex-container wrap">
                  <el-card class="flex-item" v-for="(leito, i)  in dados[index].leitos" :key="i" shadow="never" style="width:200px;">

                    <div slot="header" class="clearfix">
                      <span class="numero_leito">{{leito.numero}}</span>

                      <el-tooltip content="Excluir Leito" placement="bottom" :open-delay="toolTipDelay">
                          <el-button @click="handleConfirmDeleteLeito(leito)" style="float: right; margin-left:10px" plain size="mini" circle type="danger"><i class="fas fa-trash"></i></el-button>
                      </el-tooltip>
                      <el-tooltip content="Editar Leito" placement="bottom" :open-delay="toolTipDelay">
                          <el-button @click="handleEditLeito(leito.id)" style="float: right;" plain size="mini" circle type="primary"><i class="fas fa-pencil-alt"></i></el-button>
                      </el-tooltip>
                    </div> 
                    <div style="font-size:0.8em">{{leito.tipoLeito.descricao}} - {{leito.tipoLeito.quantidadeCamas}} cama(s)</div>                      
                  </el-card>
                </div>
                
              </el-tab-pane>
            </el-tabs>            

<!--

        <v-tabs fixed-tabs v-model="active" v-on:input="inputTabEvent" slider-color="cyan darken-2">
          <v-tab v-for="(quarto, index)  in dados" :key="index" ripple>
            Quarto {{ quarto.numero }}
          </v-tab>

          <v-tab-item v-for="(quarto, index) in dados" :key="index" ripple>
            <v-layout row wrap class="subheading pa-2">
              <v-flex xs12 class="subheading ml-2">
                  Destinações de Hospedagem:
                  <v-chip color="amber lighten-2" v-for="(destinacaoHospedagem, idx) in quarto.destinacoes" :key="idx">{{destinacaoHospedagem.descricao}}</v-chip>
              </v-flex>

              <v-flex xs12>
                <v-btn small color="cyan darken-4" class="white--text" @click="incluirLeito(quarto)">Novo Leito<v-icon right dark>add</v-icon></v-btn>
                <v-btn small color="cyan darken-4" class="white--text" @click="editItem(quarto)">Alterar Quarto<v-icon right dark>edit</v-icon></v-btn>
                <v-btn small color="cyan darken-4" class="white--text" @click="deleteItem(quarto)">Excluir Quarto<v-icon right dark>delete</v-icon></v-btn>
              </v-flex>

              <v-container fluid grid-list-lg>
                <v-layout row wrap>
                  <v-flex xs3 v-for="(leito, i)  in dados[index].leitos" :key="i" >
                    <v-card :class="classeSituacaoLeito(leito.id)">
                      <h2 class="headline ml-2 mt-0">{{leito.numero}}</h2>  
                      <v-card-text class="body-1 mb-0">
                        <div>{{leito.tipoLeito.descricao}} - {{leito.tipoLeito.quantidadeCamas}} cama(s)</div>
                      </v-card-text>

                      <v-divider light></v-divider>
                      <v-card-actions class="grey lighten-4">
                        <v-spacer></v-spacer>

                        <v-tooltip bottom>
                          <v-btn icon slot="activator" @click="editLeito(quarto, leito)">
                            <v-icon>edit</v-icon>
                          </v-btn>
                          <span>Editar Leito</span>
                        </v-tooltip>
                        

                        <v-tooltip bottom>
                          <v-btn icon slot="activator" @click="deleteLeito(quarto, leito)">
                            <v-icon>delete</v-icon>
                          </v-btn>
                          <span>Excluir Leito</span>
                        </v-tooltip>

                        <v-tooltip bottom v-if="isLeitoOcupado(leito.id)" >
                          <v-btn icon slot="activator" @click="visualizarHospedagemNoLeito(leito.id)" >
                            <v-icon color="red darken-4">fa-users</v-icon>
                          </v-btn>
                          <span>Visualizar Hospedagem atual</span>
                        </v-tooltip>

                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>

            </v-layout>
          </v-tab-item>
        </v-tabs>
-->
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <!-- InsertQuarto -->
    <el-container v-if="state == 'insertQuarto'">
      <el-header>
        <el-row type="flex">  
          <el-tooltip content="Gravar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;"><el-button type="primary" @click="handleSaveInsertQuarto">Gravar</el-button></div>
          </el-tooltip>
          <el-tooltip content="Cancelar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;"><el-button @click="handleCancelQuarto">Cancelar</el-button></div>
          </el-tooltip>
          <div>Incluindo Quarto</div>
        </el-row>
      </el-header>
      <el-main>
        
        <el-form :model="formQuartoInsert" :rules="rules" ref="formQuartoInsert" label-position="top" size="small" label-width="140px">
          <el-row :gutter="10">
            <el-col :span="4">
                <el-form-item label="Número" :error="getErro('numero')">
                  <el-input-number v-model="formQuartoInsert.numero" ref="edtnumero" :min="1" :max="999" style="width:100%"></el-input-number>
                </el-form-item>
            </el-col>
            <el-col :span="20">
                <el-form-item label="Descrição" prop="descricao" :error="getErro('descricao')">
                  <el-input v-model="formQuartoInsert.descricao" ref="edtdescricao" ></el-input>
                </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
                <el-form-item label="Destinações de Hospedagem" prop="destinacoes" :error="getErro('destinacoes')">
                  <el-select v-model="formQuartoInsert.destinacoes" multiple placeholder="Selecione um ou mais" style="width:100%">
                    <el-option
                      v-for="item in itensDestinacaoHospedagem"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="4">
                <el-form-item label="Qtd.Leitos" :error="getErro('quantidadeLeitos')">
                  <el-input-number v-model="formQuartoInsert.quantidadeLeitos" :min="1" :max="20" style="width:100%"></el-input-number>
                </el-form-item>
            </el-col>
            <el-col :span="10">
                <el-form-item label="Tipo de Leito" prop="tipoLeito" :error="getErro('tipoLeito')">
                  <el-select v-model="formQuartoInsert.tipoLeito" placeholder="Selecione" style="width:100%">
                    <el-option
                      v-for="item in itensTipoLeito"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
                <el-form-item label="Situação Inicial dos Leitos" prop="situacao" :error="getErro('situacao')">
                  <el-select v-model="formQuartoInsert.situacao" placeholder="Selecione" style="width:100%">
                    <el-option
                      v-for="item in itensSituacaoLeito"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </el-main>
    </el-container>

    <!-- EditQuarto -->
    <el-container v-if="state == 'editQuarto'">
      <el-header>
        <el-row type="flex">  
          <el-tooltip content="Gravar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;"><el-button type="primary" @click="handleSaveEditQuarto">Gravar</el-button></div>
          </el-tooltip>
          <el-tooltip content="Cancelar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;"><el-button @click="handleCancelQuarto">Cancelar</el-button></div>
          </el-tooltip>
          <div>Alterando Quarto</div>
        </el-row>
      </el-header>
      <el-main>
        
        <el-form :model="formQuartoEdit" :rules="rules" ref="formQuartoEdit" label-position="top" size="small" label-width="140px">
          <el-row :gutter="10">
            <el-col :span="4">
                <el-form-item label="Número" :error="getErro('numero')"> 
                  <el-input-number v-model="formQuartoEdit.numero" ref="edtQuartoEditNumero" :min="1" :max="999" style="width:100%"></el-input-number>
                </el-form-item>
            </el-col>
            <el-col :span="20">
                <el-form-item label="Descrição" prop="descricao" :error="getErro('descricao')">
                  <el-input v-model="formQuartoEdit.descricao" ref="edtQuartoEditDescricao" ></el-input>
                </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
                <el-form-item label="Destinações de Hospedagem" prop="destinacoes" :error="getErro('destinacoes')">
                  <el-select v-model="formQuartoEdit.destinacoes" multiple placeholder="Selecione um ou mais" style="width:100%">
                    <el-option
                      v-for="item in itensDestinacaoHospedagem"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </el-main>
    </el-container>


    <!-- Edit/Insert Leito -->
    <el-container v-if="(state == 'insertLeito') || (state == 'editLeito')">
      <el-header>
        <el-row type="flex">  
          <el-tooltip content="Gravar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;"><el-button type="primary" @click="handleSaveLeito">Gravar</el-button></div>
          </el-tooltip>
          <el-tooltip content="Cancelar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;"><el-button @click="handleCancelLeito">Cancelar</el-button></div>
          </el-tooltip>
          <div>{{ state == "insertLeito" ? `Incluindo Leito no Quarto ${formLeito.quartoNumero}` : `Alterando Leito no Quarto ${formLeito.quartoNumero}`}}</div>
        </el-row>
      </el-header>
      <el-main>
        
        <el-form :model="formLeito" :rules="rules" ref="formLeito" label-position="top" size="small" label-width="140px">
          <el-row :gutter="10">
            <el-col :span="4">
                <el-form-item label="Número" :error="getErro('numero')">
                  <el-input-number v-model="formLeito.numero" ref="edtLeitoNumero" :min="1" :max="999" style="width:100%"></el-input-number>
                </el-form-item>
            </el-col>

            <el-col :span="20">
                <el-form-item label="Tipo" prop="tipoLeito" :error="getErro('tipoLeito')">
                  <el-select v-model="formLeito.tipoLeito" placeholder="Selecione" style="width:100%">
                    <el-option
                      v-for="item in itensTipoLeito"
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
                <el-form-item label="Situação" prop="situacao" :error="getErro('situacao')">
                  <el-select v-model="formLeito.situacao" placeholder="Selecione" style="width:100%">
                    <el-option
                      v-for="item in itensSituacaoLeito"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </el-main>
    </el-container>

    <el-dialog title="Confirmação" :visible.sync="dialogDeleteLeitoVisible" width="600px">
      <span>{{textToDelete}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDeleteLeito(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleDeleteLeito(true)">Sim</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Confirmação" :visible.sync="dialogDeleteQuartoVisible" width="600px">
      <span>{{textToDelete}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDeleteQuarto(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleDeleteQuarto(true)">Sim</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>

export default {

  name: 'Quartos',

  created(){
  },

  mounted(){
    this.$store.dispatch('setAcao','Quartos')
    this.doGetAll()
    this.doLoadListas()
  },

  computed: {
  },  

  data: () =>({
    dados: [],
    erros: [],
    leitosOcupados: [],

    activeTabName: null,
    activeTabNameOld : null,

    state : 'browse',

    dialogDeleteLeitoVisible : false,
    dialogDeleteQuartoVisible : false,

    idToDelete : null,
    textToDelete : null,

    itensDestinacaoHospedagem : [],
    itensTipoLeito : [],
    itensSituacaoLeito : [],

    formQuartoInsert : {
      id : null,
      numero : null,
      descricao : null,
      destinacoes : null,
      tipoLeito : null,
      situacao : null,
      quantidadeCamas : null
    },

    formQuartoEdit : {
      id : null,
      numero : null,
      descricao : null,
      destinacoes : null
    },

    formLeito:{
      id : null,
      numero: 0,
      tipoLeito: null,
      situacao: null
    },

    rules: {
      descricao: [
        { required: true, message: "Preencha a descrição",trigger: "blur"},
        { min: 3, max: 32, message: "Descrição deve ter de 3 a 32 caracteres",trigger: "blur"}
      ],
    },

    toolTipDelay: 500

  }),

  methods: {

    resetData(){
      this.form = {
        id : null,
        descricao : null,
        disponivel : null
      }
      this.erros = []
    },

    getNomeTab(quarto){
      var retorno = `quarto${quarto.numero}`
      return retorno
    },

    setDefaultData(){
    },

    getErro(campo){
      var retorno =  _.find(this.erros,{fieldName : campo})
      if (retorno){
        return retorno.errorMessage
      }
      return null
    },

    handleInsertQuarto(){
      this.state = "insertQuarto"
      this.activeTabNameOld = this.activeTabName
      this.resetData()
      this.setDefaultData()
      this.doLoadListas()
      this.$nextTick(() => {
        setTimeout(() => this.$refs.edtdescricao.focus(), 500)
      })      
    },

    handleSaveInsertQuarto(){
      this.doSaveInsertQuarto()
    },

    handleSaveEditQuarto(){
      this.doSaveEditQuarto()
    },

    handleCancelQuarto(){
      this.state = "browse"
      this.activeTabName = this.activeTabNameOld
    },

    handleInsertLeito(quarto){
      this.activeTabNameOld = this.activeTabName
      this.doInsertLeito(quarto)
    },
 
    handleEditQuarto(quartoId){
      this.activeTabNameOld = this.activeTabName
      this.doEditQuarto(quartoId)
    },
 
    handleDeleteQuarto(quartoId){
      console.log("handleDeleteQuarto ",quartoId)
    },
 
    handleEditLeito(id){
      this.activeTabNameOld = this.activeTabName
      this.resetData()
      this.setDefaultData()
      this.doLoadListas()
      this.doEditLeito(id)
    },

    handleConfirmDeleteLeito(leito){
      this.activeTabNameOld = this.activeTabName
      this.textToDelete = `Deseja realmente excluir o Leito "${leito.numero}"?`
      this.idToDelete = leito.id
      this.dialogDeleteLeitoVisible = true
    },

    handleDeleteLeito(ok){
      this.dialogDeleteLeitoVisible = false
      if (ok){
        this.doDeleteLeito()
      }
    },

    handleConfirmDeleteQuarto(quarto){
      this.textToDelete = `Deseja realmente excluir o Quarto "${quarto.numero}"?`
      this.idToDelete = quarto.id
      this.dialogDeleteQuartoVisible = true
    },

    handleDeleteQuarto(ok){
      this.dialogDeleteQuartoVisible = false
      if (ok){
        this.doDeleteQuarto()
      }
    },

    handleEdit(row){
      this.resetData()
      this.doGetById(row.id)
    },
    
    handleSave(){
      this.doSave()
    },
    
    handleDelete(row){
      this.textToDelete = `Deseja realmente excluir a Destinação de Hospedagem "${row.descricao}"?`
      this.idToDelete = row.id
      this.dialogExclusaoVisible = true
    },

/*
    loadLeitosOcupados() {
      var dataIni = petraDateTime.hoje()

      var request = {
        dataIni : dataIni,
        dataFim : dataIni
      }

      this.leitosOcupados = []
      petra.axiosPost("/app/hospedagem/leitos_ocupados", request).then(
        response => {
          this.leitosOcupados = response.data
        })
    },

    visualizarHospedagemNoLeito(leitoId){
      petra.showMessageSuccess('Em breve será apresentada a hospedagem do leito')
    },

    classeSituacaoLeito(id){
      var ocupado = this.isLeitoOcupado(id)
      return ocupado ? "red lighten-2" : "amber lighten-4"
    },

    isLeitoOcupado(id){
      return (this.leitosOcupados.indexOf(id) >= 0);
    },

*/

    handleCancel(row){
      this.state = "browse"
      this.doGetAll()
    },

    handleConfirmDelete(confirm) {
      this.dialogExclusaoVisible = false
      if (confirm){
        this.doDelete()
      }
    },

    handleSaveLeito(){
      this.doSaveLeito()
    },

    handleCancelLeito(){
      this.state = "browse"
      this.activeTabName = this.activeTabNameOld      
    },

    doLoadListas(evt) {
      this.itensDestinacaoHospedagem = []
      this.itensTipoLeito = []
      this.itensSituacaoLeito = []

      petra.axiosGet("/app/quarto/listas", false).then(
        response => {
          this.itensDestinacaoHospedagem = response.data.listaDestinacaoHospedagem
          this.itensTipoLeito = response.data.listaTipoLeito
          this.itensSituacaoLeito = response.data.listaSituacaoLeito
        })
    },

    doGetAll() {

      return new Promise((resolve, reject) => {
        petra.axiosGet("/app/quarto").then(
          response => {
            this.dados = response.data
            if (this.dados.length > 0){
              var q = this.dados[0]
              this.activeTabName = `quarto${q.numero}`
            }
            resolve(response)
          }).catch(error => {
            reject(error)
          })
      })

    },

    doGetById(id) {
      petra.axiosGet(`/app/destinacao_hospedagem/${id}`).then(
        response => {
          this.form = response.data
          this.state = "edit"
          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs.edtdescricao.focus()
            }, 500)
          })      
        })
    },

    /*
    doDelete(evt) {
      petra.axiosDelete("/app/destinacao_hospedagem/"+this.idToDelete)
        .then(response => {
          petra.showMessageSuccess('Destinação de Hospedagem excluída com sucesso')
          this.doGetAll()
        })
        .catch(error => {
          petra.tratarErros(error)
        })
    },
    */

    doSaveInsertQuarto() {
      this.errors = []
      petra.axiosPost("/app/quarto", this.formQuartoInsert, false)
        .then(response => {
          var newTab = this.getNomeTab(response.data)
          petra.showMessageSuccess('Quarto gravado com sucesso')
          this.state="browse"
          this.doGetAll().then(sucesso => {
            this.activeTabName = newTab
          })
        })
        .catch(error => {
          this.erros = petra.tratarErros(error)
        })
    },

    doEditQuarto(id) {
      petra.axiosGet(`/app/quarto/${id}`).then(
        response => {
          this.state = "editQuarto"
          var item = response.data  
          var destinacoes = []
          for(var i = 0; i < item.destinacoes.length; i++){
            destinacoes.push(item.destinacoes[i].id)
          }
          this.formQuartoEdit = {
            id: item.id,
            numero: item.numero,
            descricao: item.descricao,
            destinacoes : destinacoes
          }
          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs.edtQuartoEditNumero.focus()
            }, 500)
          })
        })
    },

    doSaveEditQuarto() {
      this.errors = []

      petra.axiosPost("/app/quarto/alterar", this.formQuartoEdit, false)
        .then(response => {
          petra.showMessageSuccess('Quarto gravado com sucesso')
          var thetab = this.getNomeTab(response.data)
          this.state="browse"

          this.doGetAll().then( x => {
            this.activeTabName = thetab
          })
        })
        .catch(error => {
          this.errors = petra.tratarErros(error)
        })
    },

    doInsertLeito(quarto) {
      this.state = "insertLeito"
      this.resetData()
      this.setDefaultData()
      this.formLeito = {
        id: null,
        numero: null,
        descricao: null,
        situacao: null,
        tipoLeito : null,
        quartoId : quarto.id,
        quartoNumero : quarto.numero,
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.edtLeitoNumero.focus()
        }, 500)
      })
    },

    doEditLeito(id) {
      petra.axiosGet(`/app/quarto/leito/${id}`).then(
        response => {
          this.state = "editLeito"
          var item = response.data  

          this.formLeito = {
            id: item.id,
            numero: item.numero,
            descricao: item.descricao,
            situacao : item.situacao,
            tipoLeito : item.tipoLeito,
            quartoId : item.quartoId,
            quartoNumero : item.quartoNumero,
          }

        })
    },

    doSaveLeito() {
      this.errors = [];

      petra.axiosPost("/app/quarto/leito", this.formLeito, false)
        .then(response => {
          petra.showMessageSuccess('Leito gravado com sucesso')
          this.state="browse"
          this.doGetAll().then(success => {
            this.activeTabName = this.activeTabNameOld
          })
        })
        .catch(error => {
          this.erros = petra.tratarErros(error)
        })
    },

    doDeleteLeito() {
      this.errors = [];

      petra.axiosDelete("/app/quarto/leito/"+this.idToDelete)
        .then(response => {
          petra.showMessageSuccess('Leito excluído com sucesso')
          this.doGetAll().then(success => {
            this.activeTabName = this.activeTabNameOld
          })
        })
        .catch(error => {
          petra.tratarErros(error)
        })
    },

    doDeleteQuarto() {
      this.errors = [];

      petra.axiosDelete("/app/quarto/"+this.idToDelete)
        .then(response => {
          petra.showMessageSuccess('Quarto excluído com sucesso')
          this.doGetAll()
        })
        .catch(error => {
          petra.tratarErros(error)
        })
    },


  }
}
</script>

<style scoped>
  .divmain{
    color: #546E7A;
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

  .destinacoes {
    margin-right: 5px;
  }

  .subtitle {
    font-size: .8em;
    margin-right: 10px;
  }

  .numero_leito{
    font-size: 1.2em;
  }

.flex-container {
  padding: 0;
  margin: 0;
  list-style: none;
  box-orient: horizontal;
  display: flex;
  justify-content: start; /*center*/
}

.wrap    { 
  flex-wrap: wrap;
}  

.wrap li {
  background: gold;
}

.flex-item {
  background: #FFF9C4;
  color: #455A64;
  padding: 2px;
  width: 300px;
  margin: 10px;
}

</style>
