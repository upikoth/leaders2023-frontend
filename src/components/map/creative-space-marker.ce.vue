<script setup lang="ts">
import { toRefs } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
	width: {
		type: String as PropType<string>,
		default: '35px'
	},
	height: {
		type: String as PropType<string>,
		default: '35px'
	}
})

const { width, height } = toRefs(props)
</script>

<template>
	<div class="creative-space-marker">
		<div class="creative-space-marker__pin" />
	</div>
</template>

<style lang="scss" scoped>
.creative-space-marker {
	position: relative;
	width: 0;
	height: 0;

	&__pin {
		position: absolute;
		top: 50%;
		left: 50%;
		width: v-bind(width);
		height: v-bind(height);
		padding: 0 3px 3px 0;
		border-radius: 50% 50% 50% 0;
		margin: -2.2em 0 0 -1.3em;
		background: var(--ion-color-primary);
		box-shadow: -1px 1px 4px rgb(0 0 0 / 50%);
		cursor: pointer;
		transform: perspective(40px) rotateX(20deg) rotateZ(-45deg);

		&::after {
			position: absolute;
			top: 30%;
			left: 30%;
			width: 40%;
			height: 40%;
			border-radius: 50%;
			background: #ffffff;
			box-shadow: 0 0 10px rgb(0 0 0 / 50%);
			content: '';
		}
	}
}
</style>
