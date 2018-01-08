<template>
	<div id="home">
		{{name}}
		<input type="text" :value="name" @input="updateName">
	</div>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'

	const { mapState, mapMutations } = createNamespacedHelpers('home')

	export default {
		computed: {
			...mapState([
				'name'
			])
		},
		methods: {
			...mapMutations({
				updateName (commit, event) {
					commit('updateHomeName', event.target.value)
				}
			})
		}
	}
</script>

<style lang="less">
	
</style>