<script setup lang="ts">
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButtons,
	IonBackButton
} from '@ionic/vue'
import { chevronBackOutline } from 'ionicons/icons';

import CreativeSpaceForm from '@/components/creative-spaces/creative-space-form.vue'
</script>

<template>
	<ion-page class="creative-spaces-create-view">
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
					Создание площадки
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="creative-spaces-create-view__content">
			<creative-space-form />
		</ion-content>
	</ion-page>
</template>
