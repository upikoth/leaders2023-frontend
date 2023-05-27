<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import {
	useIonRouter,
	IonCard,
	IonCardTitle,
	IonCardSubtitle,
	IonCardHeader,
	IonCardContent,
	IonButton,
	IonBadge,
} from '@ionic/vue'

import { UserRole, type IUser } from '@/api';
import { ViewName } from '@/router';
import { maskPhone } from '@/utils'
import { userRoleMapping, userRoleColorMapping } from '@/constants'

const ionRouter = useIonRouter()

const props = defineProps({
	user: {
		type: Object as PropType<IUser>,
		required: true
	},
})

const fio = computed(() => {
	return `${props.user.surname} ${props.user.name} ${props.user.patronymic}`
})

function redirectToUserDetailsPage() {
	ionRouter.replace({ name: ViewName.UsersDetailsView, params: { userId: props.user.id } })
}
</script>

<template>
	<ion-card class="user-card">
		<ion-card-header>
			<ion-card-title class="user-card__title">
				{{ fio }}
			</ion-card-title>
			<ion-card-subtitle class="user-card__subtitle">
				<ion-badge :color="userRoleColorMapping[props.user.role]">
					{{ userRoleMapping[props.user.role] }}
				</ion-badge>
			</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content class="user-card__conent">
			<p>
				<b>Телефон:</b>
				{{ maskPhone(props.user.phone) }}
			</p>
			<p>
				<b>Email:</b>
				{{ props.user.email }}
			</p>
			<template
				v-if="props.user.role === UserRole.Landlord"
			>
				<p>
					<b>Юр. лицо:</b>
					{{ props.user.legalEntityName }}
				</p>
				<p>
					<b>Инн:</b>
					{{ props.user.inn }}
				</p>
			</template>
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
