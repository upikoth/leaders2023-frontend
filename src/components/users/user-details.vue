<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import {
	useIonRouter,
	IonItem,
	IonLabel,
	IonGrid,
	IonRow,
	IonCol,
	IonBadge,
} from '@ionic/vue'

import api, { UserRole, DataLoadingStateEnum } from '@/api'
import type { IUser } from '@/api'
import { useNotificationsStore } from '@/stores'
import { ViewName } from '@/router';
import { userRoleMapping, userRoleColorMapping } from '@/constants'

const notificationsStore = useNotificationsStore()

const ionRouter = useIonRouter()

const props = defineProps({
	id: {
		type: String as PropType<string>,
		required: true
	},
	userLoadingState: {
		type: String as PropType<DataLoadingStateEnum>,
		default: DataLoadingStateEnum.DidNotLoad
	}
})

const emit = defineEmits({
	'update:user-loading-state': (value: string) => typeof value === 'string'
});

const user = ref<IUser | null>(null)
const userLoadingState = ref(DataLoadingStateEnum.DidNotLoad)

const fio = computed(() => {
	if (!user.value) {
		return ''
	}

	return `${user.value.surname} ${user.value.name} ${user.value.patronymic}`
})

watch(() => props.id, updateUserData)

function onCreated() {
	updateUserData()
}

async function updateUserData() {
	if (!props.id) {
		return
	}

	try {
		userLoadingState.value = DataLoadingStateEnum.Loading
		const { user: newUser } = await api.users.get(props.id)
		user.value = newUser
		userLoadingState.value = DataLoadingStateEnum.LoadedSuccess
	} catch {
		userLoadingState.value = DataLoadingStateEnum.LoadedError
		notificationsStore.error('Не удалось получить информацию о пользователе')
		ionRouter.replace({ name: ViewName.UsersView })
	} finally {
		emit('update:user-loading-state', userLoadingState.value)
	}
}

onCreated()
</script>

<template>
	<ion-grid
		v-if="userLoadingState === DataLoadingStateEnum.LoadedSuccess && user"
		class="user-details__grid"
	>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						ФИО:
						<p>{{ fio }}</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label
						class="user-details__role"
					>
						Роль:
						<ion-badge 
							class="user-details__role-badge"
							:color="userRoleColorMapping[user.role]"
						>
							{{ userRoleMapping[user.role] }}
						</ion-badge>
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
		<ion-row>
			<ion-col>
				<ion-item>
					<ion-label>
						Email:
						<p>
							{{ user.email }}
						</p>
					</ion-label>
				</ion-item>
			</ion-col>
		</ion-row>
		<template
			v-if="user.role === UserRole.Landlord"
		>
			<ion-row>
				<ion-col>
					<ion-item>
						<ion-label>
							Юр. лицо:
							<p>
								{{ user.legalEntityName }}
							</p>
						</ion-label>
					</ion-item>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col>
					<ion-item>
						<ion-label>
							ИНН:
							<p>
								{{ user.inn }}
							</p>
						</ion-label>
					</ion-item>
				</ion-col>
			</ion-row>
		</template>
	</ion-grid>
</template>

<style lang="scss" scoped>
.user-details {
	padding: 16px;

	&__grid {
		padding: 0;
	}

	&__role {
		display: flex;
		align-items: center;
	}

	&__role-badge {
		margin-left: 16px;
	}
}
</style>
