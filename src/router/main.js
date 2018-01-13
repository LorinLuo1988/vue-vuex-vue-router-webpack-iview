import * as pageComponents from '@/page'

export default [
	{
		path: '/data-manage',
		name: 'data-manage',
		title: '数据管理',
		icon: 'android-menu',
		component: pageComponents.Main,
		children: [
			{
				path: 'case-import',
				name: 'data-manage/case-import',
				title: '案件导入',
				component: pageComponents.CaseImport
			},
			{
				path: 'case-manage',
				name: 'data-manage/case-manage',
				title: '案件管理',
				component: {template: '<div>案件管理</div>'}
			}
		]
	}
]
