export interface ICreativeSpaceShort {
	id: number
	photos: string[]
	pricePerHour: number
	metroStations: {
		name: string
		color: string
		distanceInMinutes: number
	}[]
	address: string
	coordinate: {
		latitude: number
		longitude: number
	}
	workingHours: {
		startAt: string
		endAt: string
	}
}

export interface ICreativeSpaceFull {
	id: number
	photos: string[]
	pricePerHour: number
	metroStations: {
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
	landlordInfo: {}
	description: string
}
