import type { ICalendarEvent, UserRole } from '@/api'

export interface IBookingCreativeSpace {
	id: string
	title: string
	address: string
	description: string
	photos: string
}

export interface IBooking {
	id: string
	creativeSpaceId: number
	status: BookingStatusEnum
	fullPrice: number
	calendarEvents: ICalendarEvent[]
	creativeSpace: IBookingCreativeSpace
	scoreId: number
	landlordInfo: {
		id: string
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
		id: string
		phone: string
		role: UserRole
		name: string
		surname: string
		patronymic: string
		email: string
	}
}

export interface IBookingListItemCreativeSpace {
	id: string
	title: string
	address: string
	description: string
	photos: string
}

export interface IBookingListItem {
	id: string
	status: BookingStatusEnum
	fullPrice: number
	calendarEvents: ICalendarEvent[]
	creativeSpace: IBookingListItemCreativeSpace
	scoreId: number
	landlordInfo: {
		id: string
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
		id: string
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
