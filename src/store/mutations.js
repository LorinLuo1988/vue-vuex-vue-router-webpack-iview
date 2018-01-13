import { mainRoutes } from '@/router'
import { objectArrayIsIncludes, isNumber, isArray } from '@/util'

/**
 * 更新左侧导航栏折叠状态
 * @param  {Object}  state       store state
 * @param  {Boolean} isCollapsed 是否折叠
 * @return {undefined}           undefined
 */
const collapsedSider = (state, isCollapsed) => {
	state.isCollapsed = isCollapsed
}

/**
 * 更新左侧导航栏展开的二级菜单
 * @param  {Object} state        store state
 * @param  {Array} openMenuNames 展开的二级菜单的name列表
 * @return {undefined}           undefined
 */
const updateOpenMenuNames = (state, openMenuNames) => {
	state.openMenuNames = openMenuNames
}

/**
 * 更新当前路由的name, 顺便更新路由历史记录
 * @param  {Object} state           store state
 * @param  {String} activeRouteName 前路由的name
 * @return {undefined}              undefined
 */
const updateaActiveRouteName = (state, activeRouteName) => {
	const isActiveRouteInHistory = objectArrayIsIncludes('name', activeRouteName, state.routeHistorys)

	state.activeRouteName = activeRouteName

	if (!isActiveRouteInHistory) {
		let routes = mainRoutes.reduce((previous, current) => {
			return previous.concat(current.children || [])
		}, [])

		state.routeHistorys.push(objectArrayIsIncludes('name', activeRouteName, routes))
	}
}

/**
 * 更新面包屑
 * @param  {Object} state       store state
 * @param  {String} breadcrumbs 面包屑数组
 * @return {undefined}          undefined
 */
const updateBreadcrumbs = (state, breadcrumbs) => {
	state.breadcrumbs = breadcrumbs
}

/**
 * 重设路由记录
 * @param  {Object} state         store state
 * @param  {Array} routeHistorys  新路由记录列表
 * @return {undefined}            undefined
 */
const resetRouteHistorys = (state, routeHistorys) => {
	if (isArray(routeHistorys)) {
		state.routeHistorys = routeHistorys
	}
}

/**
 * 从路由记录里面移除一些路由
 * @param  {Object} state        store state
 * @param  {Number|Number Array} 需要移除第几项或者哪几项
 * @return {undefined}           undefined
 */
const removeRouteHistory = (state, indexs) => {
	let routeHistorys = state.routeHistorys

	if (isNumber(indexs)) {
		routeHistorys.splice(indexs, 1)
	}

	if (isArray(indexs)) {
		indexs.sort((previous, next) => previous < next)
			.forEach(index => routeHistorys.splice(index, 1))
	}
}

export default {
	collapsedSider,
	updateOpenMenuNames,
	updateaActiveRouteName,
	updateBreadcrumbs,
	resetRouteHistorys,
	removeRouteHistory
}
