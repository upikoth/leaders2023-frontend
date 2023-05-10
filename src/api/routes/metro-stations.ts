import { axiosInstance } from '@/api/axios'
import type { IMetroStation } from '@/api'

export default {
	getAll(): Promise<IMetroStation[]> {
		return axiosInstance.get('/api/v1/metroStations')
	},
}
