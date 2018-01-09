import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home'
import detail from './modules/detail'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		isCollapsed: false, // 左侧sider是否折叠
		openMenuNames: [] // 左侧sider menu展开项
	},
	getters: {
		name: state => {
			return `${state.home.name} ${state.detail.name}`
		}
	},
	mutations: mutations,
	actions: actions,
	modules: {
		home,
		detail
	},
	strict: process.env.NODE_ENV !== 'production'
})

if (module.hot) {
	module.hot.accept([
		'./modules/home',
		'./modules/detail'
	], () => {
		const home = require('./modules/home').default
		const detail = require('./modules/detail').default

		store.hotUpdate({
			modules: {
				home,
				detail
			}
		})
	})
}

export default store
