<template>
	<div @click="handleClick">
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
	      	:active-name="activeRouteName"
	      	ref="menu"
	      	theme="dark"
	      	width="auto"
	      	:open-names="openMenuNames"
	      	@on-select="routerTo">
	      		<template v-for="(route, index) in mainRoutes">
		          <Submenu :name="route.name" :key="route.name" v-if="route.children.length > 1">
		              <template slot="title">
		                  <Icon :type="route.icon" v-show="!isCollapsed"></Icon>
									    <Dropdown
									    	placement="right-start"
									    	:transfer="true"
									    	v-show="isCollapsed"
									    	@on-click="routerTo">
									        <a href="javascript:void(0)">
									           <Icon :type="route.icon"></Icon>
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
		                  {{route.title}}
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
			          	<Icon :type="route.icon"></Icon>
			          	{{route.title}}
			          </MenuItem>
						    <Dropdown
						    	placement="right-start"
						    	:transfer="true"
						    	v-show="isCollapsed"
						    	@on-click="routerTo">
						        <a href="javascript:void(0)">
						           <Icon :type="route.icon"></Icon>
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
					<router-view />
				</Content>
	    </Layout>
		</Layout>
	</div>
</template>

<script>
		import { Layout, Header, Content, Sider, Menu, Submenu, MenuItem, Dropdown, DropdownMenu, DropdownItem } from 'iview'
		import { mainRoutes } from '@/router'
		import { mapState, mapMutations } from 'vuex'

		export default {
			data () {
				return {
					mainRoutes
				}
			},
			computed: {
				...mapState({
					isCollapsed: state => state.isCollapsed,
					activeRouteName: state => state.activeRouteName,
					openMenuNames: function (state) {
						this.$nextTick(() => {
							this.$refs.menu.updateOpened()
						})

						return [...state.openMenuNames]
					}
				}),
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
					this.updateaActiveRouteName(routeName)
				},
				handleClick (event) {
					console.log(event.target)
					this.updateOpenMenuNames(this.$refs.menu.openNames)
				},
				findParentRoute (routeName) {
					return mainRoutes.find(route => {
						return route.children.find(route => {
							return route.name === routeName
						})
					})
				},
				...mapMutations({
					collapsedSider (commit) {
						commit('collapsedSider', !this.isCollapsed)
					},
					updateOpenMenuNames (commit, openMenuNames) {
						commit('updateOpenMenuNames', [...openMenuNames])
					},
					updateaActiveRouteName (commit, routeName) {
						commit('updateaActiveRouteName', routeName)
					}
				})
			},
			watch: {
				$route ({ name }) {
					let parentRoute = null
					const openMenuNames = this.$store.state.openMenuNames

					this.updateaActiveRouteName(name)
					parentRoute = this.findParentRoute(name)

					if (!parentRoute) {
						return false
					}

					if (openMenuNames.includes(parentRoute.name)) {
						return false
					}

					this.updateOpenMenuNames([
						...openMenuNames,
						parentRoute.name
					])
				}
			},
			components: {
				Layout,
				Content,
				Header,
				Sider,
				Menu,
				Submenu,
				MenuItem,
				Dropdown,
				DropdownMenu,
				DropdownItem
			},
			mounted: function () {
				const routeName = this.$route.name
				const parentRoute = this.findParentRoute(routeName)

				this.updateaActiveRouteName(routeName)

				if (parentRoute) {
					this.updateOpenMenuNames([
						parentRoute.name
					])
				}
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