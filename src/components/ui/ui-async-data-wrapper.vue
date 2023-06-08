<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { DataLoadingStateEnum } from '@/api'

const props = defineProps({
	state: {
		type: String as PropType<DataLoadingStateEnum>,
		required: true
	}
})

const isLoading = computed(() => {
	return props.state === DataLoadingStateEnum.Loading
})

const isSuccessLoaded = computed(() => {
	return props.state === DataLoadingStateEnum.LoadedSuccess
})

const isErorrLoaded = computed(() => {
	return props.state === DataLoadingStateEnum.LoadedError
})
</script>

<template>
	<slot
		v-if="isLoading"
		name="loading"
	/>
	<slot v-if="isSuccessLoaded" />
	<slot
		v-if="isErorrLoaded"
		name="error"
	/>
</template>
