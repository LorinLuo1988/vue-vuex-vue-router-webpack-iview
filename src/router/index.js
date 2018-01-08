import Vue from 'vue'
import VueRouter from 'vue-router'
import { LoadingBar } from 'iview'
import { Home, Detail } from '@/page'

const routes = [
	{ path: '/', component: Home },
	{ path: '/detail', component: Detail }
]

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	routes
})

router.beforeEach((to, from, next) => {
	LoadingBar.start()
	next()
})

router.afterEach((to, from) => {
	LoadingBar.finish()
})

export default router
