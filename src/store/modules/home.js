import { UPDATE_HOME_NAME } from '@/constant/mutaion-types'

const state = {
	name: 'Home Page'
}

const getters = {

}

const mutations = {
	updateHomeName (state, value) {
		state.name = value
	},
	[UPDATE_HOME_NAME] (state) {
		state.name = 'Home Page Vue'
	}
}

const actions = {
	updateHomeName: ({ state, commit, rootState }) => new Promise((resolve, reject) => {
		setTimeout(function () {
			commit({
				type: UPDATE_HOME_NAME
			})

			resolve('resolve')
		}, 1000)
	})
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
