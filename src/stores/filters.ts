import { ref } from 'vue'
import { defineStore } from 'pinia'
import cloneDeep from 'lodash.clonedeep'

import { IStoreNameEnum } from './index.types'

import { useUserStore } from '@/stores'

export interface ICreativeSpacesFilters {
	pricePerDayFrom: string
	pricePerDayTo: string
	freeDates: string[]
	landlordId: number
}

export const useFiltersStore = defineStore(IStoreNameEnum.Filters, () => {
	const userStore = useUserStore()

	const filtersDefaultValue: ICreativeSpacesFilters = {
		pricePerDayFrom: '',
		pricePerDayTo: '',
		freeDates: [],
		landlordId: userStore.isLandlord ? userStore.user.id : 0,
	}

  const creativeSpacesFilters = ref<ICreativeSpacesFilters>(cloneDeep(filtersDefaultValue))

	function patchCreativeSpacesFilters(newFilters: ICreativeSpacesFilters) {
		creativeSpacesFilters.value = {
			...creativeSpacesFilters.value,
			...newFilters
		}
	}

	function clearCreativeSpacesFilters() {
		creativeSpacesFilters.value = cloneDeep(filtersDefaultValue)
	}

  return {
		creativeSpacesFilters,
		patchCreativeSpacesFilters,
		clearCreativeSpacesFilters,
	}
})
