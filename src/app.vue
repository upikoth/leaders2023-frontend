<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {
	IonApp,
	IonRouterOutlet
} from '@ionic/vue'

import { checkIsView, UNAUTHORIZED_VIEWS, ViewName } from '@/router'
import { useUserStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

function created() {
	checkAuthorization()
}

async function checkAuthorization() {
	await userStore.checkAuthorization()

	// Если авторизован и на странице не требующие авторизации, редиректим на главную страницу.
	if (checkIsView(route.name) && UNAUTHORIZED_VIEWS.has(route.name)) {
		await router.push(ViewName.HomeView)
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
