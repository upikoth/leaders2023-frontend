<script setup lang="ts">
import { toRefs } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
	color: {
		type: String as PropType<string>,
		required: true,
	},
	size: {
		type: String as PropType<string>,
		required: true,
	}
})

const { color, size } = toRefs(props)
</script>

<template>
	<div class="ui-dot" />
</template>

<style lang="scss" scoped>
.ui-dot {
	display: inline-block;
	width: v-bind(size);
	height: v-bind(size);
	border-radius: 50%;
	background-color: v-bind(color);
}
</style>
