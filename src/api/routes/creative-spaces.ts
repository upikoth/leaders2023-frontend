import { axiosInstance } from '@/api/axios'
import type { ICreativeSpaceListItem, ICreativeSpace, ICalendarEvent, CreativeSpaceStatusEnum, CreativeSpaceType } from '@/api'

export interface ICreateCreativeSpaceRequestData {
	spaceType: CreativeSpaceType
	area: number
	capacity: number
	title: string
	address: string
	description: string
	photos: string
	pricePerDay: number
	metroStations: {
		id: string
		distanceInMinutes: number
	}[]
	coordinate: {
		latitude: number
		longitude: number
	}
	calendar: {
		workDayIndexes: string
		events: ICalendarEvent[]
		link?: string
	}
}

export interface ICreateCreativeSpaceResponseData {
	creativeSpace: {
		id: string
	}
}

export interface IGetCreativeSpacesResponseData {
	creativeSpaces: ICreativeSpaceListItem[]
}

export interface IGetCreativeSpaceResponseData {
	creativeSpace: ICreativeSpace
}

export interface IPatchCreativeSpaceRequestBody {
	spaceType?: CreativeSpaceType
	area?: number
	capacity?: number
	title?: string
	address?: string
	status?: CreativeSpaceStatusEnum
	description?: string
	photos?: string
	pricePerDay?: number
	metroStations?: {
		id: string
		distanceInMinutes: number
	}[]
	coordinate?: {
		latitude?: number
		longitude?: number
	}
	calendar?: {
		workDayIndexes?: string
		events?: ICalendarEvent[]
		link?: string
	}
}

export default {
	create(data: ICreateCreativeSpaceRequestData): Promise<ICreateCreativeSpaceResponseData> {
		return axiosInstance.post('/api/v1/creativeSpace', data)
	},
	getAll(): Promise<IGetCreativeSpacesResponseData> {
		return axiosInstance.get('/api/v1/creativeSpaces')
	},
	get(id: string): Promise<IGetCreativeSpaceResponseData> {
		return axiosInstance.get(`/api/v1/creativeSpaces/${id}`)
	},
	update(id: string, data: IPatchCreativeSpaceRequestBody): Promise<void> {
		return axiosInstance.patch(`/api/v1/creativeSpaces/${id}`, data)
	},
	delete(id: string): Promise<void> {
		return axiosInstance.delete(`/api/v1/creativeSpaces/${id}`)
	},
}
