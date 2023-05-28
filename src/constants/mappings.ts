import { UserRole, BookingStatusEnum, CreativeSpaceStatusEnum, CreativeSpaceType } from '@/api'
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

export const creativeSpaceTypeNameMapping = {
	[`${CreativeSpaceType.Showroom}`]: 'Выставочный зал',
	[`${CreativeSpaceType.ArtWorkshop}`]: 'Художественная мастерская',
	[`${CreativeSpaceType.PrototypingCenter}`]: 'Центр прототипирования',
	[`${CreativeSpaceType.LayoutWorkshop}`]: 'Мастерская макетирования',
	[`${CreativeSpaceType.RenderingStudio}`]: 'Рендеринг студия',
	[`${CreativeSpaceType.PhotoVideoStudio}`]: 'Фото-видеостудия',
	[`${CreativeSpaceType.RehearsalRoom}`]: 'Репетиционный зал',
	[`${CreativeSpaceType.DanceHall}`]: 'Танцевальный зал',
	[`${CreativeSpaceType.StageSpace}`]: 'Сценическое пространство',
	[`${CreativeSpaceType.VideoEditingStudio}`]: 'Студия видеомонтажа',
	[`${CreativeSpaceType.MockupStudio}`]: 'МОКАП студия',
	[`${CreativeSpaceType.SewingShop}`]: 'Пошивочный цех',
	[`${CreativeSpaceType.ShowSpace}`]: 'Пространство для показа',
	[`${CreativeSpaceType.RecordingStudio}`]: 'Студия звукозаписи',
	[`${CreativeSpaceType.MusicRehearsalStudio}`]: 'Музыкальная репетиционная студия',
	[`${CreativeSpaceType.ConcertHall}`]: 'Концертная площадка',
}
