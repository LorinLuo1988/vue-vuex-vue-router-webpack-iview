import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home'
import detail from './modules/detail'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {},
	getters: {
		name: state => {
			return `${state.home.name} ${state.detail.name}`
		}
	},
	mutations: {},
	actions: {},
	modules: {
		home,
		detail
	},
	strict: process.env.NODE_ENV !== 'production'
})

export default store
