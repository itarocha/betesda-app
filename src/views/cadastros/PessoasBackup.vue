<template>
  <div>
    <el-container v-if="state == 'browse'">
      <el-header>
        <el-tooltip
          content="Incluir nova Situação de Leito"
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
      <el-header>
        <el-row type="flex">
          <el-tooltip content="Gravar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;">
              <el-button type="primary" @click="handleSave(false)">Gravar</el-button>
            </div>
          </el-tooltip>
          <el-tooltip content="Gravar alterações e adicionar para hospedagem" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;">
              <el-button type="warning" @click="handleSave(true)">Gravar e Selecionar</el-button>
            </div>
          </el-tooltip>
          <el-tooltip content="Cancelar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;">
              <el-button @click="state = 'browse'">Cancelar</el-button>
            </div>
          </el-tooltip>
          <div>Incluindo/Alterando Pessoa</div>
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
              <el-form-item label="Nascimento" prop="dataNascimento" :error="getErro('dataNascimento')">
                <el-date-picker type="date" v-model="form.dataNascimento" format="dd/MM/yyyy" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-tabs type="border-card">
                <el-tab-pane label="Dados Pessoais">
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <el-form-item label="Sexo" prop="sexo" :error="getErro('sexo')">
                        <el-select v-model="form.sexo" style="width:100%">
                          <el-option v-for="item in itensSexo" :key="item.value" :label="item.text" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="Estado Civil" prop="estadoCivil" :error="getErro('estadoCivil')">
                        <el-select v-model="form.estadoCivil" style="width:100%">
                          <el-option v-for="item in itensEstadoCivil" :key="item.value" :label="item.text" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="Profissão" prop="profissao" :error="getErro('profissao')">
                        <el-input v-model="form.profissao" @input.native="fmtMaiusculas($event,'profissao')"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="Naturalidade" prop="naturalidadeCidade" :error="getErro('naturalidadeCidade')">
                        <el-input v-model="form.naturalidadeCidade" @input.native="fmtMaiusculas($event,'naturalidadeCidade')"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="Nat.UF" prop="naturalidadeUf" :error="getErro('naturalidadeUf')">
                        <el-select v-model="form.naturalidadeUf" style="width:100%">
                          <el-option v-for="item in itensUF" :key="item.value" :label="item.text" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="Nacionalidade" prop="nacionalidade" :error="getErro('nacionalidade')">
                        <el-input v-model="form.nacionalidade" @input.native="fmtMaiusculas($event,'nacionalidade')"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item label="CPF" prop="cpf" :error="getErro('cpf')">
                        <el-input v-model="form.cpf" v-mask="'###.###.###-##'" masked="false"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="RG" prop="fixme" :error="getErro('rg')">
                        <el-input v-model="form.rg" @input.native="fmtLetrasENumeros($event,'rg')"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="Cartão do SUS" prop="cartaoSus" :error="getErro('cartaoSus')">
                        <el-input v-model="form.cartaoSus" v-mask="'###.####.####.####'" masked="false"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="Endereço e Telefone">
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
                        <el-input v-model="form.endereco.cep" v-mask="'#####-###'" masked="false"></el-input>
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

                  <el-row :gutter="10">
                    <el-col :span="6">
                      <el-form-item label="Telefone" prop="fixme" :error="getErro('telefone')">
                        <el-input v-model="form.telefone"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="Telefone2" prop="fixme" :error="getErro('telefone2')">
                        <el-input v-model="form.telefone2"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="Email" prop="email" :error="getErro('email')">
                         <el-input type="email" v-model="form.email"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="Observações">
                  <el-row :gutter="10">
                    <el-col :span="24">
                      <el-form-item label="Observacoes" prop="fixme" :error="getErro('observacoes')">
                        <el-input type="textarea" rows="10" v-model="form.observacoes"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
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
import { mask } from "vue-the-mask";
import EditSearch from "../../components/EditSearch"

export default {
  name: "Pessoas",

  directives: { mask },

  components:{
    EditSearch
  },

  created() {
    this.resetData()
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
      {text: "Cartão do SUS", value: "cartaoSus", type: "text"},
      {text: "Telefone", value: "telefone", type: "text"},
      {text: "Telefone2", value: "telefone2", type: "text"},
    ],

    itensSexo: [
      { text: "MASCULINO", value: "M" }, 
      { text: "FEMININO", value: "F" }],
    itensEstadoCivil : [
      { text: "SOLTEIRO(A)", value:"S"},
      { text: "CASADO(A)", value:"C"},
      { text: "SEPARADO(A)", value:"P"},
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
        dataNascimento : null,
        sexo : null,
        estadoCivil : null,
        cpf : null,
        profissao : null,
        rg : null,
        naturalidadeCidade : null,
        naturalidadeUf : null,
        cartaoSus : null,

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

      this.erros = [];
    },

    setDefaultData() {
      this.form.sexo = "F";
      this.form.estadoCivil = "S";
      this.form.naturalidadeUf = "MG"
      this.form.nacionalidade = "BRASILEIRA"
      this.form.endereco.uf = "MG"
    },

    fmtMaiusculas(event, campo, group) {
      if (group){
        this.$data["form"][group][campo] = petra.removerAcentos(event.target.value).toUpperCase();
      } else {
        this.$data["form"][campo] = petra.removerAcentos(event.target.value).toUpperCase();
      }
    },

    fmtLetrasENumeros(event, campo) {
      this.$data["form"][campo] = petra.letrasENumeros(event.target.value).toUpperCase();
    },

    fmtLetrasNumerosEspacos(event, campo, group) {
      var s = petra.letrasNumerosEspacos(event.target.value).toUpperCase()
      if (group){
        this.$data["form"][group][campo] = s;
      } else {
        this.$data["form"][campo] = s;
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

    handleEdit(row) {
      this.resetData();
      this.doGetById(row.id);
    },

    handleInsert() {
      this.state = "insert";
      this.resetData();
      this.setDefaultData();
      this.$nextTick(() => {
        setTimeout(() => this.$refs.edtNome.focus(), 500)
      });
    },

    handleSelecionarParaHospedagem(row){
      this.$store.dispatch('addAguardando', row)
    },

    handleSave(doCheckin) {
      this.doSave(doCheckin);
    },

    handleDelete(row) {
      this.textToDelete = `Deseja realmente excluir "${row.nome}"?`;
      this.idToDelete = row.id;
      this.dialogExclusaoVisible = true;
    },

    handleCancel(row) {
      this.state = "browse";
      this.doGetAll();
    },

    handleConfirmDelete(confirm) {
      this.dialogExclusaoVisible = false;
      if (confirm) {
        this.doDelete();
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

    doGetById(id) {
      petra.axiosGet(`/app/pessoas/${id}`).then(response => {
        this.form = response.data;
        this.state = "edit";
        this.$nextTick(() => {
          setTimeout(() => {
            //this.$refs.edtdescricao.focus()
          }, 500);
        });
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

    doSave(doCheckin) {
      this.errors = [];

      petra
        .axiosPost("/app/pessoas/", this.form, true)
        .then(response => {
          petra.showMessageSuccess("Pessoa gravada com sucesso");
          this.state = "browse";
          if (doCheckin){
            //console.log("Adicionar para checkin ",response.data.id)
            this.handleSelecionarParaHospedagem(response.data)
          }
          this.doGetAll();
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
};
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