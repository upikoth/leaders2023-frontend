<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
	useIonRouter,
	IonApp,
	IonRouterOutlet
} from '@ionic/vue'

import { checkIsView, getMainViewName, UNAUTHORIZED_VIEWS } from '@/router'
import { useUserStore, useNotificationsStore } from '@/stores'
import { loadScript } from './utils'
import environments from './environments';

const route = useRoute()
const ionRouter = useIonRouter()
const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const isScriptLoaded = ref(false)

async function onCreated() {
	checkAuthorization()

	try {
		await loadScript(`https://api-maps.yandex.ru/3.0/?apikey=${environments.YANDEX_API_KEY}&lang=ru_RU`)
	} catch {
		notificationsStore.error('Не удалось загрузить яндекс карты')
	}

	isScriptLoaded.value = true
}

async function checkAuthorization() {
	await userStore.checkAuthorization()

	// Если авторизован и на странице не требующие авторизации, редиректим на главную страницу.
	if (checkIsView(route.name) && UNAUTHORIZED_VIEWS.has(route.name)) {
		ionRouter.replace({ name: getMainViewName() })
	}
	// Если не авторизован, то переход на страницу авторизации будет сделан в axios interceptor.
}

onCreated()
</script>
<template>
	<ion-app>
		<ion-router-outlet
			v-if="userStore.isAuthorizationChecked && isScriptLoaded"
			animated="false"
		/>
	</ion-app>
</template>
