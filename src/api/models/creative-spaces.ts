export interface ICreativeSpaceListItem {
	id: number
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
	workingHours: {
		startAt: string
		endAt: string
	}
}

export interface ICreativeSpace {
	id: number
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
	workingHours: {
		startAt: string
		endAt: string
	}
}
