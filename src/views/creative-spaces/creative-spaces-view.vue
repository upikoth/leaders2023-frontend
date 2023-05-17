<script setup lang="ts">
import { ref } from 'vue'
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

import api from '@/api'
import type { ICreativeSpaceListItem } from '@/api'
import { useNotificationsStore, useScreenStore, useUserStore } from '@/stores'
import { ViewName } from '@/router';

import CreativeSpaceCard from '@/components/creative-spaces/creative-space-card.vue'

const ionRouter = useIonRouter()

const notificationsStore = useNotificationsStore()
const screenStore = useScreenStore()
const userStore = useUserStore()

const creativeSpaces = ref<ICreativeSpaceListItem[]>([])

onIonViewWillEnter(() => {
	updateCreativeSpaces()
})

async function updateCreativeSpaces() {
	try {
		creativeSpaces.value = (await api.creativeSpaces.getAll()).creativeSpaces
	} catch {
		notificationsStore.error('Ошибка при получении списка креативных пространств')
	}
}

function redirectToCreativeSpacesCreatePage() {
	ionRouter.push({ name: ViewName.CreativeSpacesCreateView })
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
			<ion-grid>
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
}
</style>
