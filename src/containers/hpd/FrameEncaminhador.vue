<template>
  <div>
    <el-row :gutter="5" class="font-size-10">
      <el-col :span="16">Encaminhador</el-col>
      <el-col :span="8">Cargo</el-col>
    </el-row>

    <el-row :gutter="5" class="font-weight-bold">
      <el-col :span="16" >{{encaminhador.nome}}</el-col>
      <el-col :span="8">{{encaminhador.cargo}}</el-col>
    </el-row>

    <el-row :gutter="5" class="font-size-10">
      <el-col :span="8">Telefone</el-col>
      <el-col :span="16">Email</el-col>
    </el-row>

    <el-row :gutter="5" class="font-weight-bold">
      <el-col :span="8">{{encaminhador.telefone}}</el-col>
      <el-col :span="16">{{encaminhador.email}}</el-col>
    </el-row>

    <el-row :gutter="5" class="font-size-10">
      <el-col :span="16">Entidade</el-col>
      <el-col :span="8">CNPJ</el-col>
    </el-row>

    <el-row :gutter="5" class="font-weight-bold">
      <el-col :span="16">{{entidade.nome}}</el-col>
      <el-col :span="8">{{entidade.cnpj | fmtCNPJ}}</el-col>
    </el-row>

    <el-row :gutter="5" class="font-size-10">
      <el-col :span="8">Telefone</el-col>
      <el-col :span="16">Email</el-col>
    </el-row>

    <el-row :gutter="5" class="font-weight-bold">
      <el-col :span="8">{{entidade.telefone}}</el-col>
      <el-col :span="16">{{entidade.email}}</el-col>
    </el-row>

    <el-row :gutter="5" class="font-size-10">
      <el-col :span="12">Endereço</el-col>
      <el-col :span="4">Número</el-col>
      <el-col :span="8">Complemento</el-col>
    </el-row>

    <el-row :gutter="5" v-if="entidade != null && entidade.endereco != null" class="font-weight-bold">
      <el-col :span="12">{{entidade.endereco.logradouro}}</el-col>
      <el-col :span="4">{{entidade.endereco.numero}}</el-col>
      <el-col :span="8">{{entidade.endereco.complemento}}</el-col>
    </el-row>

    <el-row :gutter="5" class="font-size-10">
      <el-col :span="8">Bairro</el-col>
      <el-col :span="4">CEP</el-col>
      <el-col :span="8">Cidade</el-col>
      <el-col :span="4">UF</el-col>
    </el-row>
    <el-row :gutter="5" v-if="entidade != null && entidade.endereco != null" class="font-weight-bold">
      <el-col :span="8">{{entidade.endereco.bairro}}</el-col>
      <el-col :span="4">{{entidade.endereco.cep | fmtCep }}</el-col>
      <el-col :span="8">{{entidade.endereco.cidade}}</el-col>
      <el-col :span="4">{{entidade.endereco.uf}}</el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: "FrameEncaminhador",
  
  props : ['encaminhador','entidade'],

  components:{
  },

  data: () =>({
  }),

  methods: {
  }  
};
</script>
