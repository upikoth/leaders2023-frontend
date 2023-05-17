import { axiosInstance } from '@/api/axios'
import type { IAddress } from '@/api'

export interface IAddressesGetRequest {
	query: string
}

export interface IAddressesGetResponse {
	addresses: IAddress[]
}

export default {
	get(data: IAddressesGetRequest): Promise<IAddressesGetResponse> {
		return axiosInstance.get('/api/v1/addresses', { params: data })
	},
}
