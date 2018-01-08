<template>
	<Layout id="app">
		<Sider collapsible hide-trigger>
			<router-link to="/">Home</router-link>
			<router-link to="/detail">Detail</router-link>
		</Sider>
    <Layout>
    	<Header></Header>
			<Content>
				<router-view />
			</Content>
    </Layout>
	</Layout>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import { Layout, Header, Content, Sider } from 'iview'

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
		},
		components: {
			Layout,
			Header,
			Content,
			Sider
		}
	}
</script>

<style lang="less">
	#app {
		color: red;
	}
</style>