<script setup lang="ts">
import type { PropType } from 'vue'
import {
	useIonRouter,
	IonCard,
	IonCardTitle,
	IonCardSubtitle,
	IonCardHeader,
	IonCardContent,
	IonButton,
} from '@ionic/vue'

import type { IUser } from '@/api';
import { ViewName } from '@/router';
import { maskPhone } from '@/utils'
import { userRoleMapping } from '@/constants'

const ionRouter = useIonRouter()

const props = defineProps({
	user: {
		type: Object as PropType<IUser>,
		required: true
	},
})

function redirectToUserDetailsPage() {
	ionRouter.replace({ name: ViewName.UsersDetailsView, params: { id: props.user.id } })
}
</script>

<template>
	<ion-card class="user-card">
		<ion-card-header>
			<ion-card-title class="user-card__title">
				Дёмин Иван Николаевич
			</ion-card-title>
			<ion-card-subtitle class="user-card__subtitle">
				{{ userRoleMapping[props.user.role] }}
			</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content class="user-card__conent">
			<p>
				<b>Телефон:</b>
				{{ maskPhone(props.user.phone) }}
			</p>
			<ion-button
				class="user-card__details-button"
				fill="outline"
				@click="redirectToUserDetailsPage"
			>
				Подробнее
			</ion-button>
		</ion-card-content>
	</ion-card>
</template>

<style lang="scss" scoped>
.user-card {
	display: flex;
	height: 220px;
	flex-direction: column;
	margin: 0;

	&__conent {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	&__subtitle,
	&__title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__details-button {
		margin-top: auto;
		margin-left: auto;
	}
}
</style>
