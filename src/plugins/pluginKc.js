const defaultOptions = {
    cutoff: 50,
    keycloak : null,
  };

export default {
    install(Vue, options){
        let localOptions = {...defaultOptions, ...options}

        Vue.prototype.$logout = function() {
            console.log("EFETUANDO LOGOUT NO KEYCLOAK")
            localOptions.keycloak.logout()
        }

    }
}
