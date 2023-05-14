<script setup lang="ts">
import { ref } from 'vue'

import {
	IonInput,
	IonButton,
} from '@ionic/vue'

const formData = ref({
	phone: '',
	password: ''
})

async function handleFormSubmit() {
	console.log(formData)
}
</script>

<template>
	<form
		class="creative-space-form"
		@submit.prevent="handleFormSubmit"
		@keyup.enter="handleFormSubmit"
	>
		<ion-input
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
</template>

<style lang="scss" scoped>
.creative-space-form {
	padding: 20px;
}
</style>
