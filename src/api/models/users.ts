export interface IUser {
	id: string
	phone: string
	role: UserRole
	name: string
	surname: string
	patronymic: string
	email: string
	inn?: string
	legalEntityName?: string
}

export enum UserRole {
	Admin = 'admin',
	Tenant = 'tenant',
	Landlord = 'landlord'
}
