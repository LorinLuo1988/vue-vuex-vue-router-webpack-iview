import Vue from 'vue'
import VueRouter from 'vue-router'
import { Home, Detail } from '@/page'

const routes = [
	{ path: '/', component: Home },
	{ path: '/detail', component: Detail }
]

Vue.use(VueRouter)

export default new VueRouter({
	mode: 'history',
	routes
})
