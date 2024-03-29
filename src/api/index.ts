import health from './routes/health'
import session from './routes/session'
import metroStations from './routes/metro-stations'
import creativeSpaces from './routes/creative-spaces'
import addresses from './routes/addresses'
import users from './routes/users'
import files from './routes/files'
import calendars from './routes/calendars'
import bookings from './routes/bookings'
import scores from './routes/scores'

export * from './routes/health'
export * from './routes/session'
export * from './routes/metro-stations'
export * from './routes/creative-spaces'
export * from './routes/addresses'
export * from './routes/users'
export * from './routes/files'
export * from './routes/calendars'
export * from './routes/bookings'
export * from './routes/scores'

export * from './models'

export default {
	health,
	session,
	metroStations,
	creativeSpaces,
	addresses,
	users,
	files,
	calendars,
	bookings,
	scores,
}

export enum DataLoadingStateEnum {
	DidNotLoad = 'DID_NOT_LOAD',
	Loading = 'LOADING',
	LoadedSuccess = 'LOADED_SUCCESS',
	LoadedError = 'LOADED_ERROR'
}
