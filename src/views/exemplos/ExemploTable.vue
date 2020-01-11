<template>
  <div>
    <el-container>
      <el-header>
        <el-tooltip content="Incluir nova Situação de Leito" placement="bottom" :open-delay="300">
          <el-button type="primary">Incluir</el-button>
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
              height="400"
              :row-class-name="tableRowClassName"
              :cell-class-name="tableCellClassName">
              <el-table-column fixed header-align="left" align="right" prop="id" label="Código" width="150"></el-table-column>
              <el-table-column prop="descricao" sortable label="Descrição" width="300"></el-table-column>
              <el-table-column prop="disponivel" label="Disponível?" width="100" :formatter="fmtSimNao"></el-table-column>
              <el-table-column label="Ações">
                <template slot-scope="scope">
                  <el-tooltip content="Editar" placement="bottom" :open-delay="300">
                    <el-button type="primary" plain size="mini" circle ><i class="fas fa-pencil-alt"></i></el-button>  
                  </el-tooltip>
                  <el-tooltip content="Excluir" placement="bottom" :open-delay="300">
                    <el-button type="danger"  plain size="mini" circle><i class="fas fa-trash"></i></el-button>  
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        
      </el-main>
    </el-container>
  </div>

</template>

<script>

export default {

  name: 'ExemploTable',

  created(){
    this.$nextTick(() => {
      setTimeout(() => {
        //this.$refs.edtusermame.focus()
      }, 500)
    })
  },

  mounted(){

    this.$store.dispatch('setAcao','Situações de Leitos')
    this.getData()
      
  },

  data: () =>({
    dados: [],

    form : {
      username : null,
      password : null
    },

    rules: {
      username: [
        { required: true, message: "Preencha o usuário",trigger: "blur"},
      ],
      password: [
        { required: true, message: "Entre com a senha",trigger: "blur"},
        { min: 8, max: 32, message: "Senha deve haver de 8 a 32 caracteres",trigger: "blur"}
      ],
    }

  }),

  methods: {

    getData(evt) {
      petra.axiosGet("/app/situacao_leito").then(
        response => {
          this.dados = response.data
          //console.log(response.data)
        })
    },

    fmtSimNao(row, col){
      return (row.disponivel == 'S' ? 'Sim' : 'Não')
    },

    formatMethod({ row, column, cellValue, index }) {
      //console.log(row, column, cellValue, index)
    },    

    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },

    tableCellClassName({row, column, rowIndex, columnIndex}) {
      // row = mostra o registro do momento. 
      // column = mostra os detalhes da coluna. Exemplo: property (prop)
      // rowIndex e columnIndex os indices absolutos. A primeira linha de registros é 0
        if ((rowIndex === 2) && (columnIndex === 2)) {
          //console.log(row)
          return 'vermelho';
        } else if ((rowIndex === 1) && (columnIndex === 1)){
          return 'azul';
        }
        return '';
    },    

  }
}
</script>

<style scoped>


  .el-header {
    line-height: 60px;
  }
  
  .el-main {
    text-align: center;
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
