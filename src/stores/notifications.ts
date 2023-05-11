import { defineStore } from 'pinia'
import { warningOutline, checkmarkOutline } from 'ionicons/icons';
import { toastController } from '@ionic/vue'
import type { ToastOptions } from '@ionic/vue'

import { useScreenStore } from '@/stores'

import { IStoreNameEnum } from './index.types'

export interface INotification {
	message: string
	color: 'success' | 'danger'
	icon: string
}

export const useNotificationsStore = defineStore(IStoreNameEnum.Notifications, () => {
	const screenStore = useScreenStore()

	function success(message: string) {
		createNotification({
			message,
			color: 'success',
			icon: checkmarkOutline
		})
	}

	function error(message: string) {
		createNotification({
			message,
			color: 'danger',
			icon: warningOutline
		})
	}

	async function createNotification(options: ToastOptions) {
		const toast = await toastController.create({
			...options,
			duration: 2000,
			position: screenStore.isSmUp ? 'bottom' : 'top'
		})

		await toast.present()
	}

  return {
		success,
		error,
	}
})
