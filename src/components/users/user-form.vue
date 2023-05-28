<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { PropType } from 'vue'
import { useVuelidate } from '@vuelidate/core';
import {
	useIonRouter,
	IonInput,
	IonButton,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/vue'
import { required, helpers, or } from '@vuelidate/validators';
import cloneDeep from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'

import api, { UserRole } from '@/api'
import { useNotificationsStore, useUserStore } from '@/stores'
import { ViewName } from '@/router'

const notificationsStore = useNotificationsStore()
const userStore = useUserStore()

const ionRouter = useIonRouter()

const props = defineProps({
	id: {
		type: Number as PropType<number>,
		default: NaN,
	},
	isEdit: {
		type: Boolean as PropType<boolean>,
		default: false,
	}
})

const userRole = ref(UserRole.Tenant)

const formData = ref({
	name: '',
	surname: '',
	patronymic: '',
	email: '',
	inn: '',
	legalEntityName: '',
})

let initialFormData = cloneDeep(formData.value)

const rules = {
	formData: {
		name: {
			required: helpers.withMessage('Введите имя', required),
		},
		surname: {
			required: helpers.withMessage('Введите фамилию', required),
		},
		email: {
			required: helpers.withMessage('Введите email', required),
		},
		inn: {
			required: helpers.withMessage('Введите ИНН', or(
				required,
				() => userRole.value !== UserRole.Landlord
			)),
		},
		legalEntityName: {
			required: helpers.withMessage('Введите название Юр. лица', or(
				required,
				() => userRole.value !== UserRole.Landlord
			)),
		},
	}
};

const v$ = useVuelidate(rules, { formData });

const nameError = computed((): string => {
	if (!v$.value.formData.name.$error) {
		return '';
	}

	const message = v$.value.formData.name.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

const surnameError = computed((): string => {
	if (!v$.value.formData.surname.$error) {
		return '';
	}

	const message = v$.value.formData.surname.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

const emailError = computed((): string => {
	if (!v$.value.formData.email.$error) {
		return '';
	}

	const message = v$.value.formData.email.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

const innError = computed((): string => {
	if (!v$.value.formData.inn.$error) {
		return '';
	}

	const message = v$.value.formData.inn.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

const legalEntityNameError = computed((): string => {
	if (!v$.value.formData.legalEntityName.$error) {
		return '';
	}

	const message = v$.value.formData.legalEntityName.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

watch(() => props.id, updateFormData)

async function onCreated() {
	if (!userStore.isAdmin && props.id !== userStore.user.id) {
		ionRouter.replace({ name: ViewName.UsersDetailsView })
		return;
	}

	if (props.isEdit) {
		await updateFormData()
	}
}

async function updateFormData() {
	if (!props.id) {
		return
	}

	try {
		const { user } = await api.users.get(props.id)
		const { name, surname, patronymic, email, inn, legalEntityName, role } = user

		userRole.value = role

		formData.value = {
			...formData.value,
			name,
			surname,
			patronymic,
			email,
			inn: inn || '',
			legalEntityName: legalEntityName || ''
		}

		initialFormData = cloneDeep(formData.value)

	} catch {
		notificationsStore.error('Не удалось получить информацию о пользователе')
		ionRouter.replace({ name: ViewName.UsersDetailsView })
	}
}

async function handleFormSubmit() {
	const isFormValid = await v$.value.$validate();
	if (!isFormValid) {
		notificationsStore.error('Проверьте корректность введенных данных')
		return;
	}

	if (props.isEdit) {
		patchCreativeSpace()
	}
}

async function patchCreativeSpace() {
	if (isEqual(initialFormData, formData.value)) {
		notificationsStore.success('Информация о пользователе успешно обновлена')
		ionRouter.replace({ name: ViewName.UsersDetailsView })
		return;
	}

	try {
		const { name, surname, patronymic, email, inn, legalEntityName } = formData.value

		await api.users.update(props.id, {
			name: isEqual(initialFormData.name, name) ? undefined : name,
			surname: isEqual(initialFormData.surname, surname) ? undefined : surname,
			patronymic: isEqual(initialFormData.patronymic, patronymic) ? undefined : patronymic,
			email: isEqual(initialFormData.email, email) ? undefined : email,
			inn: isEqual(initialFormData.inn, inn) ? undefined : inn,
			legalEntityName: isEqual(initialFormData.legalEntityName, legalEntityName) ? undefined : legalEntityName,
		})

		notificationsStore.success('Информация о пользователе успешно обновлена')
		ionRouter.replace({ name: ViewName.UsersDetailsView })
	} catch {
		notificationsStore.error('Не удалось обновить информацию о пользователе')
	}
}

onCreated()
</script>

<template>
	<form
		class="user-form"
		@submit.prevent="handleFormSubmit"
	>
		<ion-grid
			class="user-form__grid"
		>
			<ion-row>
				<ion-col>
					<ion-input
						v-model="formData.surname"
						:class="surnameError && ['ion-invalid', 'ion-touched']"
						label="Фамилия *"
						inputmode="text"
						label-placement="floating"
						helper-text="&nbsp;"
						:error-text="surnameError"
					/>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-input
						v-model="formData.name"
						:class="nameError && ['ion-invalid', 'ion-touched']"
						label="Имя *"
						inputmode="text"
						label-placement="floating"
						helper-text="&nbsp;"
						:error-text="nameError"
					/>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-input
						v-model="formData.patronymic"
						label="Отчество *"
						inputmode="text"
						label-placement="floating"
						helper-text="&nbsp;"
					/>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-input
						v-model="formData.email"
						:class="emailError && ['ion-invalid', 'ion-touched']"
						label="Email *"
						inputmode="text"
						label-placement="floating"
						helper-text="&nbsp;"
						:error-text="emailError"
					/>
				</ion-col>
			</ion-row>
			<template
				v-if="userRole === UserRole.Landlord"
			>
				<ion-row>
					<ion-col>
						<ion-input
							v-model="formData.inn"
							:class="innError && ['ion-invalid', 'ion-touched']"
							label="ИНН *"
							inputmode="text"
							label-placement="floating"
							helper-text="&nbsp;"
							:error-text="innError"
						/>
					</ion-col>
				</ion-row>
				<ion-row>
					<ion-col>
						<ion-input
							v-model="formData.legalEntityName"
							:class="legalEntityNameError && ['ion-invalid', 'ion-touched']"
							label="Название Юр. лица *"
							inputmode="text"
							label-placement="floating"
							helper-text="&nbsp;"
							:error-text="legalEntityNameError"
						/>
					</ion-col>
				</ion-row>
			</template>
			<ion-row>
				<ion-col>
					<ion-button
						class="user-form__submit-buttton"
						type="submit"
					>
						Обновить информацию
					</ion-button>
				</ion-col>
			</ion-row>
		</ion-grid>
	</form>
</template>

<style lang="scss" scoped>
.user-form {
	padding: 16px;

	&__grid {
		padding: 0;
	}

	&__submit-buttton {
		margin-top: 32px;
	}
}
</style>
