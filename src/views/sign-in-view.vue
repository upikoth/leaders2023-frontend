<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
	IonPage,
	IonInput,
	IonButton,
	IonCard,
	IonCardHeader,
	IonCardContent,
	IonCardTitle
} from '@ionic/vue'

import api from '@/api'
import { ViewName } from '@/router'
import { useUserStore, useNotificationsStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const phoneInputRef = ref<typeof IonInput>()

const formData = ref({
	phone: '',
	password: ''
})

onMounted(() => {
	setTimeout(() => {
		phoneInputRef.value?.$el.setFocus()
	}, 100);
})

async function handleFormSubmit() {
	const { phone, password } = formData.value

	try {
		await api.session.post({
			phone,
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
	<ion-page class="sign-in-view">
		<ion-card class="sign-in-view__card">
			<ion-card-header class="sign-in-view__card-header">
				<ion-card-title>Вход в личный кабинет</ion-card-title>
			</ion-card-header>
			<ion-card-content class="sign-in-view__card-content">
				<form
					@submit.prevent="handleFormSubmit"
					@keyup.enter="handleFormSubmit"
				>
					<ion-input
						ref="phoneInputRef"
						v-model="formData.phone"
						class="sign-in-view__phone-input"
						label="Телефон"
						inputmode="tel"
						type="tel"
						autocomplete="on"
						label-placement="floating"
						error-text=" "
					/>
					<ion-input
						v-model="formData.password"
						class="sign-in-view__password-input"
						label="Пароль"
						type="password"
						inputmode="text"
						label-placement="floating"
						autocomplete="on"
						error-text=" "
					/>
					<ion-button
						class="sign-in-view__submit-button"
						type="submit"
						expand="block"
					>
						Войти
					</ion-button>
				</form>
			</ion-card-content>
		</ion-card>
	</ion-page>
</template>

<style lang="scss" scoped>
.sign-in-view {
	align-items: center;
	justify-content: center;

	&__card {
		width: 400px;
		margin: 0;
	}

	&__card-header {
		padding: 24px;
	}

	&__card-content {
		padding: 0 24px 24px;
	}

	&__phone-input,
	&__password-input {
		:deep(.native-input:-webkit-autofill) {
			-webkit-box-shadow: 0 0 0 30px #ffffff inset !important;

			&:hover, 
			&:focus, 
			&:active {
				-webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
			}
		}

		:deep(.label-text-wrapper) {
			z-index: 5;
		}
	}

	&__submit-button {
		margin-top: 20px;
	}
}
</style>