import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import api, { UserRole } from '@/api'
import type { IUser } from '@/api'

import { useFiltersStore } from '@/stores'

import { IStoreNameEnum } from './index.types'

export const useUserStore = defineStore(IStoreNameEnum.User, () => {
	const filtersStore = useFiltersStore()

  const isAuthorized = ref(false)
	const isAuthorizationChecked = ref(false)

	const user = ref<IUser>({
		id: NaN,
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

	async function checkAuthorization() {
		try {
			const { user: newUserValue } = await api.session.get()
			user.value = newUserValue
			setAuthorized()
		} catch {
			setUnauthorized()
		} finally {
			isAuthorizationChecked.value = true
		}
	}

	function setUnauthorized() {
		isAuthorized.value = false
		filtersStore.clearCreativeSpacesFilters()
	}

	function setAuthorized() {
		isAuthorized.value = true
		filtersStore.clearCreativeSpacesFilters()
	}

  return {
		user,
		isAuthorized,
		isAuthorizationChecked,
		isAdmin,
		isLandlord,
		isTenant,
		checkAuthorization,
		setAuthorized,
		setUnauthorized,
	}
})
