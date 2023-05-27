<script setup lang="ts">
import { ref } from 'vue'
import {
	modalController,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonContent,
	IonCard,
	IonCardContent,
	IonInput,
} from '@ionic/vue'
import type { DatetimeCustomEvent } from '@ionic/vue'
import { isBefore } from 'date-fns'

import { useFiltersStore } from '@/stores'
import { vMask } from '@/directives'
import { maskpricePerDay } from '@/utils'

import UiCalendar from '@/components/ui/ui-calendar.vue'

const filtersStore = useFiltersStore()

const filters = ref({
	...filtersStore.creativeSpacesFilters
})

function closeModal() {
	modalController.dismiss()
}

function clearFilters() {
	filtersStore.clearCreativeSpacesFilters()
	closeModal()
}

function onCalendarChange(event: DatetimeCustomEvent) {
	if (!Array.isArray(event.detail.value)) {
		return
	}

	filters.value.freeDates = event.detail.value || []
}

function checkIsCalendarDateEnabled(date: string) {
	// Все предыдущие дни.
	if (isBefore(new Date(date), new Date())) {
		return false
	}

	return true
}

function sumbit() {
	filtersStore.patchCreativeSpacesFilters(filters.value)
	closeModal()
}
</script>

<template>
	<div class="creative-space-filters-modal">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="end">
					<ion-button @click="closeModal">
						Закрыть
					</ion-button>
				</ion-buttons>
				<ion-title>
					Фильтры
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-card class="creative-space-filters-modal__card">
				<ion-card-content class="creative-space-filters-modal__card-content">
					<ion-input
						v-model="filters.pricePerDayFrom"
						v-mask="maskpricePerDay"
						label="Цена ОТ (₽/день)"
						inputmode="numeric"
						label-placement="floating"
						helper-text="&nbsp;"
					/>
					<ion-input
						v-model="filters.pricePerDayTo"
						v-mask="maskpricePerDay"
						label="Цена ДО (₽/день)"
						inputmode="numeric"
						label-placement="floating"
						helper-text="&nbsp;"
					/>
					<p>
						Даты аренды
					</p>
					<ui-calendar
						multiple
						:is-date-enabled="checkIsCalendarDateEnabled"
						:value="filters.freeDates.length ? filters.freeDates : undefined"
						@ion-change="onCalendarChange"
					/>
					<div
						class="creative-space-filters-modal__buttons"
					>
						<ion-button
							fill="outline"
							@click="clearFilters"
						>
							Сбросить
						</ion-button>	
						<ion-button
							@click="sumbit"
						>
							Применить
						</ion-button>	
					</div>
				</ion-card-content>
			</ion-card>
		</ion-content>
	</div>
</template>

<style lang="scss" scoped>
.creative-space-filters-modal {
	display: flex;
	height: 100%;
	flex-direction: column;

	&__card {
		height: 100%;
		margin: 0;
	}

	&__card-content {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: start;

		> p {
			margin-bottom: 12px;
			font-size: 15px;
		}
	}

	&__buttons {
		margin-top: auto;
		margin-left: auto;

		> ion-button:not(:last-child) {
			margin-right: 20px;
		}
	}
}
</style>
