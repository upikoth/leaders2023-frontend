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

import UiCarousel from '@/components/ui/ui-carousel.vue'

const props = defineProps({
	images: {
		type: Array as PropType<string[]>,
		default: () => []
	},
	objectFit: {
		type: String as PropType<string>,
		default: 'cover',
	}
})

function closeModal() {
	modalController.dismiss()
}
</script>

<template>
	<ion-header>
		<ion-toolbar>
			<ion-title>
				Фотографии площадки
			</ion-title>
			<ion-buttons slot="end">
				<ion-button
					@click="closeModal"
				>
					Закрыть
				</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>
	<ion-content>
		<ui-carousel
			:images="props.images"
			:object-fit="props.objectFit"
		/>
	</ion-content>
</template>
