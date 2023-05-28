import type { ICalendarEvent, UserRole } from '@/api'

export interface IBookingCreativeSpace {
	id: number
	title: string
	address: string
	description: string
	photos: string[]
}

export interface IBooking {
	id: number
	creativeSpaceId: number
	status: BookingStatusEnum
	fullPrice: number
	calendarEvents: ICalendarEvent[]
	creativeSpace: IBookingCreativeSpace
	landlordInfo: {
		id: number
		phone: string
		role: UserRole
		name: string
		surname: string
		patronymic: string
		email: string
		inn: string
		legalEntityName: string
	}
	tenantInfo: {
		id: number
		phone: string
		role: UserRole
		name: string
		surname: string
		patronymic: string
		email: string
	}
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
	status: BookingStatusEnum
	fullPrice: number
	calendarEvents: ICalendarEvent[]
	creativeSpace: IBookingListItemCreativeSpace
	landlordInfo: {
		id: number
		phone: string
		role: UserRole
		name: string
		surname: string
		patronymic: string
		email: string
		inn: string
		legalEntityName: string
	}
	tenantInfo: {
		id: number
		phone: string
		role: UserRole
		name: string
		surname: string
		patronymic: string
		email: string
	}
}

export enum BookingStatusEnum {
	ConfirmationByLandlord = 'confirmation',
	ConfirmedByLandlord = 'confirmed',
}
