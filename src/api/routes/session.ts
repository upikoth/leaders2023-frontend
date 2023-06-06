import { axiosInstance } from '@/api/axios'
import type { IUser } from '@/api'

export interface ISessionPostRequestData {
	phone: string
	password: string
}

export interface ISessionPostResponseData {
	user: {
		token: string
	}
}

export interface ISessionGetResponseData {
	user: IUser
}

export default {
	get(): Promise<ISessionGetResponseData> {
		return axiosInstance.get('/api/v1/session')
	},
	post(data: ISessionPostRequestData): Promise<ISessionPostResponseData> {
		return axiosInstance.post('/api/v1/session', data)
	}
}
