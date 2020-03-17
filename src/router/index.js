import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/containers/Home'

//import Login from '@/containers/auth/Login'
import RedefinirSenha from '@/containers/auth/RedefinirSenha'
import CreateNewUser from '@/containers/auth/CreateNewUser'

import SituacoesLeitos from '@/containers/cadastros/SituacoesLeitos'
import TiposHospedes from '@/containers/cadastros/TiposHospedes'
import TiposServicos from '@/containers/cadastros/TiposServicos'
import DestinacoesHospedagens from '@/containers/cadastros/DestinacoesHospedagens'
import TiposLeitos from '@/containers/cadastros/TiposLeitos'
import Pessoas from '@/containers/cadastros/Pessoas'
import Entidades from '@/containers/cadastros/Entidades'
import Quartos from '@/containers/cadastros/Quartos'

import Checkin from '@/containers/movimentacao/Checkin'
import Hospedagens from '@/containers/movimentacao/Hospedagens'
import PlanilhaGeral from '@/containers/movimentacao/PlanilhaGeral'

import TelaHospedagem from '@/containers/hpd/TelaHospedagem'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/situacoes_leitos',
      name: 'situacoes_leitos',
      component: SituacoesLeitos,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/tipos_hospedes',
      name: 'tipos_hospedes',
      component: TiposHospedes,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/tipos_servicos',
      name: 'tipos_servicos',
      component: TiposServicos,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/destinacoes_hospedagens',
      name: 'destinacoes_hospedagens',
      component: DestinacoesHospedagens,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/tipos_leitos',
      name: 'tipos_leitos',
      component: TiposLeitos,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/quartos',
      name: 'quartos',
      component: Quartos,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/pessoas',
      name: 'pessoas',
      component: Pessoas,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/entidades',
      name: 'entidades',
      component: Entidades,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/hello',
      name: 'hello',
      component: HelloWorld
    },
    {
      path: '/checkin',
      name: 'checkin',
      component: Checkin,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/hospedagens',
      name: 'hospedagens',
      component: Hospedagens,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/planilha_geral',
      name: 'planilha_geral',
      component: PlanilhaGeral,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tela_hospedagem',
      name: 'tela_hospedagem',
      component: TelaHospedagem,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/redefinir-senha/:token',
      name: 'redefinir_senha',
      component: RedefinirSenha,
      meta: {
        requiresVisitor: true
      }
    },
    {
      path: '/create_new_user',
      name: 'create_new_user',
      component: CreateNewUser,
    },
  ]
})

router.beforeEach((to, from, next) => {
 
  //console.log('beforeEach in route from ', from)
  if(to.matched.some(record => record.meta.requiresAuth)){
    var loggedIn = store.getters.loggedIn
    //console.log("Path: ",to.path," loggedIn = ",loggedIn," meta = ", to.meta)
    if (!loggedIn){
      next({
        __path: '/login',
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

/*

    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresVisitor: true
      }
    },


*/