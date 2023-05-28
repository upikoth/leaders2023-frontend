<script setup lang="ts">
import { ref, computed } from 'vue'
import {
	modalController,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonContent,
	IonCard,
	IonCardContent,
	IonInput,
	IonTextarea
} from '@ionic/vue'
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useNotificationsStore } from '@/stores'

import { maskRating } from '@/utils'
import { vMask } from '@/directives';

const notificationsStore = useNotificationsStore()

const formData = ref({
	comment: '',
	rating: '',
})

const rules = {
	formData: {
		rating: {
			required: helpers.withMessage('Введите оценку', required),
		}
	}
};

const v$ = useVuelidate(rules, { formData });

const ratingError = computed((): string => {
	if (!v$.value.formData.rating.$error) {
		return '';
	}

	const message = v$.value.formData.rating.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

function closeModal(data: unknown) {
	modalController.dismiss(data)
}

async function sumbit() {
	const isFormValid = await v$.value.$validate();
	if (!isFormValid) {
		notificationsStore.error('Проверьте корректность введенных данных')
		return;
	}

	closeModal({
		...formData.value
	})
}
</script>

<template>
	<div class="ui-rate-creative-space-modal">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="end">
					<ion-button @click="closeModal">
						Закрыть
					</ion-button>
				</ion-buttons>
				<ion-title>
					Отзыв
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-card class="ui-rate-creative-space-modal__card">
				<ion-card-content class="ui-rate-creative-space-modal__card-content">
					<ion-input
						v-model="formData.rating"
						v-mask="maskRating"
						:class="ratingError && ['ion-invalid', 'ion-touched']"
						label="Оцените площадку от 1 до 10 *"
						type="number"
						inputmode="numeric"
						label-placement="floating"
						helper-text="&nbsp;"
						:error-text="ratingError"
						:min="1"
						:max="10"
					/>
					<ion-textarea 
						v-model="formData.comment"
						label="Напишите развернуты комментарий *"
						label-placement="floating"
						:counter="true"
						:maxlength="1000"
						auto-grow
					/>
					<ion-button
						class="ui-rate-creative-space-modal__submit-button"
						@click="sumbit"
					>
						Сохранить отзыв
					</ion-button>
				</ion-card-content>
			</ion-card>
		</ion-content>
	</div>
</template>

<style lang="scss" scoped>
.ui-rate-creative-space-modal {
	display: flex;
	height: 100%;
	flex-direction: column;

	&__card {
		height: 100%;
		margin: 0;
	}

	&__card-content {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: start;

		> p {
			margin-bottom: 12px;
			font-size: 15px;
		}
	}

	&__submit-button {
		margin-top: auto;
		margin-left: auto;
	}
}
</style>
