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
            <el-form-item label="Usuário" prop="username">
              <el-input v-model="form.username" ref="edtusermame"></el-input>
            </el-form-item>

            <el-form-item label="Senha" prop="password">
              <el-input type="password" v-model="form.password" ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="login">Login</el-button>
            </el-form-item>
          </el-form>
      </el-col>
    </el-row>
  </div>

</template>

<script>

export default {

  name: 'Login',

  created(){
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.edtusermame.focus()
      }, 500)
    })
  },

  mounted(){

    this.$store.dispatch('setAcao','Login')
      
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
        { min: 6, max: 16, message: "Senha deve haver de 6 a 16 caracteres",trigger: "blur"}
      ],
    }

  }),

  methods: {

    login(){
      this.$store.dispatch('retrieveToken',
      {
        username: this.form.username,
        password : this.form.password
      }).then(response => {
        //this.$router.push({name: 'hospedagens'})
        //console.log(response.data)

        //petra.showMessageSuccess('Usuário logado com sucesso')
        petra.showMessageInfo('Usuário logado com sucesso')

        this.$router.push({name: 'home'}) // hospedagens
      }).catch(error =>{
        console.log(error)
        petra.showMessageError('Usuário ou senha inválidos')
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
