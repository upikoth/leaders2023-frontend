<script setup lang="ts">
import { ref, watch, computed } from 'vue'
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
	IonButton,
} from '@ionic/vue'
import type { DatetimeCustomEvent } from '@ionic/vue'

import api, { DataLoadingStateEnum } from '@/api'
import type { ICreativeSpace, ICalendarEventFull } from '@/api'
import { useNotificationsStore, useScreenStore, useUserStore } from '@/stores'
import { ViewName } from '@/router'
import { formatPrice, saveFile } from '@/utils'
import environments from '@/environments'
import { creativeSpaceTypeNameMapping } from '@/constants'
import {
	creativeSpaceStatusNameMapping,
	creativeSpaceStatusBadgeColorMapping
} from '@/constants'

import UiImage from '@/components/ui/ui-image.vue'
import UiCalendar from '@/components/ui/ui-calendar.vue'
import UiCalendarModal from '@/components/ui/ui-carousel-modal.vue'

const screenStore = useScreenStore()
const userStore = useUserStore()
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
	},
	selectedCalendarDays: {
		type: Array as PropType<string[]>,
		default: () => []
	},
	creativeSpaceEvents: {
		type: Array as PropType<ICalendarEventFull[]>,
		default: () => []
	},
	creativeSpaceLoadingState: {
		type: String as PropType<DataLoadingStateEnum>,
		default: DataLoadingStateEnum.DidNotLoad
	}
})

const emit = defineEmits({
	'update:landlord-id': (value: number) => typeof value === 'number',
	'update:selected-calendar-days': (value: string[]) => Array.isArray(value),
	'update:creative-space-events': (value: ICalendarEventFull[]) => Array.isArray(value),
	'update:creative-space-status': (value: string) => typeof value === 'string',
	'update:creative-space-loading-state': (value: string) => typeof value === 'string'
});

const creativeSpace = ref<ICreativeSpace | null>(null)
const creativeSpaceLoadingState = ref(DataLoadingStateEnum.DidNotLoad)

const isStatusVisible = computed(() => {
	return userStore.user.id === creativeSpace.value?.landlordInfo.id || userStore.isAdmin
})

watch(() => props.id, updateCreativeSpaceData)

function onCreated() {
	updateCreativeSpaceData()
}

async function updateCreativeSpaceData() {
	if (!props.id) {
		return
	}

	try {
		creativeSpaceLoadingState.value = DataLoadingStateEnum.Loading
		const { creativeSpace: newCreativeSpace } = await api.creativeSpaces.get(props.id)
		creativeSpaceLoadingState.value = DataLoadingStateEnum.LoadedSuccess
		creativeSpace.value = newCreativeSpace

		emit('update:landlord-id', creativeSpace.value.landlordInfo.id)
		emit('update:creative-space-events', creativeSpace.value.calendar.events)
		emit('update:creative-space-status', creativeSpace.value.status)
	} catch {
		creativeSpaceLoadingState.value = DataLoadingStateEnum.LoadedError
		notificationsStore.error('Не удалось получить информацию о креативной площадке')
		ionRouter.replace({ name: ViewName.CreativeSpacesView })
	} finally {
		emit('update:creative-space-loading-state', creativeSpaceLoadingState.value)
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

function onCalendarChange(event: DatetimeCustomEvent) {
	const value = event.detail.value

	if (typeof value === 'string') {
		return;
	}

	emit('update:selected-calendar-days', value || [])
}

async function downloadContract() {
	saveFile(`${environments.S3_ACCESS_DOMAIN_NAME}/e2f81ac3-4967-41b2-a9b3-e232d4f58819.pdf`, 'Договор оферты.pdf')
}

onCreated()
</script>

<template>
	<ion-grid
		v-if="creativeSpaceLoadingState === DataLoadingStateEnum.LoadedSuccess && creativeSpace"
		class="creative-space-details"
	>
		<ion-row v-if="isStatusVisible">
			<ion-col>
				<p class="creative-space-details__status">
					Статус:
					<ion-badge
						class="creative-space-details__status-badge"
						:color="creativeSpaceStatusBadgeColorMapping[creativeSpace.status]"
					>
						{{ creativeSpaceStatusNameMapping[creativeSpace.status] }}
					</ion-badge>
				</p>
			</ion-col>
		</ion-row>
		<ion-row v-if="creativeSpace.averageRating">
			<ion-col>
				<p
					v-if="creativeSpace.averageRating"
					class="creative-space-details__rating"
				>
					<b>Рейтинг:</b>&nbsp;
					{{ creativeSpace.averageRating }}&nbsp;из 5
				</p>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<h3>Основная информация</h3>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						Тип площадки:
						<p>{{ creativeSpaceTypeNameMapping[creativeSpace.spaceType] }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
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
						<p>{{ formatPrice(creativeSpace.pricePerDay) }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col
				size="12"
				size-md="8"
			>
				<ion-item>
					<ion-label>
						Площадь (м^2):
						<p>{{ creativeSpace.area }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
			<ion-col
				size="12"
				size-md="4"
			>
				<ion-item>
					<ion-label>
						Вместимость (человек):
						<p>{{ creativeSpace.capacity }}</p>
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
				<h3>Информация об арендодателе</h3>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						ФИО:
						<p>{{ `${creativeSpace.landlordInfo.surname} ${creativeSpace.landlordInfo.name} ${creativeSpace.landlordInfo.patronymic}` }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						Телефон:
						<p>{{ creativeSpace.landlordInfo.phone }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						Название Юр. лица:
						<p>{{ creativeSpace.landlordInfo.legalEntityName }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						ИНН:
						<p>{{ creativeSpace.landlordInfo.inn }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row v-if="creativeSpace.photos.length">
			<ion-col>
				<h3
					class="creative-space-details__photos-title"
				>
					Фотографии:
				</h3>
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
		<ion-row>
			<ion-col>
				<h3>Календарь аренды площадки</h3>
				<p>
					В календаре ниже отображены доступные дни для аренды
				</p>
				<ui-calendar
					:is-date-enabled="checkIsCalendarDateEnabled"
					:highlighted-dates="checkHighlightedDates"
					multiple
					@ion-change="onCalendarChange"
				/>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<h3>Договор аренды</h3>
				<ion-button
					fill="outline"
					@click="downloadContract"
				>
					Скачать
				</ion-button>
			</ion-col>
		</ion-row>
		<template
			v-if="creativeSpace.scores.length"
		>
			<ion-row>
				<ion-col>
					<h3>Отзывы</h3>
				</ion-col>
			</ion-row>
			<ion-row
				v-for="score in creativeSpace.scores.filter(score => score.comment)"
				:key="score.id"
			>
				<ion-col>
					<ion-item>
						<ion-label>
							{{ `${score.user.surname} ${score.user.name} ${score.user.patronymic}` }}:
							<p
								class="creative-space-details__rating"
							>
								Оценка: {{ score.rating }}&nbsp;из 5
							</p>
							<p>{{ score.comment }}</p>
						</ion-label>
					</ion-item>
				</ion-col>
			</ion-row>
		</template>
	</ion-grid>
</template>

<style lang="scss" scoped>
.creative-space-details {
	padding: 16px;

	&__rating,
	&__status {
		display: flex;
		align-items: center;
		margin-top: 12px;
		margin-bottom: 0;
	}

	&__status-badge {
		margin-left: 8px;
	}

	&__rating {
		margin-top: 0;
		margin-bottom: 0;
		color: var(--ion-color-primary)
	}

	&__description {
		white-space: pre-line;
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
