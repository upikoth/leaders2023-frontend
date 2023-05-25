import { UserRole } from '@/api'
import { WeekDayIndex } from '@/constants'

export const userRoleMapping = {
	[UserRole.Admin]: 'Администратор',
	[UserRole.Landlord]: 'Арендодатель',
	[UserRole.Tenant]: 'Арендатор',
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
