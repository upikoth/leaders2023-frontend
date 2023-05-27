<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { format } from 'date-fns'
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

import type { IBookingListItem } from '@/api';
import { formatPrice } from '@/utils'
import { ViewName } from '@/router';
import { bookingStatusNameMapping, bookingStatusBadgeColorMapping } from '@/constants'
import { useScreenStore } from '@/stores'
import environments from '@/environments'

import UiCarousel from '@/components/ui/ui-carousel.vue'

const ionRouter = useIonRouter()

const screenStore = useScreenStore()

const props = defineProps({
	booking: {
		type: Object as PropType<IBookingListItem>,
		required: true
	},
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
					:color="bookingStatusBadgeColorMapping[props.booking.status]"
				>
					{{ bookingStatusNameMapping[props.booking.status] }}
				</ion-badge>
			</p>
			<p>
				<b>Стоимость:</b>
				{{ formatPrice(props.booking.fullPrice) }}
			</p>
			<p
				class="booking-card__info-metro"
			>
				<b class="booking-card__info-metro-title">Даты аренды:</b>
				{{ bookingDaysText }}
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

	&__info-description {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
	}

	&__details-button {
		margin-top: auto;
		margin-left: auto;
	}
}
</style>
