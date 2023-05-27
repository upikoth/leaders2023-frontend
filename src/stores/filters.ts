import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useUserStore } from '@/stores'

import { IStoreNameEnum } from './index.types'

export interface ICreativeSpacesFilters {
	pricePerDayFrom: string
	pricePerDayTo: string
	freeDates: string[]
	landlordId: number
}

export const useFiltersStore = defineStore(IStoreNameEnum.Filters, () => {
	const userStore = useUserStore()

	function getFiltersDefaultValue() {
		return {
			pricePerDayFrom: '',
			pricePerDayTo: '',
			freeDates: [],
			landlordId: userStore.isLandlord ? userStore.user.id : 0,
		}
	}

  const creativeSpacesFilters = ref<ICreativeSpacesFilters>(getFiltersDefaultValue())

	function patchCreativeSpacesFilters(newFilters: ICreativeSpacesFilters) {
		creativeSpacesFilters.value = {
			...creativeSpacesFilters.value,
			...newFilters
		}
	}

	function clearCreativeSpacesFilters() {
		creativeSpacesFilters.value = getFiltersDefaultValue()
	}

  return {
		creativeSpacesFilters,
		patchCreativeSpacesFilters,
		clearCreativeSpacesFilters,
	}
})
