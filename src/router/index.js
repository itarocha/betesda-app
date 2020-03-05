import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/views/Home'
import Teste from '@/components/Teste'
import Login from '@/views/auth/Login'
import RedefinirSenha from '@/views/auth/RedefinirSenha'
import CreateNewUser from '@/views/auth/CreateNewUser'

import SituacoesLeitos from '@/views/cadastros/SituacoesLeitos'
import TiposHospedes from '@/views/cadastros/TiposHospedes'
import TiposServicos from '@/views/cadastros/TiposServicos'
import DestinacoesHospedagens from '@/views/cadastros/DestinacoesHospedagens'
import TiposLeitos from '@/views/cadastros/TiposLeitos'
import Pessoas from '@/views/cadastros/Pessoas'
import Entidades from '@/views/cadastros/Entidades'
import Quartos from '@/views/cadastros/Quartos'
import Checkin from '@/views/movimentacao/Checkin'
import Hospedagens from '@/views/movimentacao/Hospedagens'
import PlanilhaGeral from '@/views/movimentacao/PlanilhaGeral'

import TelaHospedagem from '@/views/hpd/TelaHospedagem'

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
      path: '/teste',
      name: 'teste',
      component: Teste
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresVisitor: true
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
        path: '/login',
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