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
} from '@ionic/vue'
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useNotificationsStore } from '@/stores'

const notificationsStore = useNotificationsStore()

const link = ref('')
const linkInputRef = ref<typeof IonInput>()

const rules = {
	link: {
		required: helpers.withMessage('Введите ссылку', required),
	}
};

const v$ = useVuelidate(rules, { link });

const linkError = computed((): string => {
	if (!v$.value.link.$error) {
		return '';
	}

	const message = v$.value.link.$errors[0].$message;

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
		link: link.value,
	})
}
</script>

<template>
	<div class="creative-space-add-link-modal">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="end">
					<ion-button @click="closeModal">
						Закрыть
					</ion-button>
				</ion-buttons>
				<ion-title>Добавление ссылки на календарь</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-card class="creative-space-add-link-modal__card">
				<ion-card-content class="creative-space-add-link-modal__card-content">
					<p>
						Эта ссылка будет использоваться для импорта событий из внешнего календаря
					</p>
					<p>
						Обратите внимание, что ссылка должна быть обязательно в формате iCal 
					</p>
					<ion-input
						ref="linkInputRef"
						v-model="link"
						:class="linkError && ['ion-invalid', 'ion-touched']"
						label="Ссылка на календарь"
						inputmode="text"
						label-placement="floating"
						helper-text="&nbsp;"
						:error-text="linkError"
					/>
					<ion-button
						class="creative-space-add-link-modal__submit-button"
						@click="sumbit"
					>
						Прикрепить ссылку
					</ion-button>
				</ion-card-content>
			</ion-card>
		</ion-content>
	</div>
</template>

<style lang="scss" scoped>
.creative-space-add-link-modal {
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
