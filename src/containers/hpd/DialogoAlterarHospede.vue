<template>
  <div>
    <el-dialog title="Selecionar Tipo de Hóspede" :visible.sync="visible" width="500px">
      <listagem-erros :errors="errors"></listagem-erros>
      <el-form :model="form" label-position="left" label-width="140px;">

        <el-row type="flex">
          <el-col>
            <div class="font-weight-bold" style="font-size:1.2em; padding-bottom:5px;">{{nomeHospede}}</div>
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col>
            <el-form-item label="Tipo de Hóspede">
              <el-select v-model="form.tipoHospedeId" placeholder="Selecione um Tipo" style="width: 100%;"> 
                <el-option
                  v-for="item in itensTipoHospede"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleConfirmar(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleConfirmar(true)" :disabled="form.tipoHospedeId == null">Confirmar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import ListagemErros from "../../components/ListagemErros"


export default {
  name: "DialogoAlterarHospede",
  
  props : ['visible','config'],

  components:{
    ListagemErros
  },
  
  watch: {
    config:{
      deep: true,
      handler(){
        const hospede = this.config ? this.config.hospede : null
        // veja se é possível fazer assim: const {hospede} = this.config
        this.nomeHospede = hospede ? hospede.pessoa.nome : ""
        this.hospedeId = hospede ? hospede.id : null
        this.tipoHospedeId = hospede ? hospede.tipoHospedeId : null
        this.form.tipoHospedeId = this.tipoHospedeId
      }
    },
  },
  

  data: () =>({
    form : {
      tipoHospedeId : null
    },

    nomeHospede : "",
    hospedeId : null,
    tipoHospedeId : null,

    itensTipoHospede : [],
    
    errors : [],
  }),

  mounted() {
    this.loadListas()
  },

  methods: {
    handleConfirmar(ok){
      if (ok && this.form.tipoHospedeId != null){
        this.doConfirmar(this.hospedeId, this.form.tipoHospedeId)
      } else {
        this.reset()
        this.$emit('close',false)
      }
    },

    doConfirmar(hospedeId, tipoHospedeId) {
      const dados = {
        hospedeId : hospedeId,
        tipoHospedeId : tipoHospedeId
      }

      petra.axiosPost("/app/hospedagem/alterar_hospede", dados, false)
        .then(response => {
          this.reset()
          this.$emit('close',true)
          petra.showMessageSuccess('Hóspede alterado com sucesso')
        }).catch(error => {
          this.errors = petra.tratarErros(error);
        })
    },

    loadListas() {
      this.itensDestinacaoHospedagem = [];
      petra.axiosGet("/app/quarto/listas",false).then(
        response => {
          //this.itensDestinacaoHospedagem = response.data.listaDestinacaoHospedagem
          //this.itensTipoLeito = response.data.listaTipoLeito
          //this.itensSituacaoLeito = response.data.listaSituacaoLeito
          //this.itensTipoServico = response.data.listaTipoServico
          this.itensTipoHospede = response.data.listaTipoHospede
          //this.itensEntidades = response.data.listaEntidade
        })
    },


    reset(){
      this.errors=[]
      this.form.tipoHospedeId = null
    }
  }  
};
</script>
