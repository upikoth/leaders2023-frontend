<script setup lang="ts">
import { computed } from 'vue'
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
import { useRoute } from 'vue-router'
import { chevronBackOutline } from 'ionicons/icons';

import { ViewName } from '@/router';

import CreativeSpaceForm from '@/components/creative-spaces/creative-space-form.vue'

const route = useRoute()
const ionRouter = useIonRouter()

const creativeSpaceId = computed(() => {
	return Number(route.params.id)
})

function redirectToCreativeSpacesDetailsPage() {
	ionRouter.replace({ name: ViewName.CreativeSpacesDetailsView })
}
</script>

<template>
	<ion-page class="creative-spaces-edit-view">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button
						slot="icon-only"
						color="primary"
						shape="round"
						@click="redirectToCreativeSpacesDetailsPage"
					>
						<ion-icon :icon="chevronBackOutline" />
					</ion-button>
				</ion-buttons>
				<ion-title>
					Редактирование площадки
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<creative-space-form
				:id="creativeSpaceId"
				is-edit
			/>
		</ion-content>
	</ion-page>
</template>
