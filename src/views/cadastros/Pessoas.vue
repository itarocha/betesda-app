<template>
  <div>
    <el-container v-if="state == 'browse'">
      <el-header>
        <el-tooltip
          content="Incluir Pessoa"
          placement="bottom"
          :open-delay="toolTipDelay"
        >
          <el-button type="primary" @click="handleInsert">Incluir</el-button>
        </el-tooltip>
      </el-header>
      <el-main>
        <el-row>
          <el-col :sm="24" :md="24" :lg="24">
            <edit-search :itens="itensBusca" @search="handleSearch"></edit-search>
          </el-col>
        </el-row>  
        <el-row type="flex" justify="center" align="middle">
          <el-col :sm="24" :md="24" :lg="24">
            <el-table :data="dados" stripe style="width: 100%" border size="small" :default-sort="{prop: 'descricao', order: 'ascending'}" :height="tableHeight">
              <el-table-column fixed header-align="left" align="right" prop="id" label="Código" width="100"></el-table-column>
              <el-table-column fixed prop="nome" sortable label="Nome" width="250"></el-table-column>
              <el-table-column prop="dataNascimento" :formatter="fmtDate" label="Nascimento" header-align="left" width="120" sortable></el-table-column>
              <el-table-column prop="endereco.descricao" label="Endereço" class-name="wordwrap" width="350"></el-table-column>
              <el-table-column prop="naturalidadeCidade" sortable label="Naturalidade" width="120"></el-table-column>
              <el-table-column prop="naturalidadeUf" sortable label="UF"></el-table-column>
              <el-table-column label="Ações" fixed="right" align="center" width="140">
                <template slot-scope="scope">
                  <el-tooltip content="Editar" placement="bottom" :open-delay="toolTipDelay">
                    <el-button type="primary" plain size="mini" circle @click="handleEdit(scope.row)">
                      <i class="fas fa-pencil-alt"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Excluir" placement="bottom" :open-delay="toolTipDelay">
                    <el-button type="danger" plain size="mini" circle @click="handleDelete(scope.row)">
                      <i class="fas fa-trash"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Selecionar para Hospedagem" placement="bottom" :open-delay="toolTipDelay">
                    <el-button type="warning" plain size="mini" circle @click="handleSelecionarParaHospedagem(scope.row)">
                      <i class="fas fa-star"></i>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-container v-if="state != 'browse'">

      <frame-pessoa :id="pessoaId" :canSelecionar="true" @cancel="onCancel" @save="onSave"></frame-pessoa>

    </el-container>

    <el-dialog title="Confirmação" :visible.sync="dialogExclusaoVisible" width="600px">
      <span>{{textToDelete}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleConfirmDelete(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleConfirmDelete(true)">Sim</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EditSearch from "../../components/EditSearch"
import FramePessoa from "./FramePessoa"

export default {
  name: "Pessoas",

  components:{
    EditSearch,
    FramePessoa
  },

  created() {
    //this.resetData()
  },

  mounted() {
    this.$store.dispatch("setAcao", "Pessoas");
    
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.tableHeight = window.innerHeight - 200
      })
      //setTimeout(() => this.$refs.edtLocalizar.focus(), 500)
    })

    this.doGetAll();
  },

  data: () => ({
    dados: [],

    //TODO REMOVER
    searchField : 'nome',
    //TODO REMOVER
    searchValue : '',

    form : {},

    erros: [],

    state: "browse",

    dialogExclusaoVisible: false,

    pessoaId : null,

    idToDelete: null,
    textToDelete: null,

    windowHeight: 0,

    tableHeight: window.innerHeight - 200,


    itensDestinacaoHospedagem: [],
    itensTipoLeito: [],
    itensSituacaoLeito: [],

    itensBusca: [
      {text: "Nome", value: "nome", type: "text"},
      {text: "CPF", value: "cpf", type: "text"},
      {text: "RG", value: "rg", type: "text"},
      {text: "Cartão do SUS", value: "cartaoSus", type: "text"},
      {text: "Telefone", value: "telefone", type: "text"},
      {text: "Telefone2", value: "telefone2", type: "text"},
    ],


    toolTipDelay: 500
  }),

  methods: {

    fmtSimNao(row, col) {
      return row.disponivel == "S" ? "Sim" : "Não";
    },

    fmtDate(row, col) {
      return petraDateTime.formatDate(row.dataNascimento, null);
    },

    handleEdit(row) {
      this.pessoaId = row.id
      this.state = "edit";
    },

    handleInsert() {
      this.pessoaId = null,
      this.state = "insert";
    },

    handleSelecionarParaHospedagem(row){
      this.$store.dispatch('addAguardando', row)
    },

    handleDelete(row) {
      this.textToDelete = `Deseja realmente excluir "${row.nome}"?`;
      this.idToDelete = row.id;
      this.dialogExclusaoVisible = true;
    },

    onCancel(row) {
      this.pessoaId = null
      this.state = "browse"
      this.doGetAll()
    },

    onSave(row) {
      this.pessoaId = null
      this.state = "browse"
      this.doGetAll()
    },

    handleConfirmDelete(confirm) {
      this.dialogExclusaoVisible = false
      if (confirm) {
        this.doDelete()
      }
    },

    handleSearch(searchField, searchValue){
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

    doDelete(evt) {
      petra
        .axiosDelete("/app/pessoas/" + this.idToDelete)
        .then(response => {
          petra.showMessageSuccess("Pessoa excluída com sucesso");
          this.doGetAll();
        })
        .catch(error => {
          petra.tratarErros(error);
        });
    },

    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      // row = mostra o registro do momento.
      // column = mostra os detalhes da coluna. Exemplo: property (prop)
      // rowIndex e columnIndex os indices absolutos. A primeira linha de registros é 0
      if (rowIndex === 2 && columnIndex === 2) {
        return "vermelho";
      } else if (rowIndex === 1 && columnIndex === 1) {
        return "azul";
      }
      return "wordwrap";
    }
  }
};
</script>

<style scoped>
.container {
  width: 800px;
}

.el-col {
  padding-bottom: 0px;
}


</style>