import Vue from 'vue'
import VueRouter from 'vue-router'
import { LoadingBar } from 'iview'
import { Main } from '@/page'

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
		path: '/data-manage',
		name: 'data-manage',
		title: '数据管理',
		icon: 'android-menu',
		component: Main,
		children: [
			{
				path: 'case-import',
				name: 'case-import',
				title: '案件导入',
				component: {template: '<div>案件导入</div>'}
			},
			{
				path: 'case-manage',
				name: 'case-manage',
				title: '案件管理',
				component: {template: '<div>案件管理</div>'}
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
