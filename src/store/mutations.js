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

export default {
	collapsedSider,
	updateOpenMenuNames
}
