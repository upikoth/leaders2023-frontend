import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

import api, { UserRole } from '@/api'
import type { IUser } from '@/api'

import { useFiltersStore } from '@/stores'

import { IStoreNameEnum } from './index.types'

export const useUserStore = defineStore(IStoreNameEnum.User, () => {
	const filtersStore = useFiltersStore()

	const isAuthorizationChecked = ref(false)

	const userToken = ref(window.localStorage.getItem("userToken") || '')

	const user = ref<IUser>({
		id: '',
		phone: '',
		role: UserRole.Tenant,
		name: '',
		surname: '',
		patronymic: '',
		email: '',
		inn: '',
		legalEntityName: '',
	})

	const isAdmin = computed(() => user.value.role === UserRole.Admin)

	const isLandlord = computed(() => user.value.role === UserRole.Landlord)

	const isTenant = computed(() => user.value.role === UserRole.Tenant)

	watch(() => userToken.value, () => {
		window.localStorage.setItem("userToken", userToken.value)
	})

	async function checkAuthorization() {
		try {
			const { user: newUserValue } = await api.session.get()
			user.value = newUserValue
		} catch {
			setUnauthorized()
		} finally {
			filtersStore.clearCreativeSpacesFilters()
			isAuthorizationChecked.value = true
		}
	}

	function setToken(token: string) {
		userToken.value = token
	}

	function setUnauthorized() {
		setToken('')
	}

	return {
		user,
		userToken,
		isAuthorizationChecked,
		isAdmin,
		isLandlord,
		isTenant,
		setToken,
		checkAuthorization,
		setUnauthorized,
	}
})
