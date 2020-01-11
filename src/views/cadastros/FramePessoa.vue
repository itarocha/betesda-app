<template>
  <div>
      <el-header>
        <el-row type="flex">
          <el-tooltip content="Gravar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;">
              <el-button type="primary" @click="handleSave(false)">Gravar</el-button>
            </div>
          </el-tooltip>
          <el-tooltip v-if="canSelecionar" content="Gravar alterações e adicionar para hospedagem" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;">
              <el-button type="warning" @click="handleSave(true)">Gravar e Selecionar</el-button>
            </div>
          </el-tooltip>
          <el-tooltip content="Cancelar alterações" placement="bottom" :open-delay="toolTipDelay">
            <div style="margin-right:10px;">
              <el-button @click="handleCancel">Cancelar</el-button>
            </div>
          </el-tooltip>
          <div>Incluindo/Alterando Pessoa</div>
        </el-row>
      </el-header>

      <el-main style="padding-top: 0px;">
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
  </div>
</template>

<script>

import { mask } from "vue-the-mask";


export default {
  name: "FramePessoa",

  directives: { mask },

  props : ['id', 'canSelecionar'],

  components:{
  },
  
  watch: {
    id() {
      this.load()
    }
  },
  
  created() {
    this.resetData()
  },

  data: () =>({

    form: {},

    itensSexo: [
      { text: "MASCULINO", value: "M" }, 
      { text: "FEMININO", value: "F" }],
    itensEstadoCivil : [
      { text: "SOLTEIRO(A)", value:"S"},
      { text: "CASADO(A)", value:"C"},
      { text: "SEPARADO(A)", value:"P"},
      { text: "DIVORCIADO(A)", value:"D"},
      { text: "AMASIADO(A)", value:"A"},
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

    toolTipDelay: 500

  }),

  mounted() {
    this.load()
  },

  methods: {

    load(){

      ////console.log("resetando dados do frame-pessoa")

      this.resetData();

      if (this.id){
          this.doGetById(this.id)
      } else {
          this.setDefaultData()
      }

      this.$nextTick(() => {
          setTimeout(() => this.$refs.edtNome.focus(), 500)
      })      
    },

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

    doGetById(id) {
      petra.axiosGet(`/app/pessoas/${id}`).then(response => {
        this.form = response.data;
        this.$nextTick(() => {
          setTimeout(() => {
            //this.$refs.edtdescricao.focus()
          }, 500);
        });
      });
    },

    handleSave(doCheckin) {
      this.doSave(doCheckin);
    },

    doSave(doCheckin) {
      this.errors = [];

      petra
        .axiosPost("/app/pessoas/", this.form, true)
        .then(response => {
          petra.showMessageSuccess("Pessoa gravada com sucesso");
          this.$emit('save')
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

    handleSelecionarParaHospedagem(row){
      this.$store.dispatch('addAguardando', row)
    },

    handleCancel(){
        this.$emit('cancel')
    },

    getErro(campo) {
      var retorno = _.find(this.erros, { fieldName: campo });
      if (retorno) {
        return retorno.errorMessage;
      }
      return null;
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

    formatDate(data, formato) {
      return petraDateTime.formatDate(data, formato);
    },


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

.el-form {
  padding: 10px;
}

</style>

