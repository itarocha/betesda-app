import axios from 'axios'

export const http = axios.create({
	baseURL: 'http://localhost:5000/'
})

export default function install (Vue) {
	Object.defineProperty(Vue.prototype, '$api', {
		get () {
			return http
		}
	})
}

// PARA USAR
// import api from './plugins/axios'
// Vue.use(api)