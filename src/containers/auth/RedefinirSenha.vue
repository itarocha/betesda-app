<template>
  <div>
    <el-row class="container" type="flex" justify="center" align="middle">
      <el-col :sm="24" :md="18" :lg="12">
          <h2>TOKEN: {{ $route.params.token }}</h2>
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="top"
            size="small"
            label-width="140px"
          >
            <el-form-item label="Token" prop="token">
              <el-input v-model="form.token" ref="edttoken"></el-input>
            </el-form-item>

            <el-form-item label="Nova Senha" prop="password">
              <el-input type="password" v-model="form.password" ref="edtpassword"></el-input>
            </el-form-item>

            <el-form-item label="Confirmação" prop="confirmation">
              <el-input type="password" v-model="form.confirmation" ref="edtconfirmation"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="login">Enviar</el-button>
            </el-form-item>
          </el-form>
      </el-col>
    </el-row>
  </div>

</template>

<script>

export default {

  name: 'RedefinirSenha',

  created(){
    //console.log("created()",this.$route.params)
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.edtpassword.focus()
      }, 500)
    })
  },

  mounted(){

    this.$store.dispatch('setAcao','Redefinir Senha')
    this.form.token = this.$route.params.token

  },

  // https://element.eleme.io/#/en-US/component/form
  data() {
      /*
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password'));
        } else {
          if (this.form.confirmation !== '') {
            this.$refs.form.validateField('confirmation');
          }
          callback();
        }
      };
      */
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Por favor, entre com a senha novamente'));
        } else if (value !== this.form.password) {
          callback(new Error('As duas senhas devem ser idênticas'));
        } else {
          callback();
        }
      };
      return {
        form: {
          password: '',
          confirmation: '',
          token: ''
        },
        rules: {
          token: [
            { required: true, message: "Preencha o token",trigger: "blur"},
          ],
          password: [
            { required: true, message: "Entre com a senha",trigger: "blur"},
            { min: 6, max: 16, message: "Senha deve haver de 6 a 16 caracteres",trigger: "blur"}
          ],
          confirmation: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      }
    },

  methods: {

    login(){
      this.$store.dispatch('retrieveToken',
      {
        token: this.form.token,
        password : this.form.password,
        confirmation : this.form.confirmation
      }).then(response => {
        //this.$router.push({name: 'hospedagens'})
        //console.log(response.data)

        //petra.showMessageSuccess('Usuário logado com sucesso')
        petra.showMessageInfo('Usuário logado com sucesso')

        this.$router.push({name: 'home'}) // hospedagens
      }).catch(error =>{
        console.log(error)
        petra.showMessageError('Informações inválidas')
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
