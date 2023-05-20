<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
import {
	useIonRouter,
	IonPage,
	IonInput,
	IonButton,
	IonCard,
	IonCardHeader,
	IonCardContent,
	IonCardTitle
} from '@ionic/vue'

import api from '@/api'
import { getMainViewName } from '@/router'
import { useUserStore, useNotificationsStore } from '@/stores'
import { maskPhone, unmaskPhone } from '@/utils'
import { vMask } from '@/directives'
import { useScreenStore } from '@/stores'

const ionRouter = useIonRouter()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const screenStore = useScreenStore()

const formData = ref({
	phone: '',
	password: ''
})

const rules = {
	formData: {
		phone: {
			required: helpers.withMessage('Введите телефон', required),
			minLength: helpers.withMessage('Введите корректный телефон', minLength(18))
		},
		password: {
			required: helpers.withMessage('Введите пароль', required),
		},
	}
};

const v$ = useVuelidate(rules, { formData });

const phoneError = computed((): string => {
	if (!v$.value.formData.phone.$error) {
		return '';
	}

	const message = v$.value.formData.phone.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

const passwordError = computed((): string => {
	if (!v$.value.formData.password.$error) {
		return '';
	}

	const message = v$.value.formData.password.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

const classList = computed(() => ({
	'sign-in-view_xs': screenStore.isXs,
}))

async function handleFormSubmit() {
	const isFormValid = await v$.value.$validate();
	if (!isFormValid) {
		return;
	}

	const { phone, password } = formData.value

	try {
		await api.session.post({
			password,
			phone: unmaskPhone(phone),
		})

		await userStore.checkAuthorization()
		ionRouter.replace({ name: getMainViewName() })
	} catch (err) {
		notificationsStore.error('Ошибка при авторизации пользователя')
	}
}
</script>

<template>
	<ion-page
		class="sign-in-view"
		:class="classList"
	>
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
						v-model="formData.phone"
						v-mask="maskPhone"
						class="sign-in-view__phone-input"
						:class="phoneError && ['ion-invalid', 'ion-touched']"
						label="Телефон"
						inputmode="tel"
						type="tel"
						autocomplete="on"
						label-placement="floating"
						helper-text=" "
						:error-text="phoneError"
					/>
					<ion-input
						v-model="formData.password"
						class="sign-in-view__password-input"
						:class="passwordError && ['ion-invalid', 'ion-touched']"
						label="Пароль"
						type="password"
						inputmode="text"
						label-placement="floating"
						autocomplete="on"
						helper-text=" "
						:error-text="passwordError"
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

		.sign-in-view_xs & {
			display: flex;
			width: 100%;
			height: 100%;
			flex-direction: column;
			justify-content: center;
		}
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
