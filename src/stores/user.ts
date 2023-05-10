import { ref } from 'vue'
import { defineStore } from 'pinia'

import api from '@/api'

import { IStoreNameEnum } from './index.types'

export const useUserStore = defineStore(IStoreNameEnum.User, () => {
  const isAuthorized = ref(false)
	const isAuthorizationChecked = ref(false)

	async function checkAuthorization() {
		try {
			await api.session.get()
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
		checkAuthorization,
		setAuthorized,
		setUnauthorized,
	}
})
