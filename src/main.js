import Vue from 'vue'
import { Icon } from 'iview'
import 'iview/dist/styles/iview'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import '@/style/common'

// 注册全局组建
Vue.component('Icon', Icon)

export default new Vue({
	el: '#app',
	router,
	store,
	template: '<App />',
	components: { App }
})
