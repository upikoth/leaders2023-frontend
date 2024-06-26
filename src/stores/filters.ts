import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useUserStore } from '@/stores'
import type { CreativeSpaceStatusEnum } from '@/api'

import { IStoreNameEnum } from './index.types'

export interface ICreativeSpacesFilters {
	pricePerDayFrom: string
	pricePerDayTo: string
	freeDates: string[]
	landlordId: string
	status: CreativeSpaceStatusEnum | null
	spaceType: string
	area: number
	capacity: number
}

export const useFiltersStore = defineStore(IStoreNameEnum.Filters, () => {
	const userStore = useUserStore()

	function getCreativeSpacesFiltersDefaultValue() {
		return {
			pricePerDayFrom: '',
			pricePerDayTo: '',
			freeDates: [],
			landlordId: userStore.isLandlord ? userStore.user.id : "",
			status: null,
			spaceType: '',
			area: 0,
			capacity: 0
		}
	}

	const creativeSpacesFilters = ref<ICreativeSpacesFilters>(getCreativeSpacesFiltersDefaultValue())

	function patchCreativeSpacesFilters(newFilters: ICreativeSpacesFilters) {
		creativeSpacesFilters.value = {
			...creativeSpacesFilters.value,
			...newFilters
		}
	}

	function clearCreativeSpacesFilters() {
		creativeSpacesFilters.value = getCreativeSpacesFiltersDefaultValue()
	}

	return {
		creativeSpacesFilters,
		patchCreativeSpacesFilters,
		clearCreativeSpacesFilters,
	}
})
