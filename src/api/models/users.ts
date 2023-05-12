export interface IUser {
	id: number
	phone: string
	role: IUserRole
}

export enum IUserRole {
	Admin = 'admin',
	Tenant = 'tenant',
	Landlord = 'landlord'
}
