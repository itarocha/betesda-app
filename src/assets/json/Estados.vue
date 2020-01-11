<template>
  <b-container class="formulario">
    <b-form>
    
      <b-form-group label="Estados">
        <b-form-select v-model="estado" :options="estados" class="mb-3"></b-form-select>
      </b-form-group>
      
      <b-form-group label="Cidade">
        <b-form-select v-model="cidade" :options="cidades" class="mb-3"></b-form-select>
      </b-form-group>
      
    </b-form>
  </b-container>
</template>
<style>
.formulario {
  text-align: left;
  width: 50%;
}
</style>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import brasil from "../assets/estados/brasil.json";

export default {
  name: "Estados",

  data() {
    return {
      cidades: [],
      estado: null,
      cidade: null,
      brasil,
      estados: [
        { value: null, text: "Selecione um estado" },
        { value: "AC", text: "Acre" },
        { value: "AL", text: "Alagoas" },
        { value: "AP", text: "Amapá" },
        { value: "AM", text: "Amazonas" },
        { value: "BA", text: "Bahia" },
        { value: "CE", text: "Ceará" },
        { value: "DF", text: "Distrito Federal" },
        { value: "ES", text: "Espírito Santo" },
        { value: "GO", text: "Goiás" },
        { value: "MA", text: "Maranhão" },
        { value: "MT", text: "Mato Grosso" },
        { value: "MS", text: "Mato Grosso do Sul" },
        { value: "MG", text: "Minas Gerais" },
        { value: "PA", text: "Pará" },
        { value: "PB", text: "Paraíba" },
        { value: "PR", text: "Paraná" },
        { value: "PE", text: "Pernambuco" },
        { value: "PI", text: "Piauí" },
        { value: "RJ", text: "Rio de Janeiro" },
        { value: "RN", text: "Rio Grande do Norte" },
        { value: "RS", text: "Rio Grande do Sul" },
        { value: "RO", text: "Rondônia" },
        { value: "RR", text: "Roraima" },
        { value: "SC", text: "Santa Catarina" },
        { value: "SP", text: "São Paulo" },
        { value: "SE", text: "Sergipe" },
        { value: "TO", text: "Tocantins" }
      ]
    };
  },
  watch: {
    'estado': function () {
      this.cidades = brasil[this.estado].cidades
    }
  },
  methods: {
  }
};
</script>