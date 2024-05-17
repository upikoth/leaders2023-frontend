<script setup lang="ts">
import { ref, computed } from 'vue'
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
import { createOutline, trashOutline, chevronBackOutline } from 'ionicons/icons';

import { useScreenStore, useNotificationsStore, useUserStore } from '@/stores'
import { ViewName } from '@/router';
import api, { CreativeSpaceStatusEnum, DataLoadingStateEnum } from '@/api'
import type { ICalendarEventFull } from '@/api'

import CreativeSpaceDetails from '@/components/creative-spaces/creative-space-details.vue'

const ionRouter = useIonRouter()

const route = useRoute()
const screenStore = useScreenStore()
const notificationsStore = useNotificationsStore()
const userStore = useUserStore()

const creativeSpaceLandlordId = ref('')
const selectedCalendarDays = ref<string[]>([])
const creativeSpaceEvents = ref<ICalendarEventFull[]>([])
const creativeSpaceStatus = ref(CreativeSpaceStatusEnum.ConfirmationByAdmin)
const creativeSpaceLoadingState = ref(DataLoadingStateEnum.DidNotLoad)

const creativeSpaceId = computed(() => {
	return route.params.id ? String(route.params.id) : ''
})

const canUserEditSpace = computed(() => {
	return userStore.isLandlord && creativeSpaceLandlordId.value === userStore.user.id || userStore.isAdmin
})

const isCreativeSpaceHasBookings = computed(() => {
	return creativeSpaceEvents.value.some(el => el.bookingId > 0)
})

const canUserRemoveSpace = computed(() => {
	return userStore.isLandlord && creativeSpaceLandlordId.value === userStore.user.id || userStore.isAdmin
})

const canBookSpace = computed(() => {
	return userStore.isTenant
})

function redirectToCreativeSpacesEditPage() {
	ionRouter.replace({ name: ViewName.CreativeSpacesEditView })
}

async function handleDeleteCreativeSpaceButtonClick() {
	enum ControllerAction {
		Delete = 'delete',
		Cancel = 'cancel'
	}

	const actionSheet = await actionSheetController.create({
		header: 'Вы уверены, что хотите удалить площадку?',
		buttons: [
			{
				text: 'Да, удалить площадку',
				role: 'destructive',
				data: {
					action: ControllerAction.Delete,
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

	if (result.data.action === ControllerAction.Delete) {
		deleteCreativeSpace()
	}
}

async function deleteCreativeSpace() {
	if (isCreativeSpaceHasBookings.value) {
		notificationsStore.error('Нельзя удалить площадку. На нее есть бронь')
		return
	}

	try {
		await api.creativeSpaces.delete(creativeSpaceId.value)
		ionRouter.replace({ name: ViewName.CreativeSpacesView })

		notificationsStore.success('Креативная площадка успешно удалена')
	} catch {
		notificationsStore.error('Не удалось удалить креативную площадку')
	}
}

function redirectToCreativeSpacesPage() {
	ionRouter.replace({ name: ViewName.CreativeSpacesView })
}

async function handleBookingButtonClick() {
	enum ControllerAction {
		Confirm = 'confirm',
		Cancel = 'cancel'
	}

	const actionSheet = await actionSheetController.create({
		header: 'Вы уверены, что хотите арендовать площадку?',
		buttons: [
			{
				text: 'Да, арендовать площадку',
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
		bookCreativeSpace()
	}
}

async function bookCreativeSpace() {
	try {
		await api.bookings.create({
			creativeSpaceId: creativeSpaceId.value,
			calendarEvents: selectedCalendarDays.value.map(date => ({ date }))
		})

		ionRouter.replace({ name: ViewName.BookingsView })

		notificationsStore.success('Креативная площадка успешно забронирована')
	} catch {
		notificationsStore.error('Не удалось забронировать креативную площадку')
	}
}

async function handleConfirmButtonClick() {
	try {
		await api.creativeSpaces.update(creativeSpaceId.value, {
			status: CreativeSpaceStatusEnum.ConfirmedByAdmin
		})

		ionRouter.replace({ name: ViewName.CreativeSpacesView })

		notificationsStore.success('Креативная площадка успешно опубликована')
	} catch {
		notificationsStore.error('Не удалось опубликовать креативную площадку')
	}
}
</script>

<template>
	<ion-page class="creative-spaces-details-view">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button
						slot="icon-only"
						color="primary"
						shape="round"
						@click="redirectToCreativeSpacesPage"
					>
						<ion-icon :icon="chevronBackOutline" />
					</ion-button>
				</ion-buttons>
				<ion-title>
					Креативная площадка
				</ion-title>
				<ion-buttons
					v-if="canUserEditSpace"
					slot="end"
					class="creative-spaces-details-view__header-buttons"
				>
					<ion-button
						color="primary"
						fill="outline"
						@click="redirectToCreativeSpacesEditPage"
					>
						<ion-icon
							:icon="createOutline"
						/>
						<template v-if="screenStore.isSmUp">
							Редактировать
						</template>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content class="creative-spaces-details-view__content">
			<creative-space-details
				:id="creativeSpaceId"
				v-model:landlord-id="creativeSpaceLandlordId"
				v-model:selected-calendar-days="selectedCalendarDays"
				v-model:creative-space-events="creativeSpaceEvents"
				v-model:creative-space-status="creativeSpaceStatus"
				v-model:creative-space-loading-state="creativeSpaceLoadingState"
			/>
			<div
				v-if="creativeSpaceLoadingState === DataLoadingStateEnum.LoadedSuccess"
				class="creative-spaces-details-view__content-after"
			>
				<ion-button
					v-if="canBookSpace"
					class="creative-spaces-details-view__booking-button"
					:disabled="!selectedCalendarDays.length"
					@click="handleBookingButtonClick"
				>
					Арендовать площадку
				</ion-button>
				<ion-button
					v-if="userStore.isAdmin && creativeSpaceStatus === CreativeSpaceStatusEnum.ConfirmationByAdmin"
					class="creative-spaces-details-view__confirm-button"
					@click="handleConfirmButtonClick"
				>
					Опубликовать площадку
				</ion-button>
				<ion-button
					v-if="canUserRemoveSpace"
					class="creative-spaces-details-view__delete-button"
					color="danger"
					fill="outline"
					@click="handleDeleteCreativeSpaceButtonClick"
				>
					<ion-icon
						:icon="trashOutline"
					/>
					Удалить площадку
				</ion-button>
			</div>
		</ion-content>
	</ion-page>
</template>

<style lang="scss" scoped>
.creative-spaces-details-view {
	&__header-buttons {
		margin-right: 20px;
	}

	&__content-after {
		padding-left: 20px;

		> ion-button {
			margin-right: 20px;
		}
	}

	&__confirm-button,
	&__booking-button,
	&__delete-button {
		margin-bottom: 16px;
	}
}
</style>
