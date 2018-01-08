<template>
	<div id="app">
 		<Slider class="margin-top-50" v-model="sliderValue" range></Slider>
        <h1>{{text}}</h1>
		<h2>{{name}}</h2>
		<router-link to="/">Home</router-link>
		<router-link to="/detail">Detail</router-link>
		<router-view />
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'

	export default {
		data () {
			return {
				text: 'vue demo',
				sliderValue: [0, 100]
			}
		},
		computed: {
			...mapState({
				name: (state, getters) => getters.name
			}),
			...mapGetters({
				name: 'name'
			})
		}
	}
</script>

<style lang="less">
	#app {
		color: red;
	}
</style>