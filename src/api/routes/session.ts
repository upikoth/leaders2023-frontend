import { axiosInstance } from '@/api/axios'

export interface ISessionPostRequestData {
	email: string
	password: string
}

export default {
	get(): Promise<void> {
		return axiosInstance.get('/api/v1/session')
	},
	post(data: ISessionPostRequestData): Promise<void> {
		return axiosInstance.post('/api/v1/session', data)
	},
	delete(): Promise<void> {
		return axiosInstance.delete('/api/v1/session')
	},
}
