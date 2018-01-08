<template>
	<Layout>
		<Sider
			ref="app-sider"
			class="app-sider"
			collapsible
			hide-trigger
			v-model="isCollapsed"
			:width="200"
			:collapsed-width="64">
			<router-link to="/">Home</router-link>
			<router-link to="/detail">Detail</router-link>
		</Sider>
    <Layout :style="{paddingLeft: isCollapsed ? '64px' : '200px'}">
    	<Header>
    		<Icon
    			@click.native="collapsedSider"
    			:class="rotateIcon"
    			:style="{margin: '20px 20px 0'}"
    			type="navicon-round"
    			size="24">
    		</Icon>
    	</Header>
			<Content>
				<slot></slot>
			</Content>
    </Layout>
	</Layout>
</template>

<script>
		import { Layout, Header, Content, Sider } from 'iview'

		export default {
			data () {
				return {
					isCollapsed: false
				}
			},
			computed: {
				rotateIcon () {
					return [
						'menu-icon',
						this.isCollapsed ? 'rotate-icon' : ''
					]
				}
			},
			methods: {
				collapsedSider () {
					this.$refs['app-sider'].toggleCollapse()
				}
			},
			components: {
				Layout,
				Header,
				Content,
				Sider
			}
		}
</script>

<style scoped lang="less">
	.app-sider {
		color: gray;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		overflow: auto;
	}

	.ivu-layout-header {
		padding: 0;
	}

	.menu-icon{
		transition: all .2s;
	}

	.rotate-icon{
		transform: rotate(-90deg);
	}
</style>