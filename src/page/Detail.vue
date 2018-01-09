<template>
	<div>
		<div>path: {{path}}</div>
		{{name}}
		<button @click="updateName">change name</button>
	</div>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
	import { UPDATE_DETAIL_NAME } from '@/constant/mutaion-types'

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
		}
	}
</script>

<style lang="less">
	
</style>