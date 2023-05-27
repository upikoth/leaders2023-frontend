<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { PropType } from 'vue'
import debounce from 'lodash.debounce';
import { useVuelidate } from '@vuelidate/core';
import { isBefore, getDay, isEqual as isDateEqual, format } from 'date-fns'
import {
	modalController,
	actionSheetController,
	useIonRouter,
	IonInput,
	IonButton,
	IonTextarea,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/vue'
import type { DatetimeCustomEvent } from '@ionic/vue'
import { addOutline } from 'ionicons/icons';
import { required, minLength, helpers } from '@vuelidate/validators';
import cloneDeep from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'

import { getFilesFromComputer, declOfNum, maskpricePerDay } from '@/utils'
import api from '@/api'
import type { ICalendarEventFull } from '@/api'
import { useScreenStore, useNotificationsStore, useUserStore } from '@/stores'
import { ViewName } from '@/router'
import { vMask } from '@/directives'
import environments from '@/environments'

import UiSelect from '@/components/ui/ui-select.vue'
import UiImage from '@/components/ui/ui-image.vue'
import UiCalendarWorkDays from '@/components/ui/ui-calendar-work-days.vue'
import UiCalendar from '@/components/ui/ui-calendar.vue'

import CreativeSpaceAddLinkModal from './creative-space-add-link-modal.vue'

const screenStore = useScreenStore()
const notificationsStore = useNotificationsStore()
const userStore = useUserStore()

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
	pricePerDay: '',
	metroStations: [],
	coordinate: {
		latitude: '',
		longitude: '',
	},
	calendar: {
		workDayIndexes: [] as number[],
		events: [] as ICalendarEventFull[],
		link: '',
	}
})

let initialFormData = cloneDeep(formData.value)

const rules = {
	formData: {
		title: {
			required: helpers.withMessage('Введите название', required),
		},
		pricePerDay: {
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
		calendar: {
			workDayIndexes: {
				required: helpers.withMessage('Укажите рабочий день', required),
				minLength: helpers.withMessage('Укажите рабочий день', minLength(1))
			}
		}
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

const pricePerDayError = computed((): string => {
	if (!v$.value.formData.pricePerDay.$error) {
		return '';
	}

	const message = v$.value.formData.pricePerDay.$errors[0].$message;

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

const workDayIndexesError = computed((): string => {
	if (!v$.value.formData.calendar.workDayIndexes.$error) {
		return '';
	}

	const message = v$.value.formData.calendar.workDayIndexes.$errors[0].$message;

	return typeof message === 'string' ? message : '';
});

watch(() => addressSearch.value, () => {
	debouncedUpdateAddresses()
})

watch(() => props.id, updateFormData)

watch(() => formData.value.calendar, forceUpdateCalendar, { deep: true })

async function onCreated() {
	if (!userStore.isLandlord && !userStore.isAdmin) {
		ionRouter.replace({ name: ViewName.CreativeSpacesView })
		return;
	}

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
		const { title, description, address, photos, pricePerDay, coordinate, calendar, landlordId } = creativeSpace

		addressSearch.value = address

		formData.value = {
			...formData.value,
			title,
			description,
			address,
			photos,
			pricePerDay: String(pricePerDay),
			coordinate: {
				latitude: String(coordinate.latitude),
				longitude: String(coordinate.longitude),
			},
			calendar: {
				workDayIndexes: calendar.workDayIndexes,
				events: calendar.events,
				link: calendar.link || ''
			}
		}

		initialFormData = cloneDeep(formData.value)

		if (landlordId !== userStore.user.id && !userStore.isAdmin) {
			ionRouter.replace({ name: ViewName.CreativeSpacesView })
		}
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
		const { title, address, description, pricePerDay, photos, coordinate, metroStations, calendar } = formData.value

		await api.creativeSpaces.update(props.id, {
			title: isEqual(initialFormData.title, title) ? undefined : title,
			address: isEqual(initialFormData.address, address) ? undefined : address,
			description: isEqual(initialFormData.description, description) ? undefined : description,
			photos: isEqual(initialFormData.photos, photos) ? undefined : photos,
			metroStations: isEqual(initialFormData.metroStations, metroStations) ? undefined : metroStations,
			coordinate: isEqual(initialFormData.coordinate, coordinate) ? undefined : {
				latitude: Number.parseFloat(coordinate.latitude),
				longitude: Number.parseFloat(coordinate.longitude)
			},
			calendar: {
				workDayIndexes: isEqual(initialFormData.calendar.workDayIndexes, calendar.workDayIndexes) ? undefined : calendar.workDayIndexes,
				events: isEqual(initialFormData.calendar.events, calendar.events) ? undefined : calendar.events,
				link: isEqual(initialFormData.calendar.link, calendar.link) ? undefined : calendar.link || undefined,
			},
			pricePerDay: isEqual(initialFormData.pricePerDay, pricePerDay) ? undefined : Number.parseInt(pricePerDay),
		})

		notificationsStore.success('Креативная площадка успешно обновлена')
		ionRouter.replace({ name: ViewName.CreativeSpacesView })
	} catch {
		notificationsStore.error('Не удалось обновить креативную площадку')
	}
}

async function createCreativeSpace() {
	try {
		const { title, address, description, pricePerDay, photos, coordinate, metroStations, calendar } = formData.value

		await api.creativeSpaces.create({
			title,
			address,
			description,
			photos,
			metroStations,
			coordinate: {
				latitude: Number.parseFloat(coordinate.latitude),
				longitude: Number.parseFloat(coordinate.longitude)
			},
			pricePerDay: Number.parseInt(pricePerDay),
			calendar: {
				workDayIndexes: calendar.workDayIndexes,
				events: calendar.events,
				link: calendar.link || undefined,
			}
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

async function addCalendarLink() {
	try {
		const modal = await modalController.create({
			component: CreativeSpaceAddLinkModal,
			componentProps: {
				isEdit: props.isEdit,
				link: formData.value.calendar.link
			}
		})

		modal.present()

		const { data } = await modal.onWillDismiss();

		if (!data.link) {
			return
		}

		const { events } = await api.calendars.convertCalendarLinkToEvents(data.link)
		const uniqEvents = events.filter(event => !formData.value.calendar.events.some(existEvent => {
			return isDateEqual(new Date(event.date), new Date(existEvent.date))
		})).map(el => ({ ...el, bookingId: 0 }))

		formData.value.calendar.link = data.link
		formData.value.calendar.events.push(...uniqEvents)
		forceUpdateCalendar()
		notificationsStore.success('События успешно загружены в календарь площадки')
	} catch {
		notificationsStore.error('Не удалось прикрепить ссылку, попробуйте еще раз')
	}
}

async function addCalendarFile() {
	getFilesFromComputer(async (files) => {
		const calendar = files[0]

		if (calendar.type !== 'text/calendar') {
			notificationsStore.error('Некорректный формат файла')
			return
		}

		try {
			const { events } = await api.calendars.convertCalendarToEvents({ calendar })
			const uniqEvents = events.filter(event => !formData.value.calendar.events.some(existEvent => {
				return isDateEqual(new Date(event.date), new Date(existEvent.date))
			})).map(el => ({ ...el, bookingId: 0 }))

			formData.value.calendar.events.push(...uniqEvents)
			forceUpdateCalendar()
			notificationsStore.success('События успешно загружены в календарь площадки')
		} catch {
			notificationsStore.error('Не удалось загрузить календарь, попробуйте еще раз')
		}
	}, { multiple: false, accept: 'text/calendar' })
}

function checkHighlightedDates(date: string) {
	// Все не рабочие дни.
	if(!formData.value.calendar.workDayIndexes.includes(getDay(new Date(date)))){
		return {
			textColor: '#800080',
			backgroundColor: '#ffe5e9',
		}
	}

	// Все предыдущие дни.
	if (isBefore(new Date(date), new Date())) {
		return {
			textColor: '#800080',
			backgroundColor: '#ffe5e9',
		}
	}

	// День уже забронирован.
	if(formData.value.calendar.events.some(event => isDateEqual(new Date(event.date), new Date(date)))) {
		return {
			textColor: '#800080',
			backgroundColor: '#ffe5e9',
		}
	}

	return undefined
}

function checkIsCalendarDateEnabled(date: string) {
	// Все предыдущие дни.
	if (isBefore(new Date(date), new Date())) {
		return false
	}

	// Все не рабочие дни.
	if(!formData.value.calendar.workDayIndexes.includes(getDay(new Date(date)))){
		return false
	}

	// Все дни, на которые есть бронь.
	if(Number(formData.value.calendar.events.find(event => event.date === date)?.bookingId) > 0){
		return false
	}

	return true
}

const calendarForceUpdateKey = ref(0)
function forceUpdateCalendar() {
	calendarForceUpdateKey.value += 1
}

async function onCalendarChange(event: DatetimeCustomEvent) {
	const formattedDate = format(new Date(event.detail.value as string), "yyyy-MM-dd")
	const isDayExist = formData.value.calendar.events.some(event => event.date === formattedDate)

	enum ControllerAction {
		Confirm = 'confirm',
		Cancel = 'cancel'
	}

	const actionSheet = await actionSheetController.create({
		header: isDayExist ? 'Открыть бронь на выбранный день?' : 'Закрыть бронь на выбранный день?',
		buttons: [
			{
				text: isDayExist ? 'Да, открыть' : 'Да, закрыть',
				role: isDayExist ? 'destructive' : undefined,
				data: {
					action: ControllerAction.Confirm,
				},
			},
			{
				text: 'Отменить',
				role: 'cancel',
				data: {
					action: ControllerAction.Cancel,
				},
			},
		],
		animated: screenStore.isXs,
	});

	await actionSheet.present();

	const result = await actionSheet.onDidDismiss();

	if (result.data.action !== ControllerAction.Confirm) {
		return
	}

	if (isDayExist) {
		formData.value.calendar.events = formData.value.calendar.events.filter(event => event.date !== formattedDate)
	} else {
		formData.value.calendar.events = [...formData.value.calendar.events, { date: formattedDate, bookingId: 0 }]
	}
}

onCreated()
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
				<ion-col>
					<h3>Основная информация</h3>
				</ion-col>
			</ion-row>
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
						v-model="formData.pricePerDay"
						v-mask="maskpricePerDay"
						:class="pricePerDayError && ['ion-invalid', 'ion-touched']"
						label="Стоимость аренды (₽/день) *"
						type="number"
						inputmode="numeric"
						label-placement="floating"
						:error-text="pricePerDayError"
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
					<h3>График работы</h3>
					<p>
						Выберите доступные для аренды дни недели
					</p>
					<p
						:class="workDayIndexesError ? 'creative-space-form__work-day-indexes-required-info_error' : ''"
					>
						Для создания площадки должен быть выбран минимум 1 день
					</p>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col
					size="12"
					size-sm="6"
				>
					<ui-calendar-work-days v-model:work-day-indexes="formData.calendar.workDayIndexes" />
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<h3>Календарь аренды площадки</h3>
					<p>Импортировать события из другого календаря</p>
					<p>Загрузите файл в формате .ics или прикрепите ссылку iCal</p>
					<ion-button
						class="creative-space-form__add-calendar-file-button"
						fill="outline"
						@click="addCalendarFile"
					>
						Загрузить файл
					</ion-button>
					<ion-button
						fill="outline"
						@click="addCalendarLink"
					>
						{{ props.isEdit && formData.calendar.link ? 'Обновить ссылку' : 'Прикрепить ссылку' }}
					</ion-button>
					<p>
						В календаре ниже отображены доступные дни для аренды
					</p>
					<ui-calendar
						:key="calendarForceUpdateKey"
						:is-date-enabled="checkIsCalendarDateEnabled"
						:highlighted-dates="checkHighlightedDates"
						@ion-change="onCalendarChange"
					/>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<h3>Фотографии</h3>
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
							:src="`${environments.S3_ACCESS_DOMAIN_NAME}/${photoName}`"
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

	&__add-calendar-file-button {
		margin-right: 16px;
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

	&__work-day-indexes-required-info,
	&__photo-required-info {
		&_error {
			color: red;
		}
	}
}
</style>
