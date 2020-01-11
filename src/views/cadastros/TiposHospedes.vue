<template>
  <div>

    <el-container v-if="state == 'browse'">
      <el-header>
        <el-tooltip content="Incluir novo Tipo de Hóspede" placement="bottom" :open-delay="toolTipDelay">
          <el-button type="primary" @click="handleInsert">Incluir</el-button>
        </el-tooltip>
      </el-header>
      <el-main>
        <el-row type="flex" justify="center" align="middle">
          <el-col :sm="24" :md="24" :lg="24">
            <el-table
              :data="dados"
              stripe 
              style="width: 100%"
              border size="small"
              :default-sort="{prop: 'descricao', order: 'ascending'}" 
              height="400">
              <el-table-column fixed header-align="left" align="right" prop="id" label="Código" width="150"></el-table-column>
              <el-table-column prop="descricao" sortable label="Descrição" width="300"></el-table-column>
              <el-table-column label="Ações">
                <template slot-scope="scope">
                  <el-tooltip content="Editar" placement="bottom" :open-delay="toolTipDelay">
                    <el-button type="primary" plain size="mini" circle @click="handleEdit(scope.row)"><i class="fas fa-pencil-alt"></i></el-button>  
                  </el-tooltip>
                  <el-tooltip content="Excluir" placement="bottom" :open-delay="toolTipDelay">
                    <el-button type="danger"  plain size="mini" circle @click="handleDelete(scope.row)"><i class="fas fa-trash"></i></el-button>  
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-container v-if="state != 'browse'">
      <el-header>
        <el-row type="flex">  
          <el-tooltip content="Gravar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;"><el-button type="primary" @click="handleSave">Gravar</el-button></div>
          </el-tooltip>
          <el-tooltip content="Cancelar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;"><el-button @click="handleCancel">Cancelar</el-button></div>
          </el-tooltip>
          <div>{{state=='edit' ? 'Editando Tipo de Hóspede' : 'Incluindo Tipo de Hóspede'}}</div>
        </el-row>
      </el-header>
      <el-main>
        
        <el-row class="container" type="flex" justify="center" align="middle">
          <el-col :sm="24" :md="24" :lg="18">

              <el-form :model="form" :rules="rules" ref="form"
                label-position="top" size="small" label-width="140px">

                <el-form-item label="Descrição" prop="descricao" :error="getErro('descricao')">
                  <el-input v-model="form.descricao" ref="edtdescricao"></el-input>
                </el-form-item>

              </el-form>
          </el-col>
        </el-row>

      </el-main>
    </el-container>

    <el-dialog
      title="Confirmação"
      :visible.sync="dialogExclusaoVisible"
      width="600px">
      <span>{{textToDelete}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleConfirmDelete(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleConfirmDelete(true)">Sim</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>

export default {

  name: 'TiposHospedes',

  created(){
  },

  mounted(){
    this.$store.dispatch('setAcao','Tipos de Hóspedes')
    this.doGetAll()
  },

  data: () =>({
    dados: [],

    erros: [],

    state : 'browse',

    dialogExclusaoVisible : false,

    idToDelete : null,
    textToDelete : null,

    form : {
      id : null,
      descricao : null,
      disponivel : null
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

    setDefaultData(){
    },

    getErro(campo){
      var retorno =  _.find(this.erros,{fieldName : campo})
      if (retorno){
        return retorno.errorMessage
      }
      return null
    },

    handleEdit(row){
      this.resetData()
      this.doGetById(row.id)
    },

    handleInsert(){
      this.state = "insert"
      this.resetData()
      this.setDefaultData()
      this.$nextTick(() => {
        setTimeout(() => this.$refs.edtdescricao.focus(), 500)
      })      
    },
    
    handleSave(){
      this.doSave()
    },
    
    handleDelete(row){
      this.textToDelete = `Deseja realmente excluir o Tipo de Hóspede "${row.descricao}"?`
      this.idToDelete = row.id
      this.dialogExclusaoVisible = true
    },

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

    doGetAll(evt) {
      petra.axiosGet("/app/tipo_hospede").then(
        response => {
          this.dados = response.data
        })
    },

    doGetById(id) {
      petra.axiosGet(`/app/tipo_hospede/${id}`).then(
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

    doDelete(evt) {
      petra.axiosDelete("/app/tipo_hospede/"+this.idToDelete)
        .then(response => {
          petra.showMessageSuccess('Tipo de Hóspede excluído com sucesso')
          this.doGetAll()
        })
        .catch(error => {
          petra.tratarErros(error)
        })
    },

    doSave(evt) {
      this.errors = [];

      petra.axiosPost("/app/tipo_hospede/", this.form, false)
        .then(response => {
          petra.showMessageSuccess('Tipo de Hóspede gravado com sucesso')
          this.state="browse"
          this.doGetAll()
        })
        .catch(error => {
          this.erros = petra.tratarErros(error)
        })
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

</style>
