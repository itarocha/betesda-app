<template>
  <div id="app">
    <el-container>
        <el-aside width="240px">
          <el-row class="logo-container" type="flex" justify="center" align="middle">
            <el-col class="logo-texto">
              Betesda
            </el-col>
          </el-row>  

          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#F0F2F1"
            text-color="#455A64"
            active-text-color="#00796B">

            <el-menu-item index="1-1">
                <router-link to="/" tag="div"><i class="fas fa-home pr"></i>Home</router-link>
            </el-menu-item>

            <el-menu-item index="1-2" v-if="isRoot || isAdmin">
                <router-link to="/situacoes_leitos" tag="div"><i class="fas fa-check-circle pr"></i>Situações de Leitos</router-link>
            </el-menu-item>

            <el-menu-item index="1-3" v-if="isRoot || isAdmin">
                <router-link to="/tipos_hospedes" tag="div"><i class="fas fa-tag pr"></i>Tipos de Hóspedes</router-link>
            </el-menu-item>

            <el-menu-item index="1-4" v-if="isRoot || isAdmin  || isUser" >
                <router-link to="/tipos_leitos" tag="div"><i class="fas fa-bed pr"></i>Tipos de Leitos</router-link>
            </el-menu-item>

            <el-menu-item index="1-5" v-if="isRoot || isAdmin">
                <router-link to="/tipos_servicos" tag="div"><i class="fas fa-coffee pr"></i>Tipos de Serviços</router-link>
            </el-menu-item>

            <el-menu-item index="1-6" v-if="isRoot || isAdmin">
                <router-link to="/destinacoes_hospedagens" tag="div"><i class="fas fa-heartbeat pr"></i>Destinações</router-link>
            </el-menu-item>

            <el-menu-item index="1-7" v-if="isRoot || isAdmin || isUser">
                <router-link to="/quartos" tag="div"><i class="fas fa-hospital pr"></i>Quartos</router-link>
            </el-menu-item>

            <el-menu-item index="2-1" route="tela" v-if="isRoot || isAdmin || isUser">
              <router-link to="/entidades" tag="div"><i class="fas fa-university pr"></i>Entidades</router-link>
            </el-menu-item>
            <el-menu-item index="2-2" v-if="isRoot || isAdmin || isUser">
                <router-link to="/pessoas" tag="div"><i class="fas fa-users pr"></i>Pessoas</router-link>
            </el-menu-item>
            <el-menu-item index="2-3" v-if="isRoot || isAdmin || isUser">
                <router-link to="/checkin" tag="div"><i class="fas fa-sign-in-alt pr"></i>Checkin</router-link>
            </el-menu-item>
            <el-menu-item index="2-5" v-if="isRoot || isAdmin || isUser">
                <router-link to="/hospedagens" tag="div"><i class="fas fa-suitcase pr"></i>Hospedagens</router-link>
            </el-menu-item>

            <el-menu-item index="2-6" v-if="isRoot || isAdmin || isUser">
                <router-link to="/planilha_geral" tag="div"><i class="fas fa-file-excel pr"></i>Planilha Geral</router-link>
            </el-menu-item>

            <el-menu-item index="2-7" v-if="isRoot">
                <router-link to="/create_new_user" tag="div"><i class="fas fa-eye pr"></i>Administrador</router-link>
            </el-menu-item>
          </el-menu>
        </el-aside>
      <el-container>
        <el-header class="back-title">
          <el-row class="title-container" type="flex" justify="center" align="middle">
            <el-col :span="15" class="header-title">{{titulo}}{{numero}}</el-col>

            <el-col :span="3" class="header-menu">
              <el-badge :value="aguardando.length" class="item" v-if="aguardando.length > 0">
                <el-button size="small" @click="handleOpenCheckin">Checkin</el-button>
              </el-badge>
            </el-col>
            <el-col :span="6" class="header-menu">
              <span v-if="loggedIn">{{user.name}}</span>
              <el-button type="primary" size="medium" @click.native="handleLogin" v-if="!loggedIn" >LOGIN</el-button>
              <el-button type="primary" size="medium" @click.native="handleLogout" v-if="loggedIn" >LOGOUT</el-button>
            </el-col>

          </el-row>
        </el-header>

        <el-main>
          <!--user = {{user}} - isAdmin = {{isAdmin}} - isRoot = {{isRoot}}-->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>  
    
  </div>
</template>

<script>
export default {
  name: 'App',

  data : () => ({

  }),

  watch:{

    aguardando: {
      deep: true,
      handler() {
        //var itens = this.$store.getters.aguardando
      }
    }

  },

  computed: {

    env(){
      return petra.env()
    },

    loggedIn(){
      return this.$store.getters.loggedIn
    },

    titulo(){
      return this.$store.getters.titulo
    },

    user(){
      return this.$store.getters.user
    },

    isUser(){
      const  _isUser = this.$store.getters.isUser
      console.log("_isUser = "+  _isUser)
      return _isUser
    },

    isAdmin(){
      return this.$store.getters.isAdmin
    },

    isRoot(){
      return this.$store.getters.isRoot
    },

    numero(){
      var fm = this.$store.getters.flashMessage
      if (fm.message != null){
        fm.onClose = this.handleCloseNotify;
        this.$notify(fm);
      }
      return null
    },

    aguardando(){
      return this.$store.getters.aguardando;
    },

    qtdAguardando(){
      var qtdAguardando = this.$store.getters.qtdAguardando;
    }

  },

  methods: {
    handleOpenCheckin(){
      //console.log("open checkin")
      this.$router.push({name: 'checkin'})
    },

    handleCloseNotify(){
      this.$store.dispatch('clearFlashMessage')
    },

    handleLogin(){
      this.$router.push({name: 'login'})
    },
    
    handleLogout(){
      petra.doLogout()
    },

  },

}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');
@import url('https://fonts.googleapis.com/css?family=Dosis');

body{
  margin: 0;
}

#app {
  font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
  --webkit-font-smoothing: antialiased;
  --moz-osx-font-smoothing: grayscale;
  line-height: 1.2em;
  /*color:#2c3e50;*/
}

.pr{
  font-size: 1.4em;
  padding-right: 8pt;
}

.container {
  max-width: 1200px;
  margin:auto;
}

.el-menu-item{
  height: 38px;
  line-height: 40px;
}

  .el-table .vermelho {
    background: red !important;
    color: white;
    cursor: pointer;
  }

  .el-table .azul {
    background-color: blue !important;
    color: pink;
    cursor: pointer;
  }

  /*
  .el-table .wordwrap{
    color:green;
    word-break: normal !important;
    text-transform: uppercase;
  }
  */

  /* Mantenha isso para evitar que as palavras quebrem no meio*/
  .el-table .cell{
    word-break: keep-all;
  }


  .el-table .red-row {
    color:red !important;
  }

  .el-table .green-row {
    color:green !important;
  }


  .el-table .warning-row {
    color:red !important;
    /*background-color:red !important;*/
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-dialog__body{
    padding: 0px 10px;
  }

 .el-card__body {
    padding: 8px;
  }

.el-aside {
  background: #F0F2F1;
  color:white;
  min-height: 100vh;
}

.logo-container{
  text-align: center;
  height: 60px;
  background: #434a50;
}

.back-title{
  background-color: #00796B;
  color: #fff;
}

.title-container{
  height: 60px;
}

.el-menu-demo {
  height: 60px;
}

.logo-texto{
  font-size: 16pt;
  color:#F0F2F1;
}

.header-title{
  font-size:18pt;
  font-weight: bold;
}

.header-menu{
  text-align: right;
}

.el-menu {
  border-right: 0 !important;
}

.el-submenu span{
  font-size: 10pt;
}

.el-menu-item {
    font-size: 10pt;
}

.el-main {
  background: #FAFAFA;
}

/*
.el-select .el-input {
  width: 180px;
}
*/

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

/*
.notify_warning {
  background-color: orange;
  color: white !important;
}

.el-notification div{
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
*/

.el-collapse-item .grey-lighten-4{
  background-color: brown;
}

.el-collapse-item .amber-lighten-4{
    background-color:#FFECB3;
}

.el-collapse-item__header{
  font-weight: bold;
}

.subtitulo {
  text-align: center;
  border-radius: 4px;
}

.bg-purple {
  background: #d3dce6;
}

.font-size-2{
  font-size: 2em;
}

.font-weight-bold{
  font-weight: bold;
}

.font-size-10{
  font-size: 10pt;
}

.font-size-8{
  font-size: 8pt;
}

.cv-header{
  margin:0;
  font-size: 8pt !important;
}

.cv-weeks{
  font-size:10pt !important;
}

.theme-default .cv-day.today{
  background: #FFECB3;
}

.periodLabel{
  padding:0;
  margin:0;
}

</style>


