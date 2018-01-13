import Vue from 'vue'
import VueRouter from 'vue-router'
import { LoadingBar } from 'iview'
import { getBreadcrumbs } from '@/util'
import store from '@/store'
import mainRoutes from './main'
import redirectRoutes from './redirect'
import errorRoutes from './error'

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	routes: [
		...mainRoutes,
		...redirectRoutes,
		...errorRoutes
	]
})

router.beforeEach((to, from, next) => {
	const breadcrumbs = getBreadcrumbs(to.name, mainRoutes)

	store.commit('updateBreadcrumbs', breadcrumbs)
	LoadingBar.start()
	next()
})

router.afterEach((to, from) => {
	LoadingBar.finish()
})

export {
	mainRoutes
}

export default router
