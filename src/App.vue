<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
	import { setLocalStorage, getLocalStorage, isFunc } from '@/util'
	import { mapMutations, mapState } from 'vuex'

	export default {
		computed: {
			...mapState([
				'routeHistorys'
			])
		},
		mounted: function () {
			const windowUnloadFn = window.onunload

			this.resetRouteHistorys(getLocalStorage('routeHistorys'))
			window.onunload = () => {
				isFunc(windowUnloadFn) && windowUnloadFn.call(window)
				setLocalStorage('routeHistorys', this.routeHistorys)
			}
		},
		methods: {
			...mapMutations([
				'resetRouteHistorys'
			])
		}
	}
</script>

<style lang="less">
	
</style>