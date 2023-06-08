<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
	tag: {
		type: String as PropType<string>,
		default: 'div'
	},
	width: {
		type: String as PropType<string>,
		default: 'initial'
	},
	height: {
		type: String as PropType<string>,
		default: 'initial'
	},
	borderRadius: {
		type: String as PropType<string>,
		default: '12px'
	},
	isAnimated: {
		type: Boolean as PropType<boolean>,
		default: true
	}
})

const { width, height, borderRadius } = toRefs(props)

const classList = computed(() => ({
	'pa-skeleton_animated': props.isAnimated
}))
</script>

<template>
	<component
		:is="tag"
		class="pa-skeleton"
		:class="classList"
	/>
</template>

<style lang="scss" scoped>
.pa-skeleton {
	position: relative;
	z-index: 1;
	overflow: hidden;
	width: v-bind(width);
	max-width: v-bind(width);
	height: v-bind(height);
	max-height: v-bind(height);
	flex-grow: 1;
	border-radius: v-bind(borderRadius);
	background-color: #eeeeee;

	&::before {
		content: '\00a0';
	}

	&_animated {
		cursor: wait;

		&::after {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			animation: skeleton 1500ms linear 0.5s infinite;
			background: linear-gradient(
				90deg,
				rgb(255 255 255 / 0%),
				rgb(255 255 255 / 100%),
				rgb(255 255 255 / 0%)
			);
			content: '';
		}
	}
}

@keyframes skeleton {
	0% {
		transform: translateX(-100%);
	}

	100% {
		transform: translateX(100%);
	}
}
</style>
