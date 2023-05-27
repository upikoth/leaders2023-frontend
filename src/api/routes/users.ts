import { axiosInstance } from '@/api/axios'
import type { IUser } from '@/api'

export interface IUsersGetResponseData {
	users: IUser[]
}

export interface IGetUserResponseData {
	user: IUser
}

export interface IUserUpdateRequestData {
	phone?: string
	name?: string
	surname?: string
	patronymic?: string
	email?: string
	inn?: string
	legalEntityName?: string
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
	update(id: number, data: IUserUpdateRequestData) {
		return axiosInstance.patch(`/api/v1/users/${id}`, data)
	}
}
