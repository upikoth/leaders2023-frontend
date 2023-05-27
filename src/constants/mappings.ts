import { UserRole, BookingStatusEnum, CreativeSpaceStatusEnum } from '@/api'
import { WeekDayIndex } from '@/constants'

export const userRoleMapping = {
	[UserRole.Admin]: 'Администратор',
	[UserRole.Landlord]: 'Арендодатель',
	[UserRole.Tenant]: 'Арендатор',
}

export const userRoleColorMapping = {
	[UserRole.Admin]: 'success',
	[UserRole.Landlord]: 'primary',
	[UserRole.Tenant]: 'warning',
}

export const workDayIndexMapping = {
	[`${WeekDayIndex.Monday}`]: 'Понедельник',
	[`${WeekDayIndex.Tuesday}`]: 'Вторник',
	[`${WeekDayIndex.Wednesday}`]: 'Среда',
	[`${WeekDayIndex.Thursday}`]: 'Четверг',
	[`${WeekDayIndex.Friday}`]: 'Пятница',
	[`${WeekDayIndex.Saturday}`]: 'Суббота',
	[`${WeekDayIndex.Sunday}`]: 'Воскресенье',
}

export const workDayIndexShortNameMapping = {
	[`${WeekDayIndex.Monday}`]: 'Пн',
	[`${WeekDayIndex.Tuesday}`]: 'Вт',
	[`${WeekDayIndex.Wednesday}`]: 'Ср',
	[`${WeekDayIndex.Thursday}`]: 'Чт',
	[`${WeekDayIndex.Friday}`]: 'Пт',
	[`${WeekDayIndex.Saturday}`]: 'Сб',
	[`${WeekDayIndex.Sunday}`]: 'Вс',
}

export const bookingStatusNameMapping = {
	[`${BookingStatusEnum.ConfirmationByLandlord}`]: 'Ожидает подтверждения',
	[`${BookingStatusEnum.ConfirmedByLandlord}`]: 'Подтвержден',
}

export const bookingStatusBadgeColorMapping = {
	[`${BookingStatusEnum.ConfirmationByLandlord}`]: 'warning',
	[`${BookingStatusEnum.ConfirmedByLandlord}`]: 'primary',
}

export const creativeSpaceStatusNameMapping = {
	[`${CreativeSpaceStatusEnum.ConfirmationByAdmin}`]: 'Ожидает подтверждения',
	[`${CreativeSpaceStatusEnum.ConfirmedByAdmin}`]: 'Подтверждена',
}

export const creativeSpaceStatusBadgeColorMapping = {
	[`${CreativeSpaceStatusEnum.ConfirmationByAdmin}`]: 'warning',
	[`${CreativeSpaceStatusEnum.ConfirmedByAdmin}`]: 'primary',
}
