import axios from 'axios'

import { MILLISECONDS_IN_MINUTE, ApiErrorCode } from '@/constants'

import router, { ViewName } from '@/router'
import type { IResponseError } from '@/api'
import { useUserStore } from '@/stores'

const axiosInstance = axios.create({
	timeout: MILLISECONDS_IN_MINUTE,
	baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL
})

axiosInstance.interceptors.response.use(
	(res) => {
		return res.data
	},
	async (err) => {
		const res = err.response.data as IResponseError
		const userStore = useUserStore()

		if (res.error.code === ApiErrorCode.ErrUserNotAuthorized) {
			userStore.setUnauthorized()

			await router.push({ name: ViewName.SignIn })
		}

		return Promise.reject(err)
	}
)

export { axiosInstance }
