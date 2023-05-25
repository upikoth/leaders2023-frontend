<script setup lang="ts">
import type { PropType } from 'vue'
import {
	IonCheckbox
} from '@ionic/vue'
import type { CheckboxCustomEvent } from '@ionic/vue';

import { workDayIndexMapping } from '@/constants'

const props = defineProps({
	workDayIndexes: {
		type: Object as PropType<number[]>,
		required: true,
	},
	disabled: {
		type: Boolean as PropType<boolean>,
		default: false,
	}
})

const emit = defineEmits({
	'update:work-day-indexes': (value: number[]) => Array.isArray(value),
});

const weekDays = Object.keys(workDayIndexMapping)
	.map(key => ({
		index: Number(key),
		label: workDayIndexMapping[key]
	}))
	.sort((a, b) => !a.index || !b.index ? -1 : a.index - b.index)

function updateWorkDays(event: CheckboxCustomEvent, weekDayIndex: number) {
	if (event.detail.checked) {
		emit('update:work-day-indexes', [...props.workDayIndexes, weekDayIndex].sort())
	} else {
		emit('update:work-day-indexes', props.workDayIndexes.filter(index => index !== weekDayIndex))
	}
}
</script>

<template>
	<div class="ui-calendar-work-days">
		<ion-checkbox
			v-for="weekDay in weekDays"
			:key="weekDay.index"
			:checked="props.workDayIndexes.includes(weekDay.index)"
			:disabled="props.disabled"
			@ion-change="updateWorkDays($event, weekDay.index)"
		>
			{{ weekDay.label }}
		</ion-checkbox>
	</div>
</template>

<style lang="scss" scoped>
.ui-calendar-work-days {
	display: flex;
	flex-direction: column;
	gap: 16px
}
</style>
