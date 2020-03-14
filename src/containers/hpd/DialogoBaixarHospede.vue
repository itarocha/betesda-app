<template>
  <div>
    <el-dialog title="Selecionar Data de Baixa" :visible.sync="visible" width="500px">
      <listagem-erros :errors="errors"></listagem-erros>
      <el-form :model="form" label-position="left" label-width="140px;">
        <el-row type="flex">
          <el-col>
            <el-form-item label="Data de Baixa">
              <el-date-picker type="date" v-model="form.data" format="dd/MM/yyyy" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>    
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleConfirmar(false)">Cancelar</el-button>
        <el-button type="primary" @click="handleConfirmar(true)" :disabled="form.data == null">Confirmar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import ListagemErros from "../../components/ListagemErros"


export default {
  name: "DialogoBaixarHospede",
  
  props : ['visible','hospedeId'],

  components:{
    ListagemErros
  },

  data: () =>({
    form : {
      data : null
    },
    
    errors : [],
  }),

  methods: {
    handleConfirmar(ok){
      if (ok && this.form.data != null){
        this.doConfirmar(this.hospedeId, this.form.data)
      } else {
        this.reset()
        this.$emit('close',false)
      }
    },

    doConfirmar(hospedeId, data) {
      const dados = {
        hospedeId : hospedeId,
        data : data
      }

      petra.axiosPost("/app/hospedagem/mapa/baixar", dados, false)
        .then(response => {
          this.reset()
          this.$emit('close',true)
          petra.showMessageSuccess('Hóspede baixado com sucesso')
        }).catch(error => {
          this.errors = petra.tratarErros(error);
        })
    },

    reset(){
      this.errors=[]
      this.form.data = null
    }
  }  
};
</script>
