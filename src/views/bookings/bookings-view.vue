<script setup lang="ts">
import { ref } from 'vue'
import {
	onIonViewWillEnter,
	IonPage,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonContent,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/vue'

import api, { DataLoadingStateEnum } from '@/api'
import type { IBookingListItem } from '@/api'
import { useNotificationsStore } from '@/stores'

import UiAsyncDataWrapper from '@/components/ui/ui-async-data-wrapper.vue'

import BookingCard from '@/components/bookings/booking-card.vue'
import BookingCardSkeleton from '@/components/bookings/booking-card-skeleton.vue'

const notificationsStore = useNotificationsStore()

const bookings = ref<IBookingListItem[]>([])

const bookingsLoadingState = ref(DataLoadingStateEnum.DidNotLoad)

onIonViewWillEnter(() => {
	updateBookings()
})

async function updateBookings() {
	try {
		bookingsLoadingState.value = DataLoadingStateEnum.Loading
		bookings.value = (await api.bookings.getAll()).bookings
		bookingsLoadingState.value = DataLoadingStateEnum.LoadedSuccess
	} catch {
		bookingsLoadingState.value = DataLoadingStateEnum.LoadedError
		notificationsStore.error('Ошибка при получении списка бронирований')
	}
}
</script>

<template>
	<ion-page class="bookings-view">
		<ion-header>
			<ion-toolbar>
				<ion-title>
					Мои заказы
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="bookings-view__content">
			<ui-async-data-wrapper :state="bookingsLoadingState">
				<template #loading>
					<ion-grid
						class="bookings-view__list"
					>
						<ion-row>
							<ion-col
								v-for="i in 6"
								:key="i"
								size="12"
								size-md="6"
							>
								<booking-card-skeleton />
							</ion-col>
						</ion-row>
					</ion-grid>
				</template>
				<template #error>
					Ошибка при загрузке заказов. Попробуйте еще раз.
				</template>
				<ion-grid
					v-if="bookings.length"
					class="bookings-view__list"
				>
					<ion-row>
						<ion-col
							v-for="booking in bookings"
							:key="booking.id"
							size="12"
							size-md="6"
						>
							<booking-card
								:booking="booking"
								@scores-added="updateBookings"
							/>
						</ion-col>
					</ion-row>
				</ion-grid>
				<p
					v-else
					class="bookings-view__dummy"
				>
					Пока нет ни одного заказа
				</p>
			</ui-async-data-wrapper>
		</ion-content>
	</ion-page>
</template>

<style lang="scss" scoped>
.bookings-view {
	&__content {
		ion-grid {
			--ion-grid-padding: 8px;
			--ion-grid-column-padding: 12px;
		}
	}

	&__dummy {
		padding-left: 20px;
	}
}
</style>
