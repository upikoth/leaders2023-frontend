<script setup lang="ts">
import { computed } from 'vue'
import {
	useIonRouter,
	IonPage,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonButton,
	IonButtons,
	IonIcon,
	IonContent,
	IonBackButton,
} from '@ionic/vue'
import { useRoute } from 'vue-router'
import { createOutline, chevronBackOutline } from 'ionicons/icons';

import { useScreenStore } from '@/stores'
import { ViewName } from '@/router';

import CreativeSpaceDetails from '@/components/creative-spaces/creative-space-details.vue'

const ionRouter = useIonRouter()

const route = useRoute()
const screenStore = useScreenStore()

const creativeSpaceId = computed(() => {
	return Number(route.params.id)
})

function redirectToCreativeSpacesEditPage() {
	ionRouter.push({ name: ViewName.CreativeSpacesEditView })
}
</script>

<template>
	<ion-page class="creative-spaces-details-view">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button
						text=""
						color="primary"
						:icon="chevronBackOutline"
					/>
				</ion-buttons>
				<ion-title>
					Креативная площадка
				</ion-title>
				<ion-buttons
					slot="end"
					class="creative-spaces-details-view__header-buttons"
				>
					<ion-button
						color="primary"
						fill="outline"
						@click="redirectToCreativeSpacesEditPage"
					>
						<ion-icon
							:icon="createOutline"
						/>
						<template v-if="screenStore.isSmUp">
							Редактировать
						</template>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content class="creative-spaces-details-view__content">
			<creative-space-details :id="creativeSpaceId" />
		</ion-content>
	</ion-page>
</template>

<style lang="scss" scoped>
.creative-spaces-details-view {
	&__header-buttons {
		margin-right: 20px;
	}
}
</style>
