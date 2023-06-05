import axios from 'axios'

import { MILLISECONDS_IN_MINUTE, ApiErrorCode } from '@/constants'

import type { IResponse, IResponseError } from '@/api'
import { useUserStore } from '@/stores'

import environments from '@/environments'

const axiosInstance = axios.create({
	timeout: MILLISECONDS_IN_MINUTE,
	baseURL: import.meta.env.DEV ? '' : environments.VITE_API_URL
})

axiosInstance.interceptors.response.use(
	(res) => {
		const responseData = res.data as IResponse

		if (!responseData.success) {
			return Promise.reject(responseData.error)
		}

		return responseData.data
	},
	async (err) => {
		const responseData = err.response.data as IResponseError
		const userStore = useUserStore()

		if (responseData.error.code === ApiErrorCode.ErrUserNotAuthorized) {
			userStore.setUnauthorized()
		}

		return Promise.reject(responseData.error)
	}
)

export { axiosInstance }
