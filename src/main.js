import Vue from 'vue'
import 'iview/dist/styles/iview.css'
import iView from 'iview'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/style/common.less'

Vue.use(iView)

export default new Vue({
	el: '#app',
	router,
	store,
	template: '<App />',
	components: { App }
})
