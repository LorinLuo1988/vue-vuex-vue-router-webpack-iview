import { UPDATE_DETAIL_NAME } from '@/constant/mutaion-types'

const state = {
	name: 'Detail Page'
}

const getters = {

}

const mutations = {
	[UPDATE_DETAIL_NAME] (state) {
		state.name = 'Detail Page Vue'
	}
}

const actions = {

}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
