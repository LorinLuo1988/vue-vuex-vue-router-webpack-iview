 <template>
	<Layout>
		<Sider
			ref="app-sider"
			class="app-sider"
			collapsible
			hide-trigger
			v-model="isCollapsed"
			:width="isCollapsed ? 64 : 200">
      <Menu
      	:class="{'menu-collapsed': isCollapsed}"
      	active-name="detail"
      	theme="dark"
      	width="auto"
      	:open-names="openMenuNames"
      	@on-select="routerTo"
      	@on-open-change="updateOpenMenuNames">
      		<template v-for="(route, index) in mainRoutes">
	          <Submenu :name="route.name" :key="route.name" v-if="route.children.length > 1">
	              <template slot="title">
	                  <Icon type="ios-navigate" v-show="!isCollapsed"></Icon>
								    <Dropdown
								    	placement="right-start"
								    	:transfer="true"
								    	v-show="isCollapsed"
								    	@on-click="routerTo">
								        <a href="javascript:void(0)">
								           <Icon type="ios-navigate"></Icon>
								        </a>
								        <DropdownMenu slot="list">
							              <template
							              	v-if="route && route.children && route.children.length"
							              	v-for="(childRoute, childIndex) in route.children">
							            		<DropdownItem :name="childRoute.name">
									            	{{childRoute.title}}
									            </DropdownItem>
							              </template>
								        </DropdownMenu>
								    </Dropdown>
	                  {{route.name}}
	              </template>
	              <template
	              	v-if="route && route.children && route.children.length"
	              	v-for="(childRoute, childIndex) in route.children">
		              <MenuItem :name="childRoute.name">
		              	{{childRoute.title}}
		              </MenuItem>
	              </template>
	          </Submenu>
	          <template v-else>
		          <MenuItem :name="route.name" v-show="!isCollapsed">
		          	<Icon type="ios-navigate"></Icon>
		          	{{route.title}}
		          </MenuItem>
					    <Dropdown
					    	placement="right-start"
					    	:transfer="true"
					    	v-show="isCollapsed"
					    	@on-click="routerTo">
					        <a href="javascript:void(0)">
					           <Icon type="ios-navigate"></Icon>
					        </a>
					        <DropdownMenu slot="list">
		            		<DropdownItem :name="route.name">
				            	{{route.title}}
				            </DropdownItem>
					        </DropdownMenu>
					    </Dropdown>
				    </template>
          </template>
      </Menu>
		</Sider>
    <Layout class="right-layout" :style="{paddingLeft: isCollapsed ? '64px' : '200px'}">
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
		import { Layout, Header, Content, Sider, Menu, Submenu, MenuItem, Dropdown, DropdownMenu, DropdownItem } from 'iview'
		import { mainRoutes } from '@/router'
		import { mapState, mapMutations } from 'vuex'

		export default {
			data () {
				return {
					mainRoutes,
					openMenuNames: [...this.$store.state.openMenuNames]
				}
			},
			computed: {
				...mapState([
					'isCollapsed'
				]),
				rotateIcon () {
					return [
						'menu-icon',
						this.isCollapsed ? 'rotate-icon' : ''
					]
				}
			},
			methods: {
				routerTo (routeName) {
					this.$router.push({ name: routeName })
				},
				...mapMutations({
					collapsedSider (commit) {
						commit('collapsedSider', !this.isCollapsed)
					},
					updateOpenMenuNames (commit, openMenuNames) {
						commit('updateOpenMenuNames', [...openMenuNames])
					}
				})
			},
			components: {
				Layout,
				Header,
				Content,
				Sider,
				Menu,
				Submenu,
				MenuItem,
				Dropdown,
				DropdownMenu,
				DropdownItem
			}
		}
</script>

<style lang="less">
	.menu-collapsed-ivu-dropdown() {
			padding: 0;
			text-align: center;
			font-size: 0;

			.ivu-icon {
				font-size: 25px;
			}

			.ivu-menu-submenu-title-icon {
				font-size: 0;
			}
	}

	.app-sider {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		overflow: auto;
	}

	.ivu-layout-header {
		padding: 0;
		background: #fff;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
	}

	.right-layout {
		transition: padding-left .2s;
	}

	.menu-icon{
		transition: all .2s;
		cursor: pointer;
	}

	.rotate-icon{
		transform: rotate(-90deg);
	}

	.ivu-menu-item {
		a {
			color: #fff;
		}

		.router-link-exact-active {
			font-weight: bold;
		}
	}

	.menu-collapsed {
		.ivu-menu-submenu {
			.ivu-menu-submenu-title {
				.menu-collapsed-ivu-dropdown();
			}

			.ivu-menu {
				display: none;
			}
		}

		.ivu-dropdown {
			.menu-collapsed-ivu-dropdown();
		}		
	}

	.ivu-dropdown {
		a {
			display: block;
			width: 70px;
			padding: 10px 6px 10px 0;
		}
	}
</style>