<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { format, isBefore, startOfDay } from 'date-fns'
import {
	useIonRouter,
	IonCard,
	IonCardTitle,
	IonCardSubtitle,
	IonCardHeader,
	IonCardContent,
	IonBadge,
	IonButton,
} from '@ionic/vue'

import type { IBookingListItem } from '@/api'
import { BookingStatusEnum } from '@/api'
import { formatPrice, maskPhone } from '@/utils'
import { ViewName } from '@/router'
import { bookingStatusNameMapping, bookingStatusBadgeColorMapping } from '@/constants'
import { useScreenStore, useUserStore } from '@/stores'
import environments from '@/environments'

import UiCarousel from '@/components/ui/ui-carousel.vue'

const ionRouter = useIonRouter()

const screenStore = useScreenStore()
const userStore = useUserStore()

const props = defineProps({
	booking: {
		type: Object as PropType<IBookingListItem>,
		required: true
	},
})

const isFinishedByDate = computed(() => 
	props.booking.status === BookingStatusEnum.ConfirmedByLandlord &&
	props.booking.calendarEvents.every(event => isBefore(new Date(event.date), startOfDay(new Date())))
)

const statusTextResult = computed(() => {
	if (isFinishedByDate.value) {
		return 'Завершен'
	}

	return bookingStatusNameMapping[props.booking.status]
})

const statusColorResult = computed(() => {
	if (isFinishedByDate.value) {
		return 'success'
	}

	return bookingStatusBadgeColorMapping[props.booking.status]
})

const emit = defineEmits({
	'before-redirect-to-details-page': null,
});

const bookingDaysText = computed(() => {
	return props.booking.calendarEvents.map(event => format(new Date(event.date), "yyyy.MM.dd")).join('; ')
})

const images = computed((): string[] => props.booking.creativeSpace.photos.map(photoName => `${environments.S3_ACCESS_DOMAIN_NAME}/${photoName}`))

function redirectToBookingDetailsPage() {
	emit('before-redirect-to-details-page')
	ionRouter.replace({ name: ViewName.BookingsDetailsView, params: { id: props.booking.id } })
}
</script>

<template>
	<ion-card class="booking-card">
		<div>
			<ui-carousel
				:images="images"
				height="200px"
			/>
		</div>

		<ion-card-header>
			<ion-card-title class="booking-card__title">
				{{ props.booking.creativeSpace.title }}
			</ion-card-title>
			<ion-card-subtitle class="booking-card__subtitle">
				{{ props.booking.creativeSpace.address }}
			</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content class="booking-card__conent">
			<p class="booking-card__status">
				<b>Статус:</b>
				<ion-badge
					class="booking-card__status-badge"
					:color="statusColorResult"
				>
					{{ statusTextResult }}
				</ion-badge>
			</p>
			<p>
				<b>Стоимость:</b>
				{{ formatPrice(props.booking.fullPrice) }}
			</p>
			<p>
				<b>Даты аренды:</b>
				{{ bookingDaysText }}
			</p>
			<p
				v-if="userStore.isAdmin || userStore.isTenant"
				class="booking-card__one-line-content"
			>
				<b>ФИО арендодателя:</b>
				{{ `${booking.landlordInfo.surname} ${booking.landlordInfo.name} ${booking.landlordInfo.patronymic}` }}
			</p>
			<p
				v-if="userStore.isAdmin || userStore.isTenant"
				class="booking-card__one-line-content"
			>
				<b>Телефон арендодателя:</b>
				{{ maskPhone(booking.landlordInfo.phone) }}
			</p>
			<p
				v-if="userStore.isAdmin || userStore.isLandlord"
				class="booking-card__one-line-content"
			>
				<b>ФИО арендатора:</b>
				{{ `${booking.tenantInfo.surname} ${booking.tenantInfo.name} ${booking.tenantInfo.patronymic}` }}
			</p>
			<p
				v-if="userStore.isAdmin || userStore.isLandlord"
				class="booking-card__one-line-content"
			>
				<b>Телефон арендатора:</b>
				{{ maskPhone(booking.tenantInfo.phone) }}
			</p>
			<ion-button
				class="booking-card__details-button"
				fill="outline"
				:size="screenStore.isXs ? 'small' : 'default'"
				@click="redirectToBookingDetailsPage"
			>
				Подробнее
			</ion-button>
		</ion-card-content>
	</ion-card>
</template>

<style lang="scss" scoped>
.booking-card {
	display: flex;
	height: 500px;
	flex-direction: column;
	margin: 0;

	&__conent {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	&__one-line-content,
	&__subtitle,
	&__title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__status {
		display: flex;
		align-items: center;
	}

	&__status-badge {
		margin-left: 8px;
	}

	&__details-button {
		margin-top: auto;
		margin-left: auto;
	}
}
</style>
