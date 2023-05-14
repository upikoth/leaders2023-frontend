import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import api, { UserRole } from '@/api'
import type { IUser } from '@/api'

import { IStoreNameEnum } from './index.types'

export const useUserStore = defineStore(IStoreNameEnum.User, () => {
  const isAuthorized = ref(false)
	const isAuthorizationChecked = ref(false)

	const user = ref<IUser>({
		id: NaN,
		phone: '',
		role: UserRole.Tenant
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
	}

	function setAuthorized() {
		isAuthorized.value = true
	}

  return {
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
