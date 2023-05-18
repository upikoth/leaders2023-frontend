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
import type { IUser } from '@/api'
import { useNotificationsStore } from '@/stores'

import UserCard from '@/components/users/user-card.vue'

const notificationsStore = useNotificationsStore()

const users = ref<IUser[]>([])

onIonViewWillEnter(() => {
	updateUsers()
})

async function updateUsers() {
	try {
		users.value = (await api.users.getAll()).users
	} catch {
		notificationsStore.error('Ошибка при получении списка креативных пространств')
	}
}
</script>

<template>
	<ion-page class="users-view">
		<ion-header>
			<ion-toolbar>
				<ion-title>
					Пользователи
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="users-view__content">
			<ion-grid>
				<ion-row>
					<ion-col
						v-for="user in users"
						:key="user.id"
						size="12"
						size-md="6"
					>
						<user-card :user="user" />
					</ion-col>
				</ion-row>
			</ion-grid>
		</ion-content>
	</ion-page>
</template>

<style lang="scss" scoped>
.users-view {
	&__content {
		ion-grid {
			--ion-grid-padding: 8px;
			--ion-grid-column-padding: 12px;
		}
	}
}
</style>
