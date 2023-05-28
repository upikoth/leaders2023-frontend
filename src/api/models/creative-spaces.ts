import type { ICalendarEvent, ICalendarEventFull, UserRole } from '@/api'

export interface ICreativeSpaceListItem {
	id: number
	title: string
	address: string
	status: CreativeSpaceStatusEnum
	landlordId: number
	description: string
	photos: string[]
	pricePerDay: number
	metroStations: {
		id: number
		name: string
		color: string
		distanceInMinutes: number
	}[]
	coordinate: {
		latitude: number
		longitude: number
	}
	calendar: {
		workDayIndexes: number[]
		events: ICalendarEvent[]
		link: string
	}
}

export interface ICreativeSpace {
	id: number
	title: string
	address: string
	status: CreativeSpaceStatusEnum
	description: string
	photos: string[]
	pricePerDay: number
	metroStations: {
		id: number
		name: string
		color: string
		distanceInMinutes: number
	}[]
	coordinate: {
		latitude: number
		longitude: number
	}
	calendar: {
		workDayIndexes: number[]
		events: ICalendarEventFull[]
		link: string
	},
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
}

export enum CreativeSpaceStatusEnum {
	ConfirmationByAdmin = 'confirmation',
	ConfirmedByAdmin = 'confirmed',
}
