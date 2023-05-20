<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
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
import { addOutline } from 'ionicons/icons';
import type { YMap } from '@yandex/ymaps3-types'

import api from '@/api'
import type { ICreativeSpaceListItem } from '@/api'
import { useNotificationsStore, useScreenStore, useUserStore } from '@/stores'
import { ViewName } from '@/router';

import CreativeSpaceCard from '@/components/creative-spaces/creative-space-card.vue'

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

const creativeSpaceMapRef = ref<HTMLDivElement>()
const creativeSpaceMap = ref<YMap | null>(null)

const displayType = ref(CreativeSpaceDisplayType.Map)

onIonViewWillEnter(() => {
	updateCreativeSpaces()
})

onMounted(() => {
	initMap()
})

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
	creativeSpaceMap.value = new ymaps.YMap(creativeSpaceMapRef.value, {
		location: {
			center: [37.64, 55.76],
			zoom: 11
		}
	})

	const layer = new ymaps.YMapDefaultSchemeLayer({});
	creativeSpaceMap.value.addChild(layer);
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
