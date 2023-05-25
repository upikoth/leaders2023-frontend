<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PropType } from 'vue'
import {
	useIonRouter,
	IonItem,
	IonLabel,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/vue'

import api from '@/api'
import type { IUser } from '@/api'
import { useNotificationsStore } from '@/stores'
import { ViewName } from '@/router';
import { userRoleMapping } from '@/constants'

const notificationsStore = useNotificationsStore()

const ionRouter = useIonRouter()

const props = defineProps({
	id: {
		type: Number as PropType<number>,
		required: true
	},
})

const user = ref<IUser | null>(null)

watch(() => props.id, updateUserData)

function onCreated() {
	updateUserData()
}

async function updateUserData() {
	if (!props.id) {
		return
	}

	try {
		const { user: newUser } = await api.users.get(props.id)
		user.value = newUser
	} catch {
		notificationsStore.error('Не удалось получить информацию о пользователе')
		ionRouter.replace({ name: ViewName.UsersView })
	}
}

onCreated()
</script>

<template>
	<ion-grid
		v-if="user"
		class="user-details__grid"
	>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						ФИО:
						<p>Дёмин Иван Николаевич</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						Роль:
						<p>{{ userRoleMapping[user.role] }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						Телефон:
						<p>
							{{ user.phone }}
						</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
	</ion-grid>
</template>

<style lang="scss" scoped>
.user-details {
	padding: 16px;

	&__grid {
		padding: 0;
	}
}
</style>
