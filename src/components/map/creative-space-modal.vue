<script setup lang="ts">
import type { PropType } from 'vue'
import {
	modalController,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonContent,
} from '@ionic/vue'

import type { ICreativeSpaceListItem } from '@/api';

import CreativeSpaceCard from '@/components/creative-spaces/creative-space-card.vue'

const props = defineProps({
	creativeSpace: {
		type: Object as PropType<ICreativeSpaceListItem>,
		required: true
	},
})

function closeModal() {
	modalController.dismiss()
}
</script>

<template>
	<div class="creative-space-modal">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="end">
					<ion-button @click="closeModal">
						Закрыть
					</ion-button>
				</ion-buttons>
				<ion-title>Креативная площадка</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<creative-space-card
				class="creative-space-modal__card"
				:creative-space="props.creativeSpace"
				@before-redirect-to-details-page="closeModal"
			/>
		</ion-content>
	</div>
</template>

<style lang="scss" scoped>
.creative-space-modal {
	display: flex;
	height: 100%;
	flex-direction: column;

	&__card {
		height: 100%;
	}
}
</style>
