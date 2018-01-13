<template>
	<div class="route-history-box">
		<MouseWheelHorizontalScroll
			ref="routeTagsScroll"
			:scrollContentLeft="mouseWheelHorizontalScrollLeft"
			@updateScrollContentLeft="updateMouseWheelHorizontalScrollLeft">
			<div class="route-tag-list">
				<Tag
					ref="routeTags"
					type="dot"
					closable
					:key="route.name"
					:name="route.name"
					:color="route.name === activeRouteName ? 'blue' : 'default'"
					v-for="(route, index) in routeHistorys"
					@click.native="routeTo(route.name)"
					@on-close="removeRouteHistory(index)">
					{{route.title}}
				</Tag>
			</div>
		</MouseWheelHorizontalScroll>
	</div>
</template>

<script>
	import { Tag } from 'iview'
	import { mapMutations } from 'vuex'
	import MouseWheelHorizontalScroll from './MouseWheelHorizontalScroll'

	export default {
		props: {
			routeHistorys: Array,
			activeRouteName: String
		},
		data () {
			return {
				mouseWheelHorizontalScrollLeft: 0
			}
		},
		methods: {
			routeTo: function (routeName) {
				this.$router.push({ name: routeName })
			},
			updateMouseWheelHorizontalScrollLeft (mouseWheelHorizontalScrollLeft) {
				this.mouseWheelHorizontalScrollLeft = mouseWheelHorizontalScrollLeft
			},
			updateMouseWheelHorizontalScrollAactiveTag (name) {
				const activeRouteTagDom = this.$refs.routeTags.find(routeTag => routeTag.name === name).$el
				const activeRouteTagDomOffsetLeft = activeRouteTagDom.offsetLeft
				const activeRouteTagDomOffsetWidth = activeRouteTagDom.offsetWidth
				const scrollBoxOffsetWidth = this.$refs.routeTagsScroll.$refs.scrollBox.offsetWidth
				const diffOffset = activeRouteTagDomOffsetLeft + activeRouteTagDomOffsetWidth + this.mouseWheelHorizontalScrollLeft - scrollBoxOffsetWidth

				/**
				 * 当前路由对应的tag离scroll box左边界的距离与scroll content滚动距离相加小于0，
				 * 说明当前路由对应的tag在scroll box左边界的左边，应该让其滚动到scroll box的视口内
				 */
				if (activeRouteTagDomOffsetLeft + this.mouseWheelHorizontalScrollLeft < 0) {
					return this.updateMouseWheelHorizontalScrollLeft(0)
				}

				/**
				 * 当前路由对应的tag离scroll box左边界的距离加上scroll content的滚动距离加上当前路由
				 * 对应的tag的宽度大于scroll box的宽度，说明当前路由对应的tag在scrollbox右边界的右边，
				 * 应该让其滚动到scroll box的视口内
				 */
				if (diffOffset > 0) {
					this.updateMouseWheelHorizontalScrollLeft(this.mouseWheelHorizontalScrollLeft - diffOffset)
				}
			},
			...mapMutations([
				'removeRouteHistory'
			])
		},
		components: {
			Tag,
			MouseWheelHorizontalScroll
		},
		watch: {
			$route ({ name }) {
				this.$nextTick(() => this.updateMouseWheelHorizontalScrollAactiveTag(name))
			}
		},
		mounted () {
			this.$nextTick(() => this.updateMouseWheelHorizontalScrollAactiveTag(this.$route.name))
		}
	}
</script>

<style lang="less" scoped>
	.route-history-box {
		width: 100%;
		height: 40px;
		line-height: 40px;
	}

	.route-tag-list {
		white-space: nowrap;
	}
</style>