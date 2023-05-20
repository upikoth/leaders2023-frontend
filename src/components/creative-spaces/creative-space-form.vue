<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { PropType } from 'vue'
import debounce from 'lodash.debounce';
import { useVuelidate } from '@vuelidate/core';
import {
	useIonRouter,
	IonInput,
	IonButton,
	IonTextarea,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/vue'
import { addOutline } from 'ionicons/icons';
import { required, minLength, helpers } from '@vuelidate/validators';
import cloneDeep from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'

import { getFilesFromComputer, declOfNum, maskPricePerHour } from '@/utils'
import api from '@/api'
import { useScreenStore, useNotificationsStore } from '@/stores'
import { ViewName } from '@/router';
import { vMask } from '@/directives'

import UiSelect from '@/components/ui/ui-select.vue'
import UiImage from '@/components/ui/ui-image.vue'

const S3_ACCESS_DOMAIN_NAME = import.meta.env.S3_ACCESS_DOMAIN_NAME

const screenStore = useScreenStore()
const notificationsStore = useNotificationsStore()

const ionRouter = useIonRouter()

const MAX_PHOTOS_COUNT = 10

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

const formData = ref({
	title: '',
	address: '',
	description: '',
	photos: [] as string[],
	pricePerHour: '',
	metroStations: [],
	coordinate: {
		latitude: '',
		longitude: '',
	},
	workingHours: {
		startAt: '10:00',
		endAt: '21:00'
	}
})

let initialFormData = cloneDeep(formData.value)

const rules = {
	formData: {
		title: {
			required: helpers.withMessage('Введите название', required),
		},
		pricePerHour: {
			required: helpers.withMessage('Введите стоимость аренды', required),
		},
		address: {
			required: helpers.withMessage('Введите адрес', required),
		},
		description: {
			required: helpers.withMessage('Введите описание', required),
		},
		photos: {
			required: helpers.withMessage('Добавьте фотографию', required),
			minLength: helpers.withMessage('Добавьте фотографию', minLength(1))
		},
	}
};

const v$ = useVuelidate(rules, { formData });

const addresses = ref<InstanceType<typeof UiSelect>['$props']['items']>([])
const addressSearch = ref(formData.value.address || 'Москва')

const debouncedUpdateAddresses = debounce(updateAddresses, 300);

const photosInfoText = computed(() => {
	const photosLeftCount = MAX_PHOTOS_COUNT - formData.value.photos.length
	return `Можно добавить еще ${photosLeftCount} ${declOfNum(photosLeftCount, ['фотографию', 'фотографии', 'фотографий'])}`
})

const titleError = computed((): string => {
	if (!v$.value.formData.title.$error) {
		return '';
	}

	const message = v$.value.formData.title.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

const pricePerHourError = computed((): string => {
	if (!v$.value.formData.pricePerHour.$error) {
		return '';
	}

	const message = v$.value.formData.pricePerHour.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

const addressError = computed((): string => {
	if (!v$.value.formData.address.$error) {
		return '';
	}

	const message = v$.value.formData.address.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

const descriptionError = computed((): string => {
	if (!v$.value.formData.description.$error) {
		return '';
	}

	const message = v$.value.formData.description.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

const photosError = computed((): string => {
	if (!v$.value.formData.photos.$error) {
		return '';
	}

	const message = v$.value.formData.photos.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

watch(() => addressSearch.value, () => {
	debouncedUpdateAddresses()
})

watch(() => props.id, updateFormData)

async function created() {
	if (props.isEdit) {
		await updateFormData()
	}
	updateAddresses()
}

async function updateFormData() {
	if (!props.id) {
		return
	}

	try {
		const { creativeSpace } = await api.creativeSpaces.get(props.id)
		const { title, description, address, photos, pricePerHour, coordinate, workingHours } = creativeSpace

		addressSearch.value = address

		formData.value = {
			...formData.value,
			title,
			description,
			address,
			photos,
			workingHours,
			pricePerHour: String(pricePerHour),
			coordinate: {
				latitude: String(coordinate.latitude),
				longitude: String(coordinate.longitude),
			},
		}

		initialFormData = cloneDeep(formData.value)
	} catch {
		notificationsStore.error('Не удалось получить информацию о креативной площадке')
		ionRouter.replace({ name: ViewName.CreativeSpacesView })
	}
}

async function updateAddresses() {
	if (!addressSearch.value) {
		return
	}

	try {
		const result = await api.addresses.get({
			query: addressSearch.value
		})

		addresses.value = result.addresses.map(address => ({
			value: address.value,
			options: {
				latitude: address.latitude,
				longitude: address.longitude,
			}
		}))
	} catch {
		// Ничего не делаем.
	}
}

function updateFormDataCoordinates({ latitude, longitude }: { latitude: string, longitude: string }) {
	formData.value.coordinate = {
		latitude,
		longitude
	}
}

async function deletePhoto(index: number) {
	try {
		const fileNameToDelete = formData.value.photos[index]

		await api.files.delete(fileNameToDelete)

		formData.value.photos = formData.value.photos.filter(photoName => photoName !== fileNameToDelete)
	} catch {
		notificationsStore.error('Не удалось удалить фотографию. Попробуйте еще раз')
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
	} else {
		createCreativeSpace()
	}
}

async function patchCreativeSpace() {
	if (isEqual(initialFormData, formData.value)) {
		notificationsStore.success('Креативная площадка успешно обновлена')
		ionRouter.replace({ name: ViewName.CreativeSpacesView })
		return;
	}

	try {
		const { title, address, description, pricePerHour, photos, coordinate, metroStations, workingHours } = formData.value

		await api.creativeSpaces.update(props.id, {
			title: isEqual(initialFormData.title, title) ? undefined : title,
			address: isEqual(initialFormData.address, address) ? undefined : address,
			description: isEqual(initialFormData.description, description) ? undefined : description,
			photos: isEqual(initialFormData.photos, photos) ? undefined : photos,
			metroStations: isEqual(initialFormData.metroStations, metroStations) ? undefined : metroStations,
			workingHours: isEqual(initialFormData.workingHours, workingHours) ? undefined : workingHours,
			coordinate: isEqual(initialFormData.coordinate, coordinate) ? undefined : {
				latitude: Number.parseFloat(coordinate.latitude),
				longitude: Number.parseFloat(coordinate.longitude)
			},
			pricePerHour: isEqual(initialFormData.pricePerHour, pricePerHour) ? undefined : Number.parseInt(pricePerHour),
		})

		notificationsStore.success('Креативная площадка успешно обновлена')
		ionRouter.replace({ name: ViewName.CreativeSpacesView })
	} catch {
		notificationsStore.error('Не удалось обновить креативную площадку')
	}
}

async function createCreativeSpace() {
	try {
		const { title, address, description, pricePerHour, photos, coordinate, metroStations, workingHours } = formData.value

		await api.creativeSpaces.create({
			title,
			address,
			description,
			photos,
			metroStations,
			workingHours,
			coordinate: {
				latitude: Number.parseFloat(coordinate.latitude),
				longitude: Number.parseFloat(coordinate.longitude)
			},
			pricePerHour: Number.parseInt(pricePerHour),
		})

		notificationsStore.success('Креативная площадка успешно создана')

		ionRouter.replace({ name: ViewName.CreativeSpacesView })
	} catch {
		notificationsStore.error('Не удалось создать креативную площадку')
	}
}

function addFiles() {
	getFilesFromComputer(async (files) => {
		Array.from(files)
			.filter(file => file.type.startsWith('image/'))
			.forEach(file => addFile(file))
	}, { multiple: true, accept: 'image/*' })
}

async function addFile(file: File) {
	try {
		const { file: savedFile } = await api.files.create({ file })
		formData.value.photos.push(savedFile.name)
	} catch {
		notificationsStore.error('Не удалось добавить фотографию, попробуйте еще раз')
	}
}

created()
</script>

<template>
	<form
		class="creative-space-form"
		@submit.prevent="handleFormSubmit"
	>
		<ion-grid
			class="creative-space-form__grid"
		>
			<ion-row>
				<ion-col
					size="12"
					size-md="8"
				>
					<ion-input
						v-model="formData.title"
						:class="titleError && ['ion-invalid', 'ion-touched']"
						label="Название *"
						inputmode="text"
						label-placement="floating"
						:counter="true"
						:maxlength="100"
						helper-text="&nbsp;"
						:error-text="titleError"
					/>
				</ion-col>
				<ion-col
					size="12"
					size-md="4"
				>
					<ion-input
						v-model="formData.pricePerHour"
						v-mask="maskPricePerHour"
						:class="pricePerHourError && ['ion-invalid', 'ion-touched']"
						label="Стоимость аренды (₽/час) *"
						type="number"
						inputmode="numeric"
						label-placement="floating"
						:error-text="pricePerHourError"
						helper-text="&nbsp;"
						:min="0"
						:max="100000"
					/>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ui-select
						v-model="formData.address"
						class="creative-space-form__address"
						:class="addressError && ['ion-invalid', 'ion-touched']"
						:items="addresses"
						label="Адрес *"
						label-placement="floating"
						:error-text="addressError"
						search-label="Поиск адреса"
						searchable
						@update:search-value="addressSearch = $event"
						@update:options="updateFormDataCoordinates"
					/>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-textarea 
						v-model="formData.description"
						:class="descriptionError && ['ion-invalid', 'ion-touched']"
						label="Описание *"
						label-placement="floating"
						:counter="true"
						:maxlength="1000"
						auto-grow
						:error-text="descriptionError"
					/>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-button
						fill="outline"
						@click="addFiles"
					>
						<ion-icon :icon="addOutline" />
						Добавить фото
					</ion-button>
					<p>{{ photosInfoText }}</p>
					<p
						v-if="!formData.photos.length"
						class="creative-space-form__photo-required-info"
						:class="photosError ? 'creative-space-form__photo-required-info_error' : ''"
					>
						Обязательно добавьте хотя бы одну фотографию
					</p>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<div
						class="creative-space-form__photos"
					>
						<ui-image
							v-for="(photoName, i) in formData.photos"
							:key="i"
							:src="`${S3_ACCESS_DOMAIN_NAME}/${photoName}`"
							:size="screenStore.isXs ? '100%' : '180px'"
							deletable
							@delete="deletePhoto(i)"
						/>
					</div>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-button
						class="creative-space-form__submit-buttton"
						type="submit"
					>
						{{ props.isEdit ? 'Обновить площадку' : 'Создать площадку' }}
					</ion-button>
				</ion-col>
			</ion-row>
		</ion-grid>
	</form>
</template>

<style lang="scss" scoped>
.creative-space-form {
	padding: 16px;

	&__grid {
		padding: 0;
	}

	&__photos {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		gap: 12px;
	}

	&__submit-buttton {
		margin-top: 32px;
	}

	&__photo-required-info {
		&_error {
			color: red;
		}
	}
}
</style>
