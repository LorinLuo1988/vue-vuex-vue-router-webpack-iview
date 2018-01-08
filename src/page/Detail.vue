<template>
	<MainLayout id="detail">
		<div>path: {{path}}</div>
		{{name}}
		<button @click="updateName">change name</button>
	</MainLayout>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
	import { UPDATE_DETAIL_NAME } from '@/constant/mutaion-types'
	import MainLayout from '@/layout/Main'

	const { mapState, mapMutations } = createNamespacedHelpers('detail')

	export default {
		computed: {
			path () {
				return '/detal'
			},
			...mapState({
				name: state => state.name
			})
		},
		methods: {
			...mapMutations({
				updateName: UPDATE_DETAIL_NAME
			})
		},
		components: {
			MainLayout
		}
	}
</script>

<style lang="less">
	
</style>