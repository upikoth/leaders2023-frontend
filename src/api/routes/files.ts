import { axiosInstance } from '@/api/axios'

export interface IFilePostRequestData {
	file: Blob
}

export interface IFilePostResponseData {
	file: {
		name: string
	}
}

export default {
	create(data: IFilePostRequestData): Promise<IFilePostResponseData> {
		const formData = new FormData();
		
		Object.keys(data).forEach(key => {
			formData.append(key, data[key as keyof IFilePostRequestData]);
		})

		return axiosInstance.post('/api/v1/file', formData)
	},
}
