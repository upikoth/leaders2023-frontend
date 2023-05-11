<script setup lang="ts">
import { ref } from 'vue'
import {
	IonPage,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonContent,
	IonGrid,
	IonRow,
	IonCol
} from '@ionic/vue'

import api from '@/api'
import type { ICreativeSpaceListItem } from '@/api'
import { useNotificationsStore } from '@/stores'

import CreativeSpaceCard from '@/components/creative-space-card.vue'

const notificationsStore = useNotificationsStore()

const creativeSpaces = ref<ICreativeSpaceListItem[]>([])

function created() {
	updateCreativeSpaces()
}

async function updateCreativeSpaces() {
	try {
		creativeSpaces.value = (await api.creativeSpaces.getAll()).creativeSpaces
	} catch {
		notificationsStore.error('Ошибка при получении списка креативных пространств')
	}
}

created()
</script>

<template>
	<ion-page class="creative-spaces-view">
		<ion-header>
			<ion-toolbar>
				<ion-title>
					Креативные площадки
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
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
