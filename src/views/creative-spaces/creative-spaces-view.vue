<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
import { addOutline, mapOutline } from 'ionicons/icons';
import type { YMap } from '@yandex/ymaps3-types'

import api from '@/api'
import type { ICreativeSpaceListItem } from '@/api'
import { useNotificationsStore, useScreenStore, useUserStore } from '@/stores'
import { ViewName } from '@/router';

import CreativeSpaceCard from '@/components/creative-spaces/creative-space-card.vue'
import CreativeSpaceModal from '@/components/map/creative-space-modal.vue'

enum CreativeSpaceDisplayType {
	List = 'list',
	Map = 'map'
}

// eslint-disable-next-line no-undef
const ymaps = ymaps3

const ionRouter = useIonRouter()

const notificationsStore = useNotificationsStore()
const screenStore = useScreenStore()
const userStore = useUserStore()

const creativeSpaces = ref<ICreativeSpaceListItem[]>([])
let creativeSpacesMarkers = new Map()

const creativeSpaceMapRef = ref<HTMLDivElement>()
let creativeSpaceMap: YMap | null = null

const displayType = ref(CreativeSpaceDisplayType.List)

onIonViewWillEnter(() => {
	updateCreativeSpaces()
})

onMounted(() => {
	initMap()
})

watch(() => creativeSpaces.value, updateCreativeSpaceMarkers)

function updateCreativeSpaceMarkers(newCreativeSpaces: ICreativeSpaceListItem[], oldCreativeSpaces: ICreativeSpaceListItem[]) {
	if (!creativeSpaceMap) {
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

		creativeSpaceMap?.addChild(markerToAdd)
	})
}

function generateCreativeSpaceMarker(space: ICreativeSpaceListItem) {
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
	if (!creativeSpaceMapRef.value) {
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
		onClick: changeDisplayType,
	});

	controls.addChild(button);
	creativeSpaceMap.addChild(controls);

	if (creativeSpaces.value.length) {
		updateCreativeSpaceMarkers(creativeSpaces.value, [])
	}
}

function changeDisplayType() {
	switch (displayType.value) {
		case CreativeSpaceDisplayType.List:
			displayType.value = CreativeSpaceDisplayType.Map
			break;
		case CreativeSpaceDisplayType.Map:
			displayType.value = CreativeSpaceDisplayType.List
			break;
		default:
			displayType.value = CreativeSpaceDisplayType.List
	}
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
					v-if="userStore.isLandlord || userStore.isAdmin"
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
				v-show="displayType === CreativeSpaceDisplayType.List"
				class="creative-spaces-view__list"
			>
				<ion-row>
					<ion-col>
						<ion-button
							color="primary"
							fill="outline"
							:size="screenStore.isXs ? 'small' : 'default'"
							@click="changeDisplayType"
						>
							<ion-icon
								:icon="mapOutline"
							/>
							Показать на карте
						</ion-button>
					</ion-col>
				</ion-row>
				<ion-row>
					<ion-col
						v-for="creativeSpace in creativeSpaces"
						:key="creativeSpace.id"
						size="12"
						size-md="6"
					>
						<creative-space-card
							:creative-space="creativeSpace"
						/>
					</ion-col>
				</ion-row>
			</ion-grid>
			<div
				v-show="displayType === CreativeSpaceDisplayType.Map"
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

	&__content {
		ion-grid {
			--ion-grid-padding: 8px;
			--ion-grid-column-padding: 12px;
		}
	}

	&__map {
		height: 100%;
	}
}
</style>
