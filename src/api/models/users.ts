export interface IUser {
	id: number
	phone: string
	role: UserRole
}

export enum UserRole {
	Admin = 'admin',
	Tenant = 'tenant',
	Landlord = 'landlord'
}
