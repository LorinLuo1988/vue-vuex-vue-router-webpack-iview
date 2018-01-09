/**
 * [collapsedSider description]
 * @param  {[type]}  state       [description]
 * @param  {Boolean} isCollapsed [description]
 * @return {[type]}              [description]
 */
const collapsedSider = (state, isCollapsed) => {
	state.isCollapsed = isCollapsed
}

const updateOpenMenuNames = (state, openMenuNames) => {
	state.openMenuNames = openMenuNames
}

const updateaActiveRouteName = (state, activeRouteName) => {
	state.activeRouteName = activeRouteName
}

export default {
	collapsedSider,
	updateOpenMenuNames,
	updateaActiveRouteName
}
