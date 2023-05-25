<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PropType } from 'vue'
import { isBefore, getDay, isEqual as isDateEqual } from 'date-fns'
import {
	modalController,
	useIonRouter,
	IonItem,
	IonLabel,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/vue'

import api from '@/api'
import type { ICreativeSpace } from '@/api'
import { useNotificationsStore, useScreenStore } from '@/stores'
import { ViewName } from '@/router';
import environments from '@/environments'

import UiImage from '@/components/ui/ui-image.vue'
import UiCalendar from '@/components/ui/ui-calendar.vue'
import UiCalendarModal from '@/components/ui/ui-carousel-modal.vue'

const screenStore = useScreenStore()
const notificationsStore = useNotificationsStore()

const ionRouter = useIonRouter()

const props = defineProps({
	id: {
		type: Number as PropType<number>,
		required: true
	},
	landlordId: {
		type: Number as PropType<number>,
		default: NaN
	}
})

const emit = defineEmits({
	'update:landlord-id': (value: number) => typeof value === 'number',
});


const creativeSpace = ref<ICreativeSpace | null>(null)

watch(() => props.id, updateCreativeSpaceData)

function onCreated() {
	updateCreativeSpaceData()
}

async function updateCreativeSpaceData() {
	if (!props.id) {
		return
	}

	try {
		const { creativeSpace: newCreativeSpace } = await api.creativeSpaces.get(props.id)
		creativeSpace.value = newCreativeSpace
		emit('update:landlord-id', creativeSpace.value.landlordId)
	} catch {
		notificationsStore.error('Не удалось получить информацию о креативной площадке')
		ionRouter.replace({ name: ViewName.CreativeSpacesView })
	}
}


function checkHighlightedDates(date: string) {
	if (!creativeSpace.value) {
		return undefined
	}

	// Все не рабочие дни.
	if(!creativeSpace.value.calendar.workDayIndexes.includes(getDay(new Date(date)))){
		return {
			textColor: '#800080',
			backgroundColor: '#ffe5e9',
		}
	}

	// Все предыдущие дни.
	if (isBefore(new Date(date), new Date())) {
		return {
			textColor: '#800080',
			backgroundColor: '#ffe5e9',
		}
	}

	// День уже забронирован.
	if(creativeSpace.value.calendar.events.some(event => isDateEqual(new Date(event.date), new Date(date)))) {
		return {
			textColor: '#800080',
			backgroundColor: '#ffe5e9',
		}
	}

	return undefined
}

function checkIsCalendarDateEnabled(date: string) {
	if (!creativeSpace.value) {
		return undefined
	}

	// Все предыдущие дни.
	if (isBefore(new Date(date), new Date())) {
		return false
	}

	// Все не рабочие дни.
	if(!creativeSpace.value.calendar.workDayIndexes.includes(getDay(new Date(date)))){
		return false
	}

	// День уже забронирован.
	if(creativeSpace.value.calendar.events.some(event => isDateEqual(new Date(event.date), new Date(date)))) {
		return false
	}

	return true
}

async function onImageClick() {
	if (!creativeSpace.value?.photos) {
		return
	}

	const images = creativeSpace.value.photos.map(el => `${environments.S3_ACCESS_DOMAIN_NAME}/${el}`)

	const modal = await modalController.create({
		component: UiCalendarModal,
		cssClass: 'full-size-modal',
		componentProps: {
			images,
			objectFit: 'contain'
		}
	})

	modal.present()
}

onCreated()
</script>

<template>
	<ion-grid
		v-if="creativeSpace"
		class="creative-space-details"
	>
		<ion-row>
			<ion-col
				size="12"
				size-md="8"
			>
				<ion-item>
					<ion-label>
						Название:
						<p>{{ creativeSpace.title }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
			<ion-col
				size="12"
				size-md="4"
			>
				<ion-item>
					<ion-label>
						Стоимость аренды (₽/день):
						<p>{{ creativeSpace.pricePerDay }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						Адрес:
						<p>{{ creativeSpace.address }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						Описание:
						<p
							class="creative-space-details__description"
						>
							{{ creativeSpace.description }}
						</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<h3>Календарь аренды площадки</h3>
				<p>
					В календаре ниже будут отображены доступные дни для аренды
				</p>
				<ui-calendar
					:is-date-enabled="checkIsCalendarDateEnabled"
					:highlighted-dates="checkHighlightedDates"
				/>
			</ion-col>
		</ion-row>
		<ion-row v-if="creativeSpace.photos.length">
			<ion-col>
				<p
					class="creative-space-details__photos-title"
				>
					Фотографии:
				</p>
				<div
					class="creative-space-details__photos"
				>
					<ui-image
						v-for="(photoName, i) in creativeSpace.photos"
						:key="i"
						class="creative-space-details__photo"
						:src="`${environments.S3_ACCESS_DOMAIN_NAME}/${photoName}`"
						:size="screenStore.isXs ? '100%' : '180px'"
						@click="onImageClick"
					/>
				</div>
			</ion-col>
		</ion-row>
	</ion-grid>
</template>

<style lang="scss" scoped>
.creative-space-details {
	padding: 16px;

	&__description {
		white-space: pre-line;
	}

	&__photos-title {
		margin-left: 16px;
	}

	&__photos {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		gap: 12px;
	}

	&__photo {
		cursor: zoom-in;
	}

	ion-item {
		--padding-start: 0;
	}
}
</style>
