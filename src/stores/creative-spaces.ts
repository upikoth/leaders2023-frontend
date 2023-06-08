import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { IStoreNameEnum } from './index.types'


export enum CreativeSpaceDisplayType {
	List = 'list',
	Map = 'map'
}

export const useCreativeSpacesStore = defineStore(IStoreNameEnum.CreativeSpaces, () => {
	const displayType = ref(CreativeSpaceDisplayType.List)

	const isDisplayMap = computed(() => displayType.value === CreativeSpaceDisplayType.Map)
	const isDisplayList = computed(() => displayType.value === CreativeSpaceDisplayType.List)

	function changeDisplayType() {
		switch (displayType.value) {
		case CreativeSpaceDisplayType.List:
			displayType.value = CreativeSpaceDisplayType.Map
			break;
		case CreativeSpaceDisplayType.Map:
			displayType.value = CreativeSpaceDisplayType.List
			break;
		default:
			displayType.value = CreativeSpaceDisplayType.List
		}
	}

	return {
		displayType,
		isDisplayMap,
		isDisplayList,
		changeDisplayType,
	}
})
