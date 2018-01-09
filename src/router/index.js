import Vue from 'vue'
import VueRouter from 'vue-router'
import { LoadingBar } from 'iview'
import { Main, Home, Detail } from '@/page'

const errorRoutes = [
	{
		path: '/*',
		name: '404',
		component: {
			template: '<h1>404</h1>'
		}
	}
]

const mainRoutes = [
	{
		path: '/',
		name: 'main',
		component: Main,
		children: [
			{
				path: '',
				name: 'home',
				title: 'Home',
				component: Home
			},
			{
				path: 'detail',
				name: 'detail',
				title: 'Detail',
				component: Detail
			}
		]
	},
	{
		path: '/age',
		name: 'age',
		component: Main,
		children: [
			{
				path: '',
				name: 'agehome',
				title: 'Aage Home',
				component: Home
			},
			{
				path: 'detail',
				name: 'agedetail',
				title: 'Aage Detail',
				component: Detail
			}
		]
	},
	{
		path: '/',
		name: 'list',
		title: 'List',
		component: Main,
		children: [
			{
				path: 'list',
				name: 'list',
				title: 'List',
				component: {template: '<div>List</div>'}
			}
		]
	}
]

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	routes: [
		...mainRoutes,
		...errorRoutes
	]
})

router.beforeEach((to, from, next) => {
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
