<template>
  <div>
    <el-row class="container" type="flex" justify="center" align="middle">
      <el-col :sm="24" :md="18" :lg="12">

          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="top"
            size="small"
            label-width="140px"
          >
            <el-form-item label="Nome" prop="name">
              <el-input v-model="form.name" ref="edtname"></el-input>
            </el-form-item>

            <el-form-item label="Usuário" prop="username">
              <el-input v-model="form.username" ref="edtusermame"></el-input>
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" ref="edtemail"></el-input>
            </el-form-item>

            <el-form-item label="Senha" prop="password">
              <el-input type="password" v-model="form.password" ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="create">Create New User</el-button>
            </el-form-item>
          </el-form>
      </el-col>
    </el-row>
  </div>

</template>

<script>

export default {

  name: 'CreateNewUser',

  created(){
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.edtname.focus()
      }, 500)
    })
  },

  mounted(){

    this.$store.dispatch('setAcao','Create New User')
      
  },

  data: () =>({
    dados: [],

    form : {
      name,
      username : null,
      email : null,
      password : null,
    },

    errors : [],

    rules: {
      name: [
        { required: true, message: "Preencha o Nome",trigger: "blur"},
        { min: 4, max: 64, message: "O usuário deve ter entre 4 a 64 caracteres",trigger: "blur"}
      ],
      username: [
        { required: true, message: "Preencha o usuário",trigger: "blur"},
        { min: 3, max: 32, message: "Usuário deve ter de 3 a 32 caracteres",trigger: "blur"}
      ],
      email: [
        { required: true, message: "Preencha o email",trigger: "blur"},
        { max: 64, message: "Email deve possuir até 64 caracteres",trigger: "blur"}
      ],
      password: [
        { required: true, message: "Entre com a senha",trigger: "blur"},
        { min: 6, max: 16, message: "Senha deve haver de 6 a 16 caracteres",trigger: "blur"}
      ],
    }

  }),

  methods: {

    create(){
      this.errors = [];

      petra.axiosPost("/auth/assinar/", this.form, true)
        .then(response => {
          petra.showMessageSuccess('Usuário incluído com sucesso')
        })
        .catch(error => {
          console.log(error)
          this.erros = petra.tratarErros(error)
        })

    },

  }
}
</script>

<style scoped>

.container{
  height: 500px;
}

.el-col{
  padding-bottom:0px;
}

.el-form{
  /*background-color:white;*/
  padding:10px;
}

</style>
