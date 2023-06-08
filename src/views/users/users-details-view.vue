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
import { createOutline, trashOutline, logOutOutline, chevronBackOutline } from 'ionicons/icons';

import { useScreenStore, useNotificationsStore, useUserStore } from '@/stores'
import { ViewName } from '@/router';
import api, { DataLoadingStateEnum } from '@/api'

import UserDetails from '@/components/users/user-details.vue'

const ionRouter = useIonRouter()

const route = useRoute()
const userStore = useUserStore()
const screenStore = useScreenStore()
const notificationsStore = useNotificationsStore()

const userLoadingState = ref(DataLoadingStateEnum.DidNotLoad)

const userId = computed(() => {
	return Number(route.params.userId)
})

function redirectToUsersEditPage() {
	ionRouter.replace({ name: ViewName.UsersEditView })
}

async function handleDeleteUserButtonClick() {
	enum ControllerAction {
		Delete = 'delete',
		Cancel = 'cancel'
	}

	const actionSheet = await actionSheetController.create({
		header: 'Вы уверены, что хотите удалить пользователя?',
		buttons: [
			{
				text: 'Да, удалить пользователя',
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
		deleteUser()
	}
}

async function deleteUser() {
	try {
		await api.users.delete(userId.value)
		ionRouter.replace({ name: ViewName.UsersView })

		notificationsStore.success('Пользователь успешно удален')
	} catch {
		notificationsStore.error('Не удалось удалить пользователя')
	}
}

function redirectToUsersPage() {
	ionRouter.replace({ name: ViewName.UsersView })
}

async function handleLogoutButtonClick() {
	userStore.setUnauthorized()
}
</script>

<template>
	<ion-page class="users-details-view">
		<ion-header>
			<ion-toolbar>
				<ion-buttons
					v-if="userStore.isAdmin && userStore.user.id !== userId"
					slot="start"
				>
					<ion-button
						slot="icon-only"
						color="primary"
						shape="round"
						@click="redirectToUsersPage"
					>
						<ion-icon :icon="chevronBackOutline" />
					</ion-button>
				</ion-buttons>
				<ion-title>
					Профиль пользователя
				</ion-title>
				<ion-buttons
					slot="end"
					class="users-details-view__header-buttons"
				>
					<ion-button
						color="primary"
						fill="outline"
						@click="redirectToUsersEditPage"
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
		<ion-content class="users-details-view__content">
			<user-details
				:id="userId"
				v-model:user-loading-state="userLoadingState"
			/>
			<template
				v-if="userLoadingState === DataLoadingStateEnum.LoadedSuccess"
			>
				<ion-button
					v-if="userStore.user.id !== userId"
					class="users-details-view__delete-button"
					color="danger"
					fill="outline"
					@click="handleDeleteUserButtonClick"
				>
					<ion-icon
						:icon="trashOutline"
					/>
					Удалить пользователя
				</ion-button>
				<ion-button
					v-else
					class="users-details-view__logout-button"
					fill="outline"
					@click="handleLogoutButtonClick"
				>
					<ion-icon
						:icon="logOutOutline"
					/>
					Выйти из приложения
				</ion-button>
			</template>
		</ion-content>
	</ion-page>
</template>

<style lang="scss" scoped>
.users-details-view {
	&__header-buttons {
		margin-right: 20px;
	}

	&__logout-button,
	&__delete-button {
		margin-top: 32px;
		margin-left: 16px;
	}
}
</style>
