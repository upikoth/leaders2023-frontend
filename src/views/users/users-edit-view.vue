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

import UserForm from '@/components/users/user-form.vue'

const route = useRoute()
const ionRouter = useIonRouter()

const userId = computed(() => {
	return route.params.userId ? String(route.params.userId) : ''
})

function redirectToUserDetailPage() {
	ionRouter.replace({ name: ViewName.UsersDetailsView })
}
</script>

<template>
	<ion-page class="users-edit-view">
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button
						slot="icon-only"
						color="primary"
						shape="round"
						@click="redirectToUserDetailPage"
					>
						<ion-icon :icon="chevronBackOutline" />
					</ion-button>
				</ion-buttons>
				<ion-title>
					Редактирование пользователя
				</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<user-form
				:id="userId"
				is-edit
			/>
		</ion-content>
	</ion-page>
</template>
