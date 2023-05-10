import { axiosInstance } from '@/api/axios'


export default {
	get(): Promise<void> {
		return axiosInstance.get('/api/v1/health')
	},
}
