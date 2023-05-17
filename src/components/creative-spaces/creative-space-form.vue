<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router';
import debounce from 'lodash.debounce';
import {
	IonInput,
	IonButton,
	IonTextarea,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/vue'
import { addOutline } from 'ionicons/icons';

import { getFilesFromComputer, getBase64FromFile, declOfNum } from '@/utils'
import api from '@/api'
import { useScreenStore, useNotificationsStore } from '@/stores'
import { ViewName } from '@/router';

import UiSelect from '@/components/ui/ui-select.vue'
import UiImage from '@/components/ui/ui-image.vue'

const screenStore = useScreenStore()
const notificationsStore = useNotificationsStore()

const router = useRouter()

const MAX_PHOTOS_COUNT = 10

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

const addresses = ref<InstanceType<typeof UiSelect>['$props']['items']>([])
const addressSearch = ref(formData.value.address || 'Москва')

const debouncedUpdateAddresses = debounce(updateAddresses, 300);

const photosInfoText = computed(() => {
	const photosLeftCount = MAX_PHOTOS_COUNT - formData.value.photos.length
	return `Можно добавить еще ${photosLeftCount} ${declOfNum(photosLeftCount, ['фотографию', 'фотографии', 'фотографий'])}`
})

watch(() => addressSearch.value, () => {
	debouncedUpdateAddresses()
})

function created() {
	updateAddresses()
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

function deletePhoto(index: number) {
	formData.value.photos.splice(index, 1)
}

function handleFormSubmit() {
	createCreativeSpace()
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

		router.push({ name: ViewName.CreativeSpacesView })
	} catch {
		notificationsStore.error('Не удалось создать креативную площадку')
	}
}

function addFiles() {
	getFilesFromComputer(async (files) => {
		Array.from(files).forEach(async (file) => {
			const fileInBase64 = await getBase64FromFile(file)
			formData.value.photos.push(fileInBase64)
		})
	}, { multiple: true, accept: 'image/*' })
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
					class="creative-space-form__col"
				>
					<ion-input
						v-model="formData.title"
						label="Название *"
						inputmode="text"
						label-placement="floating"
						:counter="true"
						:maxlength="100"
						helper-text="&nbsp;"
					/>
				</ion-col>
				<ion-col
					size="12"
					size-md="4"
					class="creative-space-form__col"
				>
					<ion-input
						v-model="formData.pricePerHour"
						label="Стоимость аренды (₽/час) *"
						type="number"
						inputmode="numeric"
						label-placement="floating"
						error-text=" "
						helper-text="&nbsp;"
						:min="0"
					/>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ui-select
						v-model="formData.address"
						class="creative-space-form__address"
						:items="addresses"
						label="Адрес *"
						label-placement="floating"
						error-text=" "
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
						label="Описание *"
						label-placement="floating"
						:counter="true"
						:maxlength="1000"
						auto-grow
						error-text=" "
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
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<div
						class="creative-space-form__photos"
					>
						<ui-image
							v-for="(photo, i) in formData.photos"
							:key="i"
							:src="photo"
							:size="screenStore.isXs ? '260px' : '180px'"
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
						Создать площадку
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
}
</style>
