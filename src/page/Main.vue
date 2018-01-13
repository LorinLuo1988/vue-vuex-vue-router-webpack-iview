<template>
	<Layout id="app-main" :class="{'collapsed': isCollapsed}">
		<Sider
			ref="app-sider"
			class="app-sider"
			collapsible
			hide-trigger
			v-model="isCollapsed"
			:width="isCollapsed ? '64px' : '200px'">
      <Menu
      	:class="{'menu-collapsed': isCollapsed}"
      	:active-name="activeRouteName"
      	ref="menu"
      	theme="dark"
      	width="auto"
      	:open-names="openMenuNames"
      	@on-select="routerTo"
      	@on-open-change="handleOpenChange">
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
	                  <span>{{route.title}}</span>
	              </template>
	              <template
	              	v-if="route && route.children && route.children.length"
	              	v-for="(childRoute, childIndex) in route.children">
		              <MenuItem :name="childRoute.name">
		              	<span>{{childRoute.title}}</span>
		              </MenuItem>
	              </template>
	          </Submenu>
	          <template v-else>
		          <MenuItem :name="route.name" v-show="!isCollapsed">
		          	<Icon :type="route.icon"></Icon>
		          	<span>{{route.title}}</span>
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
    <Layout class="right-layout" :class="{'no-history': !routeHistorys.length}">
    	<Header class="right-layout-header">
    		<div class="main-header flex align-items-center">
	    		<Icon
	    			@click.native="collapsedSider"
	    			:class="rotateIcon"
	    			:style="{margin: '20px 20px 0'}"
	    			type="navicon-round"
	    			size="24">
	    		</Icon>
			    <Breadcrumb>
			        <BreadcrumbItem
			        	:to="breadcrumb.route"
			        	:key="breadcrumb.title"
			        	v-for="breadcrumb in breadcrumbs">
								{{breadcrumb.title}}
			        </BreadcrumbItem>
			    </Breadcrumb>
    		</div>
    		<div class="sub-header flex align-items-center" v-show="routeHistorys.length">
    			<RouteHistory
    				:active-route-name="activeRouteName"
    				:route-historys="routeHistorys">
    			</RouteHistory>
    		</div>
    	</Header>
			<Content class="page-content">
				<router-view />
			</Content>
    </Layout>
	</Layout>
</template>

<script>
		import { Layout, Header, Content, Sider, Menu, Submenu, MenuItem, Dropdown, DropdownMenu, DropdownItem, Breadcrumb, BreadcrumbItem } from 'iview'
		import { mainRoutes } from '@/router'
		import { mapState, mapMutations } from 'vuex'
		import { RouteHistory } from '@/component'

		export default {
			data () {
				return {
					mainRoutes,
					openMenuNames: [...this.$store.state.openMenuNames]
				}
			},
			computed: {
				...mapState([
					'isCollapsed',
					'activeRouteName',
					'breadcrumbs',
					'routeHistorys'
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
					this.updateaActiveRouteName(routeName)
				},
				findParentRoute (routeName) {
					return mainRoutes.find(route => {
						return route.children.find(route => {
							return route.name === routeName
						})
					})
				},
				updateMenuOpened () {
					this.openMenuNames = [...this.$store.state.openMenuNames]
					this.$nextTick(() => {
						this.$refs.menu.updateOpened()
					})
				},
				handleOpenChange (openMenuNames) {
					this.updateOpenMenuNames(openMenuNames)
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

					if (!(!parentRoute || openMenuNames.includes(parentRoute.name))) {
						this.updateOpenMenuNames([
							...openMenuNames,
							parentRoute.name
						])
					}

					this.updateMenuOpened()
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
				DropdownItem,
				Breadcrumb,
				BreadcrumbItem,
				RouteHistory
			},
			mounted: function () {
				const routeName = this.$route.name
				const parentRoute = this.findParentRoute(routeName)

				this.updateaActiveRouteName(routeName)

				if (parentRoute) {
					this.updateOpenMenuNames([
						parentRoute.name
					])

					this.updateMenuOpened()
				}
			}
		}
</script>

<style lang="less">
	#app-main {
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
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 200px;
			transition: left .2s;
		}

		.right-layout-header {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			height: auto;
		}

		.main-header {
			height: 60px;
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		}

		.sub-header {
			height: 40px;
			padding: 0 15px;
		}

		.page-content {
			position: absolute;
			top: 100px;
			right: 0;
			bottom: 0;
			left: 0;
			padding: 15px 15px 0;
			overflow: auto;
		}

		.right-layout.no-history {
			.page-content {
				top: 60px;
			}
		}

	  .ivu-menu-item, .ivu-menu-submenu-title {
			span{
				display: inline-block;
				overflow: hidden;
				width: 69px;
				text-overflow: ellipsis;
				white-space: nowrap;
				vertical-align: bottom;
				transition: width .2s ease .2s;
			}
	  }

		.menu-icon{
			transition: all .2s;
			margin: 0 15px!important;
			cursor: pointer;
		}

		.rotate-icon{
			transform: rotate(-90deg);
		}

		.ivu-menu-item {
			height: 42px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
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

			.ivu-menu-item, .ivu-menu-submenu-title {
				span {
	        width: 0px;
	        transition: width .2s ease;
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
	}

	#app-main.collapsed {
		.right-layout {
			left: 64px;
		}
	}
</style>