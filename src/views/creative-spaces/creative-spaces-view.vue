<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import {
	modalController,
	onIonViewWillEnter,
	useIonRouter,
	IonPage,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonContent,
	IonGrid,
	IonRow,
	IonCol,
	IonButton,
	IonButtons,
	IonIcon,
} from '@ionic/vue'
import { addOutline, mapOutline, settingsOutline } from 'ionicons/icons';
import type { YMap } from '@yandex/ymaps3-types'
import { getDay } from 'date-fns'

import api, { CreativeSpaceStatusEnum } from '@/api'
import type { ICreativeSpaceListItem } from '@/api'
import { useNotificationsStore, useScreenStore, useUserStore, useFiltersStore, useCreativeSpacesStore } from '@/stores'
import { ViewName } from '@/router';

import CreativeSpaceCard from '@/components/creative-spaces/creative-space-card.vue'
import CreativeSpaceModal from '@/components/map/creative-space-modal.vue'
import CreativeSpaceFiltersModal from '@/components/creative-spaces/creative-space-filters-modal.vue'

const ionRouter = useIonRouter()

const notificationsStore = useNotificationsStore()
const screenStore = useScreenStore()
const userStore = useUserStore()
const filtersStore = useFiltersStore()
const creativeSpacesStore = useCreativeSpacesStore()

//@ts-ignore
// eslint-disable-next-line no-undef
const ymaps: typeof ymaps3 | undefined = window.ymaps3

const creativeSpaces = ref<ICreativeSpaceListItem[]>([])
let creativeSpacesMarkers = new Map()

const creativeSpaceMapRef = ref<HTMLDivElement>()
let creativeSpaceMap: YMap | null = null

const creativeSpacesFiltered = computed(() => {
	return creativeSpaces.value.filter(space => {
		if (
			filtersStore.creativeSpacesFilters.pricePerDayFrom &&
			space.pricePerDay < Number(filtersStore.creativeSpacesFilters.pricePerDayFrom)
		) {
			return false
		}

		if (
			filtersStore.creativeSpacesFilters.pricePerDayTo &&
			space.pricePerDay > Number(filtersStore.creativeSpacesFilters.pricePerDayTo)
		) {
			return false
		}

		if (
			filtersStore.creativeSpacesFilters.freeDates.length &&
			(
				// Даты из фильтра не должно быть в событиях.
				filtersStore.creativeSpacesFilters.freeDates.some(date => space.calendar.events.some(event => event.date === date)) ||
				// Даты из фильтра должны быть в рабочих днях.
				filtersStore.creativeSpacesFilters.freeDates.some(date => !space.calendar.workDayIndexes.some(dayIndex => dayIndex === getDay(new Date(date))))
			)
		) {
			return false
		}

		if (
			filtersStore.creativeSpacesFilters.landlordId &&
			space.landlordId !== filtersStore.creativeSpacesFilters.landlordId
		) {
			return false
		}

		if (
			userStore.isTenant &&
			space.status === CreativeSpaceStatusEnum.ConfirmationByAdmin
		) {
			return false
		}

		if (
			userStore.isLandlord &&
			space.landlordId !== userStore.user.id &&
			space.status === CreativeSpaceStatusEnum.ConfirmationByAdmin
		) {
			return false
		}

		if (
			filtersStore.creativeSpacesFilters.status &&
			filtersStore.creativeSpacesFilters.status !== space.status
		) {
			return false
		}

		if (
			filtersStore.creativeSpacesFilters.area &&
			space.area < filtersStore.creativeSpacesFilters.area
		) {
			return false
		}

		if (
			filtersStore.creativeSpacesFilters.capacity &&
			space.capacity < filtersStore.creativeSpacesFilters.capacity
		) {
			return false
		}

		if (
			filtersStore.creativeSpacesFilters.spaceType &&
			space.spaceType !== filtersStore.creativeSpacesFilters.spaceType
		) {
			return false
		}

		return true
	}).sort((a, b) => b.averageRating - a.averageRating)
})

onIonViewWillEnter(() => {
	updateCreativeSpaces()
})

onMounted(() => {
	initMap()
})

watch(() => creativeSpacesFiltered.value, updateCreativeSpaceMarkers)

watch(() => creativeSpacesStore.displayType, async () => {
	await nextTick()
	initMap()
})

function updateCreativeSpaceMarkers(newCreativeSpaces: ICreativeSpaceListItem[], oldCreativeSpaces: ICreativeSpaceListItem[]) {
	if (!creativeSpaceMap || !ymaps) {
		return
	}

	const newCreativeSpacesIds = new Set(newCreativeSpaces.map(space => space.id))
	const oldCreativeSpacesIds = new Set(oldCreativeSpaces.map(space => space.id))

	const creativeSpacesToAdd = newCreativeSpaces.filter(el => !oldCreativeSpacesIds.has(el.id))
	const creativeSpacesToDelete = oldCreativeSpaces.filter(el => !newCreativeSpacesIds.has(el.id))

	creativeSpacesToDelete.forEach(space => {
		const markerToDelete = creativeSpacesMarkers.get(space.id)

		creativeSpaceMap?.removeChild(markerToDelete)
	})

	creativeSpacesToAdd.forEach(space => {
		const markerToAdd = generateCreativeSpaceMarker(space)

		if (markerToAdd) {
			creativeSpaceMap?.addChild(markerToAdd)
			creativeSpacesMarkers.set(space.id, markerToAdd)
		}
	})
}

function generateCreativeSpaceMarker(space: ICreativeSpaceListItem) {
	if (!ymaps) {
		return
	}

	const creativeSpaceMarkerElement = document.createElement('map-creative-space-marker') as HTMLElement & { width: string; height: string };
	creativeSpaceMarkerElement.width = screenStore.isXs ? '25px' : '35px'
	creativeSpaceMarkerElement.height = screenStore.isXs ? '25px' : '35px'

	creativeSpaceMarkerElement.onclick = async () => {
		const modal = await modalController.create({
			component: CreativeSpaceModal,
			componentProps: {
				creativeSpace: space,
			},
		})

		modal.present()
	}

	const { latitude, longitude } = space.coordinate

	return new ymaps.YMapMarker(
		{
			coordinates: [longitude, latitude]
		},
		creativeSpaceMarkerElement
	)
}

async function updateCreativeSpaces() {
	try {
		creativeSpaces.value = (await api.creativeSpaces.getAll()).creativeSpaces
	} catch {
		notificationsStore.error('Ошибка при получении списка креативных пространств')
	}
}

function redirectToCreativeSpacesCreatePage() {
	ionRouter.replace({ name: ViewName.CreativeSpacesCreateView })
}

async function initMap() {
	if (!creativeSpaceMapRef.value || !ymaps) {
		return;
	}

	await ymaps.ready
	creativeSpaceMap = new ymaps.YMap(creativeSpaceMapRef.value, {
		location: {
			center: [37.64, 55.76],
			zoom: 11
		}
	})

	const layer = new ymaps.YMapDefaultSchemeLayer({});
	creativeSpaceMap.addChild(layer);

	const featureLayer = new ymaps.YMapDefaultFeaturesLayer({})
	creativeSpaceMap.addChild(featureLayer)

	const controls = new ymaps.YMapControls({ position: 'top left' });
	const button = new ymaps.YMapControlButton({
		text: 'Показать списком',
		onClick: creativeSpacesStore.changeDisplayType,
	});

	const filterButton = new ymaps.YMapControlButton({
		text: 'Настроить фильтры',
		onClick: handleFilterButtonClick,
	});

	controls.addChild(button);
	controls.addChild(filterButton);

	creativeSpaceMap.addChild(controls);

	if (creativeSpacesFiltered.value.length) {
		updateCreativeSpaceMarkers(creativeSpacesFiltered.value, [])
	}
}

async function handleFilterButtonClick() {
	const modal = await modalController.create({
		component: CreativeSpaceFiltersModal,
		cssClass: 'full-size-modal',
	})

	modal.present()
}
</script>

<template>
	<ion-page class="creative-spaces-view">
		<ion-header>
			<ion-toolbar>
				<ion-title>
					Креативные площадки
				</ion-title>
				<ion-buttons
					v-if="userStore.isLandlord"
					slot="end"
					class="creative-spaces-view__header-buttons"
				>
					<ion-button
						color="primary"
						fill="solid"
						@click="redirectToCreativeSpacesCreatePage"
					>
						<ion-icon :icon="addOutline" />
						<template v-if="screenStore.isSmUp">
							Создать
						</template>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content class="creative-spaces-view__content">
			<ion-grid
				v-if="creativeSpacesStore.isDisplayList"
				class="creative-spaces-view__list"
			>
				<ion-row>
					<ion-col class="creative-spaces-view__top-controls">
						<ion-button
							color="primary"
							fill="outline"
							:size="screenStore.isXs ? 'small' : 'default'"
							@click="creativeSpacesStore.changeDisplayType"
						>
							<ion-icon
								v-if="!screenStore.isXs"
								:icon="mapOutline"
							/>
							Показать на карте
						</ion-button>
						<ion-button
							color="primary"
							fill="outline"
							:size="screenStore.isXs ? 'small' : 'default'"
							@click="handleFilterButtonClick"
						>
							<ion-icon
								v-if="!screenStore.isXs"
								:icon="settingsOutline"
							/>
							Настроить фильтры
						</ion-button>
					</ion-col>
				</ion-row>
				<ion-row>
					<template
						v-if="creativeSpaces.length"
					>
						<template
							v-if="creativeSpacesFiltered.length"
						>
							<ion-col
								v-for="creativeSpace in creativeSpacesFiltered"
								:key="creativeSpace.id"
								size="12"
								size-md="6"
							>
								<creative-space-card
									:creative-space="creativeSpace"
								/>
							</ion-col>
						</template>
						<p 
							v-else
							class="creative-spaces-view__dummy"
						>
							Под выбранные фильтры не подходит ни одна площадка
						</p>
					</template>
					<p
						v-else
						class="creative-spaces-view__dummy"
					>
						Пока нет ни одной креативной площадки для сдачи в аренду
					</p>
				</ion-row>
			</ion-grid>
			<div
				v-if="creativeSpacesStore.isDisplayMap"
				ref="creativeSpaceMapRef"
				class="creative-spaces-view__map"
			/>
		</ion-content>
	</ion-page>
</template>

<style lang="scss" scoped>
.creative-spaces-view {
	&__header-buttons {
		margin-right: 20px;
	}

	&__top-controls {
		> ion-button:not(:last-child) {
			margin-right: 20px;
		}
	}

	&__content {
		ion-grid {
			--ion-grid-padding: 8px;
			--ion-grid-column-padding: 12px;
		}
	}

	&__map {
		height: 100%;
	}

	&__dummy {
		padding-left: 16px;
	}
}
</style>
