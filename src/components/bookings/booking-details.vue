<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import { isEqual as isDateEqual, format, isBefore, startOfDay } from 'date-fns'
import {
	modalController,
	useIonRouter,
	IonItem,
	IonLabel,
	IonGrid,
	IonRow,
	IonCol,
	IonBadge,
	IonButton,
} from '@ionic/vue'

import api, { BookingStatusEnum } from '@/api'
import type { IBooking } from '@/api'
import { useNotificationsStore, useScreenStore, useUserStore } from '@/stores'
import { bookingStatusNameMapping, bookingStatusBadgeColorMapping } from '@/constants'
import { ViewName } from '@/router'
import { formatPrice } from '@/utils'
import environments from '@/environments'

import UiImage from '@/components/ui/ui-image.vue'
import UiCalendar from '@/components/ui/ui-calendar.vue'
import UiCalendarModal from '@/components/ui/ui-carousel-modal.vue'

const screenStore = useScreenStore()
const notificationsStore = useNotificationsStore()
const userStore = useUserStore()

const ionRouter = useIonRouter()

const props = defineProps({
	id: {
		type: Number as PropType<number>,
		required: true
	},
})

const booking = ref<IBooking | null>(null)

const bookingDaysText = computed(() => {
	return booking.value?.calendarEvents.map(event => format(new Date(event.date), "yyyy.MM.dd")).join('; ') || ''
})

const isFinishedByDate = computed(() => 
	booking.value?.status === BookingStatusEnum.ConfirmedByLandlord &&
	booking.value?.calendarEvents.every(event => isBefore(new Date(event.date), startOfDay(new Date())))
)

const statusTextResult = computed(() => {
	if (!booking.value) {
		return ''
	}

	if (isFinishedByDate.value) {
		return 'Завершен'
	}

	return bookingStatusNameMapping[booking.value.status]
})

const statusColorResult = computed(() => {
	if (!booking.value) {
		return ''
	}

	if (isFinishedByDate.value) {
		return 'success'
	}

	return bookingStatusBadgeColorMapping[booking.value.status]
})

watch(() => props.id, updateBookingData)

function onCreated() {
	updateBookingData()
}

async function updateBookingData() {
	if (!props.id) {
		return
	}

	try {
		const { booking: newBooking } = await api.bookings.get(props.id)
		booking.value = newBooking
	} catch {
		notificationsStore.error('Не удалось получить информацию о заказе')
		ionRouter.replace({ name: ViewName.BookingsView })
	}
}

function checkHighlightedDates(date: string) {
	if (!booking.value) {
		return undefined
	}

	if(booking.value.calendarEvents.some(event => isDateEqual(new Date(event.date), new Date(date)))) {
		return {
			textColor: 'var(--ion-color-contrast)',
			backgroundColor: 'var(--ion-color-base)',
		}
	}

	return undefined
}

async function onImageClick() {
	if (!booking.value?.creativeSpace.photos) {
		return
	}

	const images = booking.value.creativeSpace.photos.map(el => `${environments.S3_ACCESS_DOMAIN_NAME}/${el}`)

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

async function confirmBooking() {
	if (!booking.value) {
		return
	}

	try {
		await api.bookings.update(booking.value.id, {
			status: BookingStatusEnum.ConfirmedByLandlord
		})

		ionRouter.replace({ name: ViewName.BookingsView })

		notificationsStore.success('Бронирование подтверждено')
	} catch {
		notificationsStore.error('Не удалось подтвердить бронирование')
	}
}

onCreated()
</script>

<template>
	<ion-grid
		v-if="booking"
		class="booking-details"
	>
		<ion-row>
			<ion-col>
				<p class="booking-details__status">
					Статус:
					<ion-badge
						class="booking-details__status-badge"
						:color="statusColorResult"
					>
						{{ statusTextResult }}
					</ion-badge>
				</p>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<h3>Основная информация</h3>
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
						<p>{{ booking.creativeSpace.title }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
			<ion-col
				size="12"
				size-md="4"
			>
				<ion-item>
					<ion-label>
						Стоимость аренды (₽):
						<p>{{ formatPrice(booking.fullPrice) }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						Адрес:
						<p>{{ booking.creativeSpace.address }}</p>
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
							class="booking-details__description"
						>
							{{ booking.creativeSpace.description }}
						</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<template
			v-if="userStore.isAdmin || userStore.isTenant"
		>
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
							<p>{{ `${booking.landlordInfo.surname} ${booking.landlordInfo.name} ${booking.landlordInfo.patronymic}` }}</p>
						</ion-label>
					</ion-item>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-item>
						<ion-label>
							Телефон:
							<p>{{ booking.landlordInfo.phone }}</p>
						</ion-label>
					</ion-item>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-item>
						<ion-label>
							Название Юр. лица:
							<p>{{ booking.landlordInfo.legalEntityName }}</p>
						</ion-label>
					</ion-item>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-item>
						<ion-label>
							Инн:
							<p>{{ booking.landlordInfo.inn }}</p>
						</ion-label>
					</ion-item>
				</ion-col>
			</ion-row>
		</template>
		<template
			v-if="userStore.isAdmin || userStore.isLandlord"
		>
			<ion-row>
				<ion-col>
					<h3>Информация об арендаторе</h3>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-item>
						<ion-label>
							ФИО:
							<p>{{ `${booking.tenantInfo.surname} ${booking.tenantInfo.name} ${booking.tenantInfo.patronymic}` }}</p>
						</ion-label>
					</ion-item>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-item>
						<ion-label>
							Телефон:
							<p>{{ booking.tenantInfo.phone }}</p>
						</ion-label>
					</ion-item>
				</ion-col>
			</ion-row>
		</template>
		<ion-row v-if="booking.creativeSpace.photos.length">
			<ion-col>
				<h3
					class="booking-details__photos-title"
				>
					Фотографии:
				</h3>
				<div
					class="booking-details__photos"
				>
					<ui-image
						v-for="(photoName, i) in booking.creativeSpace.photos"
						:key="i"
						class="booking-details__photo"
						:src="`${environments.S3_ACCESS_DOMAIN_NAME}/${photoName}`"
						:size="screenStore.isXs ? '100%' : '180px'"
						@click="onImageClick"
					/>
				</div>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<h3>Даты аренды площадки</h3>
				<p>
					{{ bookingDaysText }}
				</p>
				<ui-calendar
					:highlighted-dates="checkHighlightedDates"
					:is-date-enabled="() => false"
				/>
			</ion-col>
		</ion-row>
		<ion-row
			v-if="userStore.isLandlord && booking.status === BookingStatusEnum.ConfirmationByLandlord"
		>
			<ion-col>
				<ion-button
					class="booking-details__details-button"
					@click="confirmBooking"
				>
					Подтвердить заказ
				</ion-button>
			</ion-col>
		</ion-row>
	</ion-grid>
</template>

<style lang="scss" scoped>
.booking-details {
	padding: 16px;

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

	&__status {
		display: flex;
		align-items: center;
		margin-top: 12px;
		margin-bottom: 0;
	}

	&__status-badge {
		margin-left: 8px;
	}
}
</style>
