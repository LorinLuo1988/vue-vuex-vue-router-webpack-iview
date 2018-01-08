<template>
	<MainLayout id="home">
		<div>
			{{name}}
			<input type="text" :value="name" @input="updateName">
		</div>
	</MainLayout>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
	import MainLayout from '@/layout/Main'

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
		},
		components: {
			MainLayout
		}
	}
</script>

<style lang="less">
	
</style>