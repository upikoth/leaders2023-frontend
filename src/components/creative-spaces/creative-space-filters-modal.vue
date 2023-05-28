<script setup lang="ts">
import { ref, computed } from 'vue'
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
	IonCheckbox,
} from '@ionic/vue'
import type { DatetimeCustomEvent, CheckboxCustomEvent } from '@ionic/vue'
import { isBefore } from 'date-fns'

import { useFiltersStore, useUserStore } from '@/stores'
import { vMask } from '@/directives'
import { maskpricePerDay, maskNumber } from '@/utils'
import { CreativeSpaceStatusEnum } from '@/api'
import { creativeSpaceTypeNameMapping } from '@/constants'

import UiCalendar from '@/components/ui/ui-calendar.vue'
import UiSelect from '@/components/ui/ui-select.vue'

const filtersStore = useFiltersStore()
const userStore = useUserStore()

const filters = ref({
	...filtersStore.creativeSpacesFilters
})
const spaceTypes = computed(() => {
	return Object.keys(creativeSpaceTypeNameMapping).map(key => ({
		value: key,
		label: creativeSpaceTypeNameMapping[key]
	}))
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

function handleOnlyMySpacesCheckboxChange(event: CheckboxCustomEvent) {
	filters.value.landlordId = event.detail.checked ? userStore.user.id : 0;
}

function handleOnlyNotConfirmedSpacesCheckboxChange(event: CheckboxCustomEvent) {
	filters.value.status = event.detail.checked ? CreativeSpaceStatusEnum.ConfirmationByAdmin : null;
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
					<ion-checkbox
						v-if="userStore.isAdmin"
						class="creative-space-filters-modal__not-confirmed-filter"
						:checked="filters.status === CreativeSpaceStatusEnum.ConfirmationByAdmin"
						@ion-change="handleOnlyNotConfirmedSpacesCheckboxChange"
					>
						Показывать только не подтвержденные площадки
					</ion-checkbox>
					<ion-checkbox
						v-if="userStore.isLandlord"
						class="creative-space-filters-modal__only-my-spaces-filter"
						:checked="!!filters.landlordId"
						@ion-change="handleOnlyMySpacesCheckboxChange"
					>
						Показывать только мои площадки
					</ion-checkbox>
					<ui-select
						v-model="filters.spaceType"
						:items="spaceTypes"
						label="Тип площадки"
						label-placement="floating"
					/>
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
					<ion-input
						v-model="filters.area"
						v-mask="maskNumber"
						label="Площадь ОТ (м^2)"
						inputmode="numeric"
						label-placement="floating"
						helper-text="&nbsp;"
					/>
					<ion-input
						v-model="filters.capacity"
						v-mask="maskNumber"
						label="Вместимость ОТ (человек)"
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

	&__not-confirmed-filter,
	&__only-my-spaces-filter {
		padding-top: 12px;
		padding-bottom: 12px;
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
