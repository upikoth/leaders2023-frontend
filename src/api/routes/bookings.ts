import { axiosInstance } from '@/api/axios'
import type {
	IBookingListItem,
	IBooking,
	ICalendarEvent
} from '@/api'

export interface ICreateBookingRequestData {
	creativeSpaceId: number
	calendarEvents: ICalendarEvent[]
}

export interface ICreateBookingResponseData {
	id: number
}

export interface IPatchBookingRequestBody {
	calendarEvents: ICalendarEvent[]
}

export interface IGetBookingsResponseData{
	bookings: IBookingListItem[]
}

export default {
	create(data: ICreateBookingRequestData): Promise<ICreateBookingResponseData> {
		return axiosInstance.post('/api/v1/booking', data)
	},
	getAll(): Promise<IGetBookingsResponseData> {
		return axiosInstance.get('/api/v1/bookings')
	},
	get(id: number): Promise<IBooking> {
		return axiosInstance.get(`/api/v1/bookings/${id}`)
	},
	update(id: number, data: IPatchBookingRequestBody): Promise<void> {
		return axiosInstance.patch(`/api/v1/bookings/${id}`, data)
	},
	delete(id: number): Promise<void> {
		return axiosInstance.delete(`/api/v1/bookings/${id}`)
	},
}
