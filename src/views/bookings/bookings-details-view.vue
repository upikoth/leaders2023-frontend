<script setup lang="ts">
import { computed } from 'vue'
import {
	useIonRouter,
	IonPage,
	actionSheetController,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonButton,
	IonButtons,
	IonIcon,
	IonContent,
} from '@ionic/vue'
import { useRoute } from 'vue-router'
import { trashOutline, chevronBackOutline } from 'ionicons/icons';

import { useScreenStore, useNotificationsStore, useUserStore } from '@/stores'
import { ViewName } from '@/router';
import api from '@/api'

import BookingDetails from '@/components/bookings/booking-details.vue'

const ionRouter = useIonRouter()

const route = useRoute()
const screenStore = useScreenStore()
const notificationsStore = useNotificationsStore()
const userStore = useUserStore()

const bookingId = computed(() => {
	return Number(route.params.id)
})

const canUserEditOrRemove = computed(() => {
	return userStore.isAdmin
})

function redirectToBookingsPage() {
	ionRouter.replace({ name: ViewName.BookingsView })
}

async function handleDeleteBookingButtonClick() {
	enum ControllerAction {
		Confirm = 'confirm',
		Cancel = 'cancel'
	}

	const actionSheet = await actionSheetController.create({
		header: 'Вы уверены, что хотите удалить заказ?',
		buttons: [
			{
				text: 'Да, удалить заказ',
				data: {
					action: ControllerAction.Confirm,
				},
			},
			{
				text: 'Отменить',
				role: 'cancel',
				data: {
					action: ControllerAction.Cancel,
				},
			},
		],
		animated: screenStore.isXs,
	});

	await actionSheet.present();

	const result = await actionSheet.onDidDismiss();

	if (result.data.action === ControllerAction.Confirm) {
		deleteBooking()
	}
}

async function deleteBooking() {
	try {
		await api.bookings.delete(bookingId.value)

		ionRouter.replace({ name: ViewName.BookingsView })

		notificationsStore.success('Заказ успешно удален')
	} catch {
		notificationsStore.error('Не удалось удалить заказ')
	}
}
</script>

<template>
	<ion-page class="bookings-details-view">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button
						slot="icon-only"
						color="primary"
						shape="round"
						@click="redirectToBookingsPage"
					>
						<ion-icon :icon="chevronBackOutline" />
					</ion-button>
				</ion-buttons>
				<ion-title>
					Заказ
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="bookings-details-view__content">
			<booking-details
				:id="bookingId"
			/>
			<div class="bookings-details-view__content-after">
				<ion-button
					v-if="canUserEditOrRemove"
					class="bookings-details-view__delete-button"
					color="danger"
					fill="outline"
					@click="handleDeleteBookingButtonClick"
				>
					<ion-icon
						:icon="trashOutline"
					/>
					Удалить заказ
				</ion-button>
			</div>
		</ion-content>
	</ion-page>
</template>

<style lang="scss" scoped>
.bookings-details-view {
	&__content-after {
		padding-left: 20px;
	}

	&__booking-button,
	&__delete-button {
		margin-bottom: 16px;
	}
}
</style>
