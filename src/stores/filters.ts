import { ref } from 'vue'
import { defineStore } from 'pinia'
import cloneDeep from 'lodash.clonedeep'

import { IStoreNameEnum } from './index.types'

export interface ICreativeSpacesFilters {
	pricePerDayFrom: string
	pricePerDayTo: string
	freeDates: string[]
}

const filtersDefaultValue: ICreativeSpacesFilters = {
	pricePerDayFrom: '',
	pricePerDayTo: '',
	freeDates: []
}

export const useFiltersStore = defineStore(IStoreNameEnum.Filters, () => {
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
