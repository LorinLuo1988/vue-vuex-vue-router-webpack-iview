import Vue from 'vue'
import { Icon } from 'iview'
import 'iview/dist/styles/iview.css'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/style/common.less'

Vue.component('Icon', Icon)

export default new Vue({
	el: '#app',
	router,
	store,
	template: '<App />',
	components: { App }
})
