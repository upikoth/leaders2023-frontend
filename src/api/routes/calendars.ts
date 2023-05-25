import { axiosInstance } from '@/api/axios'

export interface ICalendarConvertRequestData {
	calendar: Blob
}

export interface ICalendarConvertResponseData {
	events: {
		// Формат: yyyy-MM-dd.
		date: string
	}[]
}

export default {
	convertCalendarToEvents(data: ICalendarConvertRequestData): Promise<ICalendarConvertResponseData> {
		const formData = new FormData();
		
		Object.keys(data).forEach(key => {
			formData.append(key, data[key as keyof ICalendarConvertRequestData]);
		})

		return axiosInstance.post('/api/v1/calendar/convert', formData)
	},
	convertCalendarLinkToEvents(link: string): Promise<ICalendarConvertResponseData> {
		return axiosInstance.post('/api/v1/calendar/convertFromLink', { link })
	}
}
