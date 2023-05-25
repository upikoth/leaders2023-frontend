<script setup lang="ts">
import {
	IonDatetime
} from '@ionic/vue'
</script>

<template>
	<div 
		class="ui-calendar"
	>
		<ion-datetime
			presentation="date"
			:first-day-of-week="1"
			v-bind="$attrs"
		/>
	</div>
</template>

<style lang="scss" scoped>
.ui-calendar {
	height: 350px;
	
	:deep(.datetime-time) {
		display: none;
	}
}
</style>
