<template>
  <div>
    <el-container v-if="state == 'browse' && mode == 'entidades'">
      <el-header>
          <el-button type="primary" @click="handleInsertEntidade">Incluir Entidade</el-button>
      </el-header>
      <el-main>
        <el-row type="flex" justify="center" align="middle">
          <el-col :sm="24" :md="24" :lg="24">
            <el-table :data="dados" stripe style="width: 100%" border size="small" :default-sort="{prop: 'descricao', order: 'ascending'}" :height="tableHeight">
              <el-table-column fixed header-align="left" align="right" prop="id" label="Código" width="100"></el-table-column>
              <el-table-column fixed prop="nome" sortable label="Nome" width="250"></el-table-column>
              <el-table-column prop="cnpj" label="CNPJ" header-align="left" width="120" sortable></el-table-column>
              <el-table-column prop="telefone" label="Telefone" header-align="left" width="120"></el-table-column>
              <el-table-column prop="endereco.descricao" label="Endereço" class-name="wordwrap" width="350"></el-table-column>
              <el-table-column label="Ações" fixed="right" align="center" width="140">
                <template slot-scope="scope">
                  <el-tooltip content="Editar" placement="bottom" :open-delay="toolTipDelay">
                    <el-button type="primary" plain size="mini" circle @click="handleEditEntidade(scope.row)">
                      <i class="fas fa-pencil-alt"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Excluir" placement="bottom" :open-delay="toolTipDelay">
                    <el-button type="danger" plain size="mini" circle @click="handleDeleteEntidade(scope.row)">
                      <i class="fas fa-trash"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Gerenciar Encaminhadores" placement="bottom" :open-delay="toolTipDelay">
                    <el-button type="warning" plain size="mini" circle @click="handleGerenciarEncaminhadores(scope.row)">
                      <i class="fas fa-users"></i>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-container v-if="state != 'browse' && mode == 'entidades'" >
      <el-header>
        <el-row type="flex">
          <el-tooltip content="Gravar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;">
              <el-button type="primary" @click="handleSaveEntidade">Gravar</el-button>
            </div>
          </el-tooltip>
          <el-tooltip content="Cancelar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;">
              <el-button @click="state = 'browse'">Cancelar</el-button>
            </div>
          </el-tooltip>
          <div>Incluindo/Alterando Entidade</div>
        </el-row>
      </el-header>

      <el-main>
        <el-form :model="form" :rules="rules" ref="form" label-position="top" size="small" label-width="140px">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form-item label="Nome" prop="nome" :error="getErro('nome')">
                <el-input v-model="form.nome" ref="edtNome" @input.native="fmtMaiusculas($event,'nome')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="CNPJ" prop="cnpj" :error="getErro('cnpj')">
                <el-input v-model="form.cnpj" v-mask="'##.###.###/####-##'" masked="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="Telefone" prop="telefone" :error="getErro('telefone')">
                <el-input v-model="form.telefone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Telefone2" prop="telefone2" :error="getErro('telefone2')">
                <el-input v-model="form.telefone2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Email" prop="email" :error="getErro('email')">
                  <el-input type="email" v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="Endereço" prop="enderecoLogradouro" :error="getErro('endereco.logradouro')">
                <el-input v-model="form.endereco.logradouro" @input.native="fmtLetrasNumerosEspacos($event,'logradouro','endereco')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="Número" prop="enderecoNumero" :error="getErro('endereco.numero')">
                <el-input v-model="form.endereco.numero"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Complemento" prop="enderecoComplemento" :error="getErro('endereco.complemento')">
                <el-input v-model="form.endereco.complemento" @input.native="fmtLetrasNumerosEspacos($event,'complemento','endereco')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="Bairro" prop="enderecoBairro" :error="getErro('endereco.bairro')">
                <el-input v-model="form.endereco.bairro" @input.native="fmtLetrasNumerosEspacos($event,'bairro','endereco')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="CEP" prop="enderecoCep" :error="getErro('endereco.cep')">
                <el-input v-model="form.endereco.cep" v-mask="'#####-###'" masked="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Cidade" prop="enderecoCidade" :error="getErro('endereco.cidade')">
                <el-input v-model="form.endereco.cidade" @input.native="fmtMaiusculas($event,'cidade','endereco')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="UF" prop="enderecoUf" :error="getErro('endereco.uf')">
                <el-select v-model="form.endereco.uf" style="width:100%">
                  <el-option v-for="item in itensUF" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-main>
    </el-container>

    <el-container v-if="state == 'browse' && mode == 'encaminhadores'">
      <el-row type="flex" justify="center" align="middle">
          <el-col style="padding-left:20px; padding-bottom:0px;"><h4>{{formEntidade.nome}}</h4></el-col>
      </el-row>
      <el-header>
          <el-button type="primary" @click="handleInsertEncaminhador">Incluir Encaminhador</el-button>
          <el-button type="primary" @click="gerenciarEntidades">Voltar para Entidades</el-button>
      </el-header>
      <el-main>
        <el-row type="flex" justify="center" align="middle">
          <el-col :sm="24" :md="24" :lg="24">
            <el-table :data="encaminhadores" stripe style="width: 100%" border size="small" :default-sort="{prop: 'descricao', order: 'ascending'}" :height="tableHeight">
              <el-table-column fixed header-align="left" align="right" prop="id" label="Código" width="80"></el-table-column>
              <el-table-column fixed prop="nome" sortable label="Nome" width="250"></el-table-column>
              <el-table-column fixed prop="cargo" sortable label="Cargo" width="200"></el-table-column>
              <el-table-column prop="telefone" label="Telefone" header-align="left" width="120"></el-table-column>
              <el-table-column prop="email" label="Email" class-name="wordwrap" width="350"></el-table-column>
              <el-table-column label="Ações" fixed="right" align="center" width="140">
                <template slot-scope="scope">
                  <el-tooltip content="Editar" placement="bottom" :open-delay="toolTipDelay">
                    <el-button type="primary" plain size="mini" circle @click="handleEditEncaminhador(scope.row)">
                      <i class="fas fa-pencil-alt"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Excluir" placement="bottom" :open-delay="toolTipDelay">
                    <el-button type="danger" plain size="mini" circle @click="handleDeleteEncaminhador(scope.row)">
                      <i class="fas fa-trash"></i>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-container v-if="state != 'browse' && mode == 'encaminhadores'" >
      <el-header>
        <el-row type="flex">
          <el-tooltip content="Gravar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;">
              <el-button type="primary" @click="handleSaveEncaminhador">Gravar</el-button>
            </div>
          </el-tooltip>
          <el-tooltip content="Cancelar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;">
              <el-button @click="state = 'browse'">Cancelar</el-button>
            </div>
          </el-tooltip>
          <div>Incluindo/Alterando Encaminhador</div>
        </el-row>
      </el-header>

      <el-main>
        <el-form :model="formEncaminhador" :rules="rules" ref="form" label-position="top" size="small" label-width="140px">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form-item label="Nome" prop="nome" :error="getErro('nome')">
                <el-input v-model="formEncaminhador.nome" ref="edtNome" @input.native="fmtMaiusculas($event,'nome')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Cargo" prop="cargo" :error="getErro('cargo')">
                <el-input v-model="formEncaminhador.cargo" ref="edtCargo" @input.native="fmtMaiusculas($event,'cargo')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="Telefone" prop="telefone" :error="getErro('telefone')">
                <el-input v-model="formEncaminhador.telefone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Email" prop="email" :error="getErro('email')">
                  <el-input type="email" v-model="formEncaminhador.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-main>
    </el-container>

    <el-dialog title="Confirmação" :visible.sync="dialogExclusaoEntidadeVisible" width="600px">
      <span>{{textToDelete}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleConfirmDeleteEntidade(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleConfirmDeleteEntidade(true)">Sim</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Confirmação" :visible.sync="dialogExclusaoEncaminhadorVisible" width="600px">
      <span>{{textToDelete}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleConfirmDeleteEncaminhador(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleConfirmDeleteEncaminhador(true)">Sim</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";

const Entidades = {
  name: "Entidades",

  directives: { mask },

  created() {
    this.resetData()
  },

  mounted() {
    this.$store.dispatch("setAcao", "Entidades");
    /*
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.tableHeight = window.innerHeight - 200
      })
      setTimeout(() => this.$refs.edtLocalizar.focus(), 500)
    })
    */
    this.doGetAllEntidade();
  },

  computed: {

    tituloBotaoIncluir(){
      return this.mode == 'entidades' ? 'Incluir Entidade' : 'Incluir Encaminhador'
    }
  },


  data: () => ({
    dados: [],
    encaminhadores: [],
    mode: 'entidades',

    form : {},
    formEntidade : {},
    formEncaminhador : {},

    erros: [],

    state: "browse",

    dialogExclusaoEntidadeVisible: false,
    dialogExclusaoEncaminhadorVisible: false,

    idToDelete: null,
    textToDelete: null,

    windowHeight: 0,

    tableHeight: window.innerHeight - 200,

    rules: {
      descricao: [
        { required: true, message: "Preencha a descrição", trigger: "blur" },
        {
          min: 3,
          max: 32,
          message: "Descrição deve ter de 3 a 32 caracteres",
          trigger: "blur"
        }
      ]
    },

    itensDestinacaoHospedagem: [],
    itensTipoLeito: [],
    itensSituacaoLeito: [],

    itensBusca: [
      {text: "Nome", value: "nome", type: "text"},
      {text: "CPF", value: "cpf", type: "text"},
      {text: "RG", value: "rg", type: "text"},
    ],

    itensSexo: [
      { text: "MASCULINO", value: "M" }, 
      { text: "FEMININO", value: "F" }],
    itensEstadoCivil : [
      { text: "SOLTEIRO(A)", value:"S"},
      { text: "CASADO(A)", value:"C"},
      { text: "DIVORCIADO(A)", value:"D"},
      { text: "UNIÃO ESTÁVEL", value:"U"},
      { text: "VIÚVO(A)", value:"V"}],
    itensUF : [
      { value : "AC", text : "AC", texto: "Acre" },
      { value : "AL", text : "AL", texto: "Alagoas"}, 
      { value : "AM", text : "AM", texto: "Amazonas"},
      { value : "AP", text : "AP", texto: "Amapá"}, 
      { value : "BA", text : "BA", texto: "Bahia"}, 
      { value : "CE", text : "CE", texto: "Ceará"}, 
      { value : "DF", text : "DF", texto: "Distrito Federal"}, 
      { value : "ES", text : "ES", texto: "Espírito Santo"},
      { value : "GO", text : "GO", texto: "Goiás"}, 
      { value : "MA", text : "MA", texto: "Maranhão"}, 
      { value : "MG", text : "MG", texto: "Minas Gerais"}, 
      { value : "MS", text : "MS", texto: "Mato Grosso do Sul"},
      { value : "MT", text : "MT", texto: "Mato Grosso"}, 
      { value : "PA", text : "PA", texto: "Pará"}, 
      { value : "PB", text : "PB", texto: "Paraíba"}, 
      { value : "PE", text : "PE", texto: "Pernambuco"},
      { value : "PI", text : "PI", texto: "Piauí"}, 
      { value : "PR", text : "PR", texto: "Paraná"},
      { value : "RJ", text : "RJ", texto: "Rio de Janeiro"},
      { value : "RN", text : "RN", texto: "Rio Grande do Norte"},
      { value : "RO", text : "RO", texto: "Rondônia"}, 
      { value : "RR", text : "RR", texto: "Roraima"},
      { value : "RS", text : "RS", texto: "Rio Grande do Sul"}, 
      { value : "SC", text : "SC", texto: "Santa Catarina"},
      { value : "SE", text : "SE", texto: "Sergipe"}, 
      { value : "SP", text : "SP", texto: "São Paulo"}, 
      { value : "TO", text : "TO", texto: "Tocantins"}],

    toolTipDelay: 500
  }),

  methods: {
    resetData() {
      this.form = {
        id : null,
        nome : null,
        cnpj : null,
        endereco : {
          logradouro : null,
          numero : 0,
          complemento : null,
          bairro : null,
          cep : null,
          cidade : null,
          uf : null,
        },
        telefone : null,
        telefone2 : null,
        email : null,
        observacoes : null
      },

      this.formEncaminhador = {
        entidade : {
          id : null,
          nome : null
        },
        id : null,
        nome : null,
        telefone : null,
        cargo : null,
        email : null
      },


      this.erros = [];
    },

    setDefaultData() {
      this.form.endereco.uf = "MG"
    },

    fmtMaiusculas(event, campo, group) {
      var form = this.mode == 'entidades'  ? 'form' : 'formEncaminhador'

      if (group){
        this.$data[form][group][campo] = petra.removerAcentos(event.target.value).toUpperCase();
      } else {
        this.$data[form][campo] = petra.removerAcentos(event.target.value).toUpperCase();
      }
    },

    fmtLetrasENumeros(event, campo) {
      var form = this.mode == 'entidades'  ? 'form' : 'formEncaminhador'
      this.$data[form][campo] = petra.letrasENumeros(event.target.value).toUpperCase();
    },

    fmtLetrasNumerosEspacos(event, campo, group) {
      var form = this.mode == 'entidades'  ? 'form' : 'formEncaminhador'
      var s = petra.letrasNumerosEspacos(event.target.value).toUpperCase()
      if (group){
        this.$data[form][group][campo] = s;
      } else {
        this.$data[form][campo] = s;
      }
    },

    fmtSimNao(row, col) {
      return row.disponivel == "S" ? "Sim" : "Não";
    },

    fmtDate(row, col) {
      return petraDateTime.formatDate(row.dataNascimento, null);
    },

    formatDate(data, formato) {
      return petraDateTime.formatDate(data, formato);
    },

    getErro(campo) {
      var retorno = _.find(this.erros, { fieldName: campo });
      if (retorno) {
        return retorno.errorMessage;
      }
      return null;
    },

    handleEditEntidade(row) {
      this.state = "edit";
      this.resetData();
      this.doGetEntidadeById(row.id);
      this.$nextTick(() => {
        setTimeout(() => this.$refs.edtNome.focus(), 500)
      });
    },

    handleInsertEntidade() {
      this.state = "insert";
      this.resetData();
      this.setDefaultData();
      this.$nextTick(() => {
        setTimeout(() => this.$refs.edtNome.focus(), 500)
      });
    },

    handleSaveEntidade() {
      this.doSaveEntidade(true);
    },

    handleDeleteEntidade(row) {
      this.textToDelete = `Deseja realmente excluir "${row.nome}"?`;
      this.idToDelete = row.id;
      this.dialogExclusaoEntidadeVisible = true;
    },

    handleCancelEntidade(row) {
      this.state = "browse";
      this.doGetAllEntidade();
    },

    handleConfirmDeleteEntidade(confirm) {
      this.dialogExclusaoEntidadeVisible = false;
      if (confirm) {
        this.doDeleteEntidade();
      }
    },

    doGetAllEntidade() {
      petra.axiosGet("/app/entidades", false).then(
        response => this.dados = response.data
      )
    },

    doGetEncaminhadores(entidadeId) {
      petra.axiosGet(`/app/encaminhadores/por_encaminhador/${entidadeId}`, false).then(
        response => {
          this.encaminhadores = response.data
        } 
      )
    },

    doGetEntidadeById(id) {
      petra.axiosGet(`/app/entidades/${id}`).then(response => {
        this.form = response.data;
        this.state = "edit";
        this.$nextTick(() => {
          setTimeout(() => {
            //this.$refs.edtdescricao.focus()
          }, 500);
        });
      });
    },

    doDeleteEntidade(evt) {
      petra
        .axiosDelete("/app/entidades/" + this.idToDelete)
        .then(response => {
          petra.showMessageSuccess("Entidade excluída com sucesso");
          this.doGetAllEntidade();
        })
        .catch(error => {
          petra.tratarErros(error);
        });
    },

    doSaveEntidade(evt) {
      this.errors = [];

      petra
        .axiosPost("/app/entidades/", this.form, true)
        .then(response => {
          petra.showMessageSuccess("Entidade gravada com sucesso");
          this.state = "browse";
          this.doGetAllEntidade();
        })
        .catch(error => {
          this.erros = petra.tratarErros(error);
        });
    },

    handleInsertEncaminhador() {
      this.state = "insert";
      this.resetData();
      this.setDefaultData();
      this.$nextTick(() => {
        setTimeout(() => this.$refs.edtNome.focus(), 500)
      });
    },

    handleSaveEncaminhador() {
      this.doSaveEncaminhador(true);
    },

    handleDeleteEncaminhador(row) {
      this.textToDelete = `Deseja realmente excluir "${row.nome}"?`;
      this.idToDelete = row.id;
      this.dialogExclusaoEncaminhadorVisible = true;
    },

    handleCancelEncaminhador(row) {
      this.state = "browse"
      this.doGetEncaminhadores(this.formEntidade.id)
    },

    handleConfirmDeleteEncaminhador(confirm) {
      this.dialogExclusaoEncaminhadorVisible = false;
      if (confirm) {
        this.doDeleteEncaminhador();
      }
    },

    handleGerenciarEncaminhadores(item){
      this.formEntidade = item
      this.doGetEncaminhadores(this.formEntidade.id)
      this.mode='encaminhadores'
    },

    gerenciarEntidades() {
      this.form = null
      this.mode='entidades'
    },

    handleEditEncaminhador(row) {
      this.state = "edit";
      this.resetData();
      this.doGetEncaminhadorById(row.id);
      this.$nextTick(() => {
        setTimeout(() => this.$refs.edtNome.focus(), 500)
      });
    },

    doGetEncaminhadorById(id) {
      petra.axiosGet(`/app/encaminhadores/${id}`).then(response => {
        this.formEncaminhador = response.data;
        this.state = "edit";
        this.$nextTick(() => {
          setTimeout(() => {
            //this.$refs.edtdescricao.focus()
          }, 500);
        });
      });
    },

    doDeleteEncaminhador(evt) {
      petra
        .axiosDelete("/app/encaminhadores/" + this.idToDelete)
        .then(response => {
          petra.showMessageSuccess("Encaminhador excluído com sucesso");
          this.doGetEncaminhadores(this.formEntidade.id)
        })
        .catch(error => {
          petra.tratarErros(error);
        });
    },

    doSaveEncaminhador(evt) {
      this.errors = [];

      this.formEncaminhador.entidade = this.formEntidade

      petra
        .axiosPost("/app/encaminhadores/", this.formEncaminhador, true)
        .then(response => {
          petra.showMessageSuccess("Encaminhador gravado com sucesso");
          this.state = "browse";
          this.doGetEncaminhadores(this.formEntidade.id)
        })
        .catch(error => {
          this.erros = petra.tratarErros(error);
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
}

export default Entidades

</script>

<style scoped>
.el-header {
  line-height: 60px;
}

.el-main {
  padding-top: 0px;
}

.el-form-item {
  padding-bottom: 0;
}

.container {
  width: 800px;
}

.el-col {
  padding-bottom: 0px;
}

.el-form {
  padding: 10px;
}

</style>