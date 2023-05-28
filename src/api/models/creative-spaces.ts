import type { ICalendarEvent, ICalendarEventFull, UserRole } from '@/api'

export interface ICreativeSpaceListItem {
	id: number
	spaceType: CreativeSpaceType
	area: number
	capacity: number
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
	spaceType: CreativeSpaceType
	area: number
	capacity: number
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

export enum CreativeSpaceType {
	Showroom = 'showroom',
	ArtWorkshop = 'art-workshop',
	PrototypingCenter = 'prototyping-center',
	LayoutWorkshop = 'layout-workshop',
	RenderingStudio = 'rendering-studio',
	PhotoVideoStudio = 'photo-video-studio',
	RehearsalRoom = 'rehearsal-room',
	DanceHall = 'dance-hall',
	StageSpace = 'stage-space',
	VideoEditingStudio = 'video-editing-studio',
	MockupStudio = 'mockup-studio',
	SewingShop = 'sewing-shop',
	ShowSpace = 'show-space',
	RecordingStudio = 'recording-studio',
	MusicRehearsalStudio = 'music-rehearsal-studio',
	ConcertHall = 'Concert hall',
}
