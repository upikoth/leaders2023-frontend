import type { ICalendarEvent } from '@/api'

export interface IBookingCreativeSpace {
	id: number
	title: string
	address: string
	description: string
	photos: string[]
}

export interface IBooking {
	id: number
	tenantId: number
	landlordId: number
	creativeSpaceId: number
	status: BookingStatusEnum
	fullPrice: number
	calendarEvents: ICalendarEvent[]
	creativeSpace: IBookingCreativeSpace
}

export interface IBookingListItemCreativeSpace {
	id: number
	title: string
	address: string
	description: string
	photos: string[]
}

export interface IBookingListItem {
	id: number
	tenantId: number
	landlordId: number
	status: BookingStatusEnum
	fullPrice: number
	calendarEvents: ICalendarEvent[]
	creativeSpace: IBookingListItemCreativeSpace
}

export enum BookingStatusEnum {
	ConfirmationByLandlord = 'confirmation',
	ConfirmedByLandlord = 'confirmed',
	FinishedByTenant = 'finished',
}
