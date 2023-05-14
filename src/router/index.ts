import { createRouter, createWebHashHistory } from '@ionic/vue-router'

import { useUserStore } from '@/stores'

export enum ViewName {
	DocumentationView = 'DOCUMENTAITION_VIEW',
	UsersView = 'USERS_VIEW',
	StatsView = 'STATS_VIEW',
	CreativeSpacesView = 'CREATIVE_SPACES',
	CreativeSpacesCreateView = 'CREATIVE_SPACES_CREATE',
	RentalHistory = 'RENTAL_HISTORY',
	SignIn = 'SIGN_IN',
}

export const UNAUTHORIZED_VIEWS = new Set([ViewName.SignIn])
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
					redirect: () => ({ name: getMainViewName() }),
				},
				{
					path: 'docs',
					name: ViewName.DocumentationView,
					component: () => import('@/views/documentation-view.vue')
				},
				{
					path: 'users',
					name: ViewName.UsersView,
					component: () => import('@/views/users-view.vue')
				},
				{
					path: 'stats',
					name: ViewName.StatsView,
					component: () => import('@/views/stats-view.vue')
				},
				{
					path: 'creative-spaces',
					name: ViewName.CreativeSpacesView,
					component: () => import('@/views/creative-spaces/creative-spaces-view.vue')
				},
				{
					path: 'creative-spaces/create',
					name: ViewName.CreativeSpacesCreateView,
					component: () => import('@/views/creative-spaces/creative-spaces-create-view.vue')
				},
				{
					path: 'rental-history',
					name: ViewName.RentalHistory,
					component: () => import('@/views/rental-history-view.vue')
				},
			]
		},
		{
			path: '/auth',
			component: () => import('@/layouts/auth-layout.vue'),
			children: [
				{
					path: '',
					redirect: () => ({ name: ViewName.SignIn }),
				},
				{
					path: 'sign-in',
					name: ViewName.SignIn,
					component: () => import('@/views/sign-in-view.vue')
				},
			]
		},
		{
			path: '/:pathMatch(.*)*',
			redirect: () => {
				const userStore = useUserStore()

				return userStore.isAuthorized ? { name: getMainViewName() } : { name: ViewName.SignIn }
			},
		},
  ]
})

export function getMainViewName() {
	const userStore = useUserStore()

	if (userStore.isTenant) {
		return ViewName.CreativeSpacesView
	}

	if (userStore.isAdmin || userStore.isLandlord) {
		return ViewName.StatsView
	}

	return ViewName.StatsView
}

router.beforeEach((to, _, next) => {
	if (!checkIsView(to.name)) {
		return next()
	}

	const userStore = useUserStore()

	// Если неавторизован и пытается перейти на страницы требующие авторизации, редиректим на страницу входа.
	if (
		userStore.isAuthorizationChecked &&
		!UNAUTHORIZED_VIEWS.has(to.name) &&
		!userStore.isAuthorized
	) {
		return next({ name: ViewName.SignIn })
	}

	// Если авторизован и пытается перейти на страницы не требующие авторизации, редиректим на главную страницу.
	if (
		userStore.isAuthorizationChecked &&
		UNAUTHORIZED_VIEWS.has(to.name) &&
		userStore.isAuthorized
	) {
		return next({ name: getMainViewName() })
	}

	return next()
})

export default router
