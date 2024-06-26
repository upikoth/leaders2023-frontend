import { axiosInstance } from '@/api/axios'

export interface ICreateScoreRequestData {
	comment: string
	rating: number
	bookingId: string
	creativeSpaceId: string
}

export default {
	create(data: ICreateScoreRequestData): Promise<void> {
		return axiosInstance.post('/api/v1/score', data)
	},
}
