import { createRouter, createWebHashHistory } from '@ionic/vue-router'

import { useUserStore } from '@/stores'

export enum ViewName {
	UsersView = 'USERS',
	UsersDetailsView = 'USERS_DETAILS',
	UsersEditView = 'USERS_EDIT',
	CreativeSpacesView = 'CREATIVE_SPACES',
	CreativeSpacesDetailsView = 'CREATIVE_SPACES_DETAILS',
	CreativeSpacesCreateView = 'CREATIVE_SPACES_CREATE',
	CreativeSpacesEditView = 'CREATIVE_SPACES_EDIT',
	BookingsView = 'BOOKINGS',
	BookingsDetailsView = 'BOOKINGS_DETAILS',
	SignInView = 'SIGN_IN',
}

export const UNAUTHORIZED_VIEWS = new Set([ViewName.SignInView])
export const ALL_VIEWS = new Set(Object.values(ViewName))

export function checkIsView(view: unknown): view is ViewName {
	return ALL_VIEWS.has(view as ViewName)
}

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '',
			component: () => import('@/layouts/base-layout.vue'),
			children: [
				{
					path: '',
					redirect: () => ({ name: ViewName.CreativeSpacesView }),
				},
				{
					path: 'users',
					component: () => import('@/layouts/empty-layout.vue'),
					children: [
						{
							path: '',
							name: ViewName.UsersView,
							component: () => import('@/views/users/users-view.vue')
						},
						{
							path: ':userId',
							name: ViewName.UsersDetailsView,
							component: () => import('@/views/users/users-details-view.vue')
						},
						{
							path: ':userId/edit',
							name: ViewName.UsersEditView,
							component: () => import('@/views/users/users-edit-view.vue')
						},
					]
				},
				{
					path: 'creative-spaces',
					component: () => import('@/layouts/empty-layout.vue'),
					children: [
						{
							path: '',
							name: ViewName.CreativeSpacesView,
							component: () => import('@/views/creative-spaces/creative-spaces-view.vue')
						},
						{
							path: 'create',
							name: ViewName.CreativeSpacesCreateView,
							component: () => import('@/views/creative-spaces/creative-spaces-create-view.vue')
						},
						{
							path: ':id',
							name: ViewName.CreativeSpacesDetailsView,
							component: () => import('@/views/creative-spaces/creative-spaces-details-view.vue')
						},
						{
							path: ':id/edit',
							name: ViewName.CreativeSpacesEditView,
							component: () => import('@/views/creative-spaces/creative-spaces-edit-view.vue')
						},
					]
				},
				{
					path: 'bookings',
					component: () => import('@/layouts/empty-layout.vue'),
					children: [
						{
							path: '',
							name: ViewName.BookingsView,
							component: () => import('@/views/bookings/bookings-view.vue')
						},
						{
							path: ':id',
							name: ViewName.BookingsDetailsView,
							component: () => import('@/views/bookings/bookings-details-view.vue')
						},
					]
				},
			]
		},
		{
			path: '/auth',
			component: () => import('@/layouts/auth-layout.vue'),
			children: [
				{
					path: '',
					redirect: () => ({ name: ViewName.SignInView }),
				},
				{
					path: 'sign-in',
					name: ViewName.SignInView,
					component: () => import('@/views/sign-in-view.vue')
				},
			]
		},
		{
			path: '/:pathMatch(.*)*',
			redirect: () => {
				const userStore = useUserStore()

				return userStore.userToken ? { name: ViewName.CreativeSpacesView } : { name: ViewName.SignInView }
			},
		},
	]
})

router.beforeEach((to, _, next) => {
	if (!checkIsView(to.name)) {
		return next()
	}

	const userStore = useUserStore()

	// Если неавторизован и пытается перейти на страницы требующие авторизации, редиректим на страницу входа.
	if (
		userStore.isAuthorizationChecked &&
		!UNAUTHORIZED_VIEWS.has(to.name) &&
		!userStore.userToken
	) {
		return next({ name: ViewName.SignInView })
	}

	// Если авторизован и пытается перейти на страницы не требующие авторизации, редиректим на главную страницу.
	if (
		userStore.isAuthorizationChecked &&
		UNAUTHORIZED_VIEWS.has(to.name) &&
		!!userStore.userToken
	) {
		return next({ name: ViewName.CreativeSpacesView })
	}

	return next()
})

export default router
