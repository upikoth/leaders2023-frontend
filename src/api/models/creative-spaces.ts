import type { ICalendarEvent, ICalendarEventFull, UserRole } from '@/api'

export interface ICreativeSpaceListItem {
	id: string
	spaceType: CreativeSpaceType
	area: number
	capacity: number
	title: string
	address: string
	status: CreativeSpaceStatusEnum
	landlordId: string
	description: string
	photos: string
	pricePerDay: number
	metroStations: {
		id: string
		name: string
		color: string
		distanceInMinutes: number
	}[]
	coordinate: {
		latitude: number
		longitude: number
	}
	calendar: {
		workDayIndexes: string
		events: ICalendarEvent[]
		link: string
	}
	scores: {
		id: string
		comment: string
		rating: number
		user: {
			id: string
			name: string
			surname: string
			patronymic: string
		}
	}[]
	averageRating: number
}

export interface ICreativeSpace {
	id: string
	spaceType: CreativeSpaceType
	area: number
	capacity: number
	title: string
	address: string
	status: CreativeSpaceStatusEnum
	description: string
	photos: string
	pricePerDay: number
	metroStations: {
		id: string
		name: string
		color: string
		distanceInMinutes: number
	}[]
	coordinate: {
		latitude: number
		longitude: number
	}
	calendar: {
		workDayIndexes: string
		events: ICalendarEventFull[]
		link: string
	},
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
	scores: {
		id: string
		comment: string
		rating: number
		user: {
			id: string
			name: string
			surname: string
			patronymic: string
		}
	}[]
	averageRating: number
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
