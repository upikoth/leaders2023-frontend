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
import { createOutline, trashOutline, chevronBackOutline } from 'ionicons/icons';

import { useScreenStore, useNotificationsStore } from '@/stores'
import { ViewName } from '@/router';
import api from '@/api'

import CreativeSpaceDetails from '@/components/creative-spaces/creative-space-details.vue'

const ionRouter = useIonRouter()

const route = useRoute()
const screenStore = useScreenStore()
const notificationsStore = useNotificationsStore()

const creativeSpaceId = computed(() => {
	return Number(route.params.id)
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
			<creative-space-details :id="creativeSpaceId" />
			<ion-button
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
		</ion-content>
	</ion-page>
</template>

<style lang="scss" scoped>
.creative-spaces-details-view {
	&__header-buttons {
		margin-right: 20px;
	}

	&__delete-button {
		margin-top: 32px;
		margin-bottom: 16px;
		margin-left: 16px;
	}
}
</style>
