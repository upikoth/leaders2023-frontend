import type { ICalendarEvent } from '@/api'

export interface ICreativeSpaceListItem {
	id: number
	title: string
	address: string
	landlordId: number
	description: string
	photos: string[]
	pricePerHour: number
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
	landlordId: number
	description: string
	photos: string[]
	pricePerHour: number
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
