import { createRouter, createWebHashHistory } from '@ionic/vue-router'

import { useUserStore } from '@/stores'

import HomeView from '@/views/home-view.vue'

export enum ViewName {
	HomeView = 'HOME_VIEW',
	DocumentationView = 'DOCUMENTAITION_VIEW',
	UsersView = 'USERS_VIEW',
	StatsView = 'STATS_VIEW',
	CreativeSpacesView = 'CREATIVE_SPACES',
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
					redirect: () => ({ name: ViewName.HomeView }),
				},
				{
					path: 'home',
					name: ViewName.HomeView,
					component: HomeView
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
					component: () => import('@/views/creative-spaces-view.vue')
				},
				{
					path: 'creative-spaces',
					name: ViewName.CreativeSpacesView,
					component: () => import('@/views/creative-spaces-view.vue')
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

				return userStore.isAuthorized ? { name: ViewName.HomeView } : { name: ViewName.SignIn }
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
		return next({ name: ViewName.HomeView })
	}

	return next()
})

export default router
