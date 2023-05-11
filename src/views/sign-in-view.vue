<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
	IonPage,
	IonInput,
	IonButton
} from '@ionic/vue'

import api from '@/api'
import { ViewName } from '@/router'
import { useUserStore, useNotificationsStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const formData = ref({
	email: '',
	password: ''
})

async function handleFormSubmit() {
	const { email, password } = formData.value

	try {
		await api.session.post({
			email,
			password
		})

		userStore.setAuthorized()
		router.push({ name: ViewName.HomeView })
	} catch (err) {
		notificationsStore.error('Ошибка при авторизации пользователя')
	}
}
</script>

<template>
	<ion-page class="ion-padding">
		Страница авторизации

		<form @submit.prevent="handleFormSubmit">
			<ion-input
				v-model="formData.email"
				label="Email"
			/>
			<ion-input
				v-model="formData.password"
				label="Пароль"
			/>
			<ion-button type="submit">
				Войти
			</ion-button>
		</form>
	</ion-page>
</template>
