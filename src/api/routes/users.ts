import { axiosInstance } from '@/api/axios'
import type { IUser } from '@/api'

export interface IUsersGetResponseData {
	users: IUser[]
}

export interface IGetUserResponseData {
	user: IUser
}

export default {
	getAll(): Promise<IUsersGetResponseData> {
		return axiosInstance.get('/api/v1/users')
	},
	get(id: number): Promise<IGetUserResponseData> {
		return axiosInstance.get(`/api/v1/users/${id}`)
	},
	delete(id: number): Promise<void> {
		return axiosInstance.delete(`/api/v1/users/${id}`)
	},
}
