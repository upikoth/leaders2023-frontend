<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
	useIonRouter,
	IonApp,
	IonRouterOutlet
} from '@ionic/vue'

import { checkIsView, ViewName, UNAUTHORIZED_VIEWS } from '@/router'
import { useUserStore, useNotificationsStore } from '@/stores'
import { loadYandexMapScript } from './utils'

const route = useRoute()
const ionRouter = useIonRouter()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const isScriptLoaded = ref(false)
const isAuthorizationChecked = ref(false)

watch(() => userStore.userToken, () => {
	if (!userStore.userToken) {
		ionRouter.replace({ name: ViewName.SignInView })
	}
})

async function onCreated() {
	checkAuthorization()

	try {
		await loadYandexMapScript()
	} catch {
		notificationsStore.error('Не удалось загрузить яндекс карты')
	}

	isScriptLoaded.value = true
}

async function checkAuthorization() {
	await userStore.checkAuthorization()

	// Если авторизован и на странице не требующие авторизации, редиректим на главную страницу.
	if (checkIsView(route.name) && UNAUTHORIZED_VIEWS.has(route.name)) {
		ionRouter.replace({ name: ViewName.CreativeSpacesView })
	}

	// Если не авторизован, то переход на страницу авторизации.
	if (!userStore.userToken  && checkIsView(route.name) && !UNAUTHORIZED_VIEWS.has(route.name)) {
		ionRouter.replace({ name: ViewName.SignInView })
	}

	// Костыль, чтобы роутер успел обработать и показать нужную страницу.
	setTimeout(() => {
		isAuthorizationChecked.value = true
	}, 50)
}

onCreated()
</script>
<template>
	<ion-app>
		<ion-router-outlet
			v-if="isAuthorizationChecked && isScriptLoaded"
			animated="false"
		/>
	</ion-app>
</template>
