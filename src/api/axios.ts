import axios from 'axios'

import { MILLISECONDS_IN_MINUTE, ApiErrorCode } from '@/constants'

import router, { ViewName } from '@/router'
import type { IResponse, IResponseError } from '@/api'
import { useUserStore } from '@/stores'

const axiosInstance = axios.create({
	timeout: MILLISECONDS_IN_MINUTE,
	baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL
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

			await router.push({ name: ViewName.SignInView })
		}

		return Promise.reject(responseData.error)
	}
)

export { axiosInstance }
