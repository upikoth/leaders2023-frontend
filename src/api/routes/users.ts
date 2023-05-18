import { axiosInstance } from '@/api/axios'
import type { IUser } from '@/api'

export interface IUsersGetResponseData {
	users: IUser[]
}

export default {
	getAll(): Promise<IUsersGetResponseData> {
		return axiosInstance.get('/api/v1/users')
	},
}
