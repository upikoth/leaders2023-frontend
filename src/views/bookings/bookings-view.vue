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

import api from '@/api'
import type { IBookingListItem } from '@/api'
import { useNotificationsStore } from '@/stores'

import BookingCard from '@/components/bookings/booking-card.vue'

const notificationsStore = useNotificationsStore()

const bookings = ref<IBookingListItem[]>([])

onIonViewWillEnter(() => {
	updateBookings()
})

async function updateBookings() {
	try {
		bookings.value = (await api.bookings.getAll()).bookings
	} catch {
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
