import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function containsRole(state, role){
    const user =  state.token ?  petra.parseJwt(state.token) : null
    if (user && user.realm_access && user.realm_access.roles){
        const roles = user.realm_access.roles
        return roles.indexOf(role) >= 0
     }
    return false
}


export default new Vuex.Store({
    state:{ // data
        token: localStorage.getItem('token') || null,
        snackbar : false,
        numero : 0,

        flashMessage : {
            title : null,
            message : null,
            type : 'info',
        },
        tela: {
            descricao : '',
            acao : ''
        },
        count: 0,
        user: {
            name: '',
            email: ''
        },
        aguardando: [],
        formHospedagem:{
            entidadeId: null,
            encaminhadorId: null,
            dataEntrada: null,    
            dataPrevistaSaida: null,
            destinacaoHospedagemId: null,
            tipoUtilizacao: null,
            servicos: [],
            observacoes : null
        },
    },

    getters:{ // computed properties
        loggedIn(state){
            return state.token != null
        },

        titulo(state){
            var descricao = ((state.tela.descricao == "") ? "" : " - " +state.tela.descricao);
            var acao = ((state.tela.acao == "") ? "" : " - " +state.tela.acao);
            return "Casa Betesda" + descricao + acao;
        },

        snackbar(state){
            return state.snackbar
        },

        numero(state){
            return state.numero
        },

        flashMessage(state){
            return state.flashMessage
        },

        user(state){
            return state.token ?  petra.parseJwt(state.token) : null
        },
        
        isUser(state){
            return containsRole(state, "USER")
        },
        
        isAdmin(state){
            return containsRole(state, "ADMIN")
        },
        
        isRoot(state){
            return containsRole(state, "ROOT")
        },
        
        aguardando : state => state.aguardando,

        formHospedagem : state => state.formHospedagem,
        
        qtdAguardando : state => {
            return state.aguardando.length
        },
    },

    // chamadas com $store.dispatch('metodo',valor)

    actions:{ // methods asyncronous

        retrieveToken(context, credentials){
            return new Promise((resolve, reject) => {
                axios.post(petra.base_uri+"/auth/login", {
                    usernameOrEmail: credentials.username,
                    password: credentials.password
                })
                .then(response => {
                    const token = response.data.accessToken
                    localStorage.setItem('token', token)
                    context.commit('retrieveToken', token)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        destroyToken(context){
            if (context.getters.loggedIn){
                localStorage.removeItem('token')
                context.commit('destroyToken')
            }
        },
        increment(state){
            state.commit('increment')
        },
        decrement(state){
            state.commit('decrement')
        },
        setDescricao(state, descricao){
            state.commit('setDescricao', descricao)
        },
        setAcao(state, acao){
            state.commit('setAcao', acao)
        },
        setSnackbar(state, valor){
            state.commit('setSnackbar', valor)
        },
        setNumero(state, numero){
            status.commit('setNumero',numero)
        },
        showFlashMessage(state, message){
            var num = Math.floor(Math.random() * 10)
            state.commit('setNumero', num)
            state.commit('setFlashMessage', message)
        },

        //Entrada. chamar com store.dispatch('addAguardando',pessoa)

        setFormHospedagem(context, form){
            context.commit('setFormHospedagem', form)
        },

        addAguardando(context, pessoa) {
            context.commit('addAguardando', pessoa) // 
        },

        clearFlashMessage(state){
            state.commit('clearFlashMessage')
        },

        setTipoHospede(state, data){        
            state.commit('setTipoHospede', data)
        },
        setAcomodacao(state, data){        
            state.commit('setAcomodacao', data)
        },
        limparHospedagem(state){        
            state.commit('limparHospedagem')
        },
        removerHospede(state, data){        
            state.commit('removerHospede', data)
        },
    },

    mutations:{ //changing the state - call mutations
        increment(state){
            state.count++
        },
        decrement(state) {
            state.count--
        },
        setUser(store, obj){
            store.user = obj
        },
        setDescricao(state, descricao){
            state.tela.descricao = descricao
            state.tela.acao = ''
        },
        setAcao(state, acao){
            state.tela.acao = acao
        },
        setSnackbar(state, valor){
            state.snackbar = valor
        },
        setNumero(state, numero){
            state.numero = numero
        },
        setFlashMessage(state, flashMessage){
            state.flashMessage = flashMessage
        },
        retrieveToken(state, token){
            state.token = token
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`

            var decode = petra.parseJwt(token)
            state.user = decode
        },
        destroyToken(state){
            state.token = null
            state.user = null
            delete axios.defaults.headers.common['Authorization'];
        },

        setFormHospedagem(state, form){
            state.formHospedagem = form
        },

        //Onde as coisas acontecem
        addAguardando(state, pessoa){
            
            var p = _.find(state.aguardando, {nome: pessoa.nome})
            if (p){
                petra.showMessageWarning(`${pessoa.nome} já foi adicionada` )    
            } else {
                petra.showMessageSuccess(`Adicionando: ${pessoa.nome}`)

                var aguardando = {
                    pessoa : { id : pessoa.id, nome: pessoa.nome},
                    tipoHospede : null,
                    acomodacao : null
                }

                state.aguardando.push(aguardando)
            }
        },

        setTipoHospede(state, data){
            var hospede =  _.find(state.aguardando,{pessoa : {id : data.pessoaId}})
            if (hospede){
                hospede.tipoHospede = data.tipoHospede
            }
        },

        setAcomodacao(state, data){
            var hospede =  _.find(state.aguardando,{pessoa : {id : data.pessoaId}})
            if (hospede){
                hospede.acomodacao = data.acomodacao
            }
        },

        limparHospedagem(state){     
            state.aguardando = [],
        
            state.formHospedagem = {
                entidadeId: null,
                encaminhadorId: null,
                dataEntrada: null,    
                dataPrevistaSaida: null,
                destinacaoHospedagemId: null,
                tipoUtilizacao: null,
                servicos: [],
                observacoes : null
            }
        },

        removerHospede(state, data){        
            var hospede =  _.find(state.aguardando,{pessoa : {id : data.pessoa.id}})
            if (hospede){
                var index = state.aguardando.indexOf(hospede)
                if (index > -1){
                    state.aguardando.splice(index,1)
                }
                state.aguardando.indexOf(hospede)
            }
        },

        clearFlashMessage(state){
            state.flashMessage = {
                title : null,
                message : null,
                type : 'info'
            }
        }
    },
})