<template>
	<div
		class="scroll-box"
		:class="scrollBoxClass"
		ref="scrollBox"
		@mousewheel="handleMousewheel"
		@DOMMouseScroll="handleMousewheel">
		<div
			ref="scrollContent"
			class="scroll-content"
			:style="{left: `${scrollContentLeft}px`}">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			scrollContentLeft: Number
		},
		computed: {
			scrollBoxClass () {
				if (this.scrollContentLeft < 0) {
					return 'left-view-out'
				}

				if (!this.$refs.scrollContent || !this.$refs.scrollBox) {
					return ''
				}

				if (this.scrollContentLeft + this.$refs.scrollContent.offsetWidth > this.$refs.scrollBox.offsetWidth) {
					return 'right-view-out'
				}

				return ''
			}
		},
		methods: {
			handleMousewheel: function (event) {
				const wheelDelta = event.wheelDelta || event.detail * 60
				let scrollContentLeft = this.scrollContentLeft
				const { scrollBox, scrollContent } = this.$refs
				const diffWidth = scrollBox.offsetWidth - scrollContent.offsetWidth

				// 如果滚动盒子的宽度大于等于滚动内容的宽度，则不需要滚动
				if (diffWidth >= 0 && scrollContentLeft >= 0) {
					return false
				}

				scrollContentLeft += wheelDelta

				if (scrollContentLeft > 0) {
					scrollContentLeft = 0
				}

				if (scrollContentLeft < diffWidth) {
					scrollContentLeft = diffWidth
				}

				// 如果滚动盒子的宽度大于等于滚动内容的宽度，并且下一帧数据大于0，则让下一帧数据为0
				if (diffWidth >= 0 && scrollContentLeft > 0) {
					scrollContentLeft = 0
				}

				this.$emit('updateScrollContentLeft', scrollContentLeft)
			}
		}
	}
</script>

<style lang="less" scoped>
	.scroll-box {
		position: relative;
		height: 100%;
		overflow: hidden;
	}

	.scroll-box.left-view-out:before {
		content: '';
		position: absolute;
		z-index: 2;
		top: 0;
		bottom: 0;
		left: -2px;
		width: 1px;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
	}

	.scroll-box.right-view-out:after {
			content: '';
			position: absolute;
			z-index: 2;
			top: 0;
			bottom: 0;
			right: -2px;
			width: 1px;
			box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
	}

	.scroll-content {
		position: absolute;
		transition: left .3s;
	}
</style>