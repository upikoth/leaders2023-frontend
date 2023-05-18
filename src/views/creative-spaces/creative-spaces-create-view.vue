<script setup lang="ts">
import {
	useIonRouter,
	IonPage,
	IonButton,
	IonIcon,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButtons,
} from '@ionic/vue'
import { chevronBackOutline } from 'ionicons/icons';

import { ViewName } from '@/router';

import CreativeSpaceForm from '@/components/creative-spaces/creative-space-form.vue'

const ionRouter = useIonRouter()

function redirectToCreativeSpacesPage() {
	ionRouter.replace({ name: ViewName.CreativeSpacesView })
}
</script>

<template>
	<ion-page class="creative-spaces-create-view">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button
						slot="icon-only"
						color="primary"
						shape="round"
						@click="redirectToCreativeSpacesPage"
					>
						<ion-icon :icon="chevronBackOutline" />
					</ion-button>
				</ion-buttons>
				<ion-title>
					Создание площадки
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="creative-spaces-create-view__content">
			<creative-space-form />
		</ion-content>
	</ion-page>
</template>
