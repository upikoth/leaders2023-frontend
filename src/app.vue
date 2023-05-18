<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
	useIonRouter,
	IonApp,
	IonRouterOutlet
} from '@ionic/vue'

import { checkIsView, getMainViewName, UNAUTHORIZED_VIEWS } from '@/router'
import { useUserStore } from '@/stores'

const route = useRoute()
const ionRouter = useIonRouter()
const userStore = useUserStore()

function created() {
	checkAuthorization()
}

async function checkAuthorization() {
	await userStore.checkAuthorization()

	// Если авторизован и на странице не требующие авторизации, редиректим на главную страницу.
	if (checkIsView(route.name) && UNAUTHORIZED_VIEWS.has(route.name)) {
		ionRouter.replace({ name: getMainViewName() })
	}
	// Если не авторизован, то переход на страницу авторизации будет сделан в axios interceptor.
}

created()
</script>
<template>
	<ion-app>
		<ion-router-outlet
			v-if="userStore.isAuthorizationChecked"
			animated="false"
		/>
	</ion-app>
</template>
