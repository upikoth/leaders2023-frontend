<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import {
	IonInput,
	IonPopover,
	IonContent,
	IonList,
	IonItem,
	IonSearchbar
} from '@ionic/vue'
import type { SearchbarCustomEvent } from '@ionic/vue'

interface IUiSelectItem {
	label?: string
	value: string
	options?: Record<string, string>
}

const props = defineProps({
	modelValue: {
		type: String as PropType<string>,
		required: true,
	},
	label: {
		type: String as PropType<string>,
		default: '',
	},
	labelPlacement: {
		type: String as PropType<"floating" | "start" | "end" | "stacked" | "fixed">,
		default: 'floating',
	},
	errorText: {
		type: String as PropType<string>,
		default: ' ',
	},
	searchPlaceholder: {
		type: String as PropType<string>,
		default: 'Поиск',
	},
	items: {
		type: Array as PropType<IUiSelectItem[]>,
		default: () => [],
	},
	searchable: {
		type: Boolean as PropType<boolean>,
		default: false,
	}
})

const emit = defineEmits({
	'update:model-value': (value: string) => typeof value === 'string',
	'update:options': null,
	'update:search-value': (value: string) => typeof value === 'string',
	'update:is-dropdown-open': (value: boolean) => typeof value === 'boolean'
});

const isDropdownOpen = ref(false)
const dropdownEvent = ref<MouseEvent | null>(null)

const searchValue = ref(props.modelValue || '')

const inputValue = computed(() => {
	const selectedItem = props.items.find(item => item.value === props.modelValue)
	return selectedItem?.label || selectedItem?.value || ''
})

watch(() => searchValue.value, () => {
	emit('update:search-value', searchValue.value)
})

function handleItemClick(item: IUiSelectItem) {
	searchValue.value = item.value
	emit('update:model-value', item.value)

	if (item.options) {
		emit('update:options', item.options)
	}

	closeDropdown()
}

function handleSearchInput(event: SearchbarCustomEvent) {
	searchValue.value = event.target.value || ''
}

function openDropdown(event: MouseEvent) {
	if (!props.items.length) {
		return
	}

	dropdownEvent.value = event
	isDropdownOpen.value = true
	emit('update:is-dropdown-open', true)
}

function closeDropdown() {
	isDropdownOpen.value = false
	emit('update:is-dropdown-open', false)
}
</script>

<template>
	<div
		class="ui-select"
	>
		<div 
			class="ui-select__overlay"
			@click="openDropdown"
		/>
		<ion-input
			:value="inputValue"
			:label="props.label"
			:label-placement="props.labelPlacement"
			:error-text="props.errorText"
			inputmode="text"
			readonly
			helper-text="&nbsp;"
			v-bind="$attrs"
		/>
		<ion-popover
			class="ui-select__popover"
			:is-open="isDropdownOpen"
			:event="dropdownEvent"
			:show-backdrop="false"
			size="cover"
			@did-dismiss="closeDropdown"
		>
			<ion-searchbar 
				v-if="props.searchable"
				class="ui-select__popover-searchbar"
				:value="searchValue"
				inputmode="text"
				:placeholder="searchPlaceholder"
				@ion-input="handleSearchInput"
			/>
			<ion-content
				class="ui-select__popover-content"
			>
				<ion-list
					class="ui-select__list"
				>
					<ion-item
						v-for="item in props.items"
						:key="item.value"
						class="ui-select__item"
						button
						@click="handleItemClick(item)"
					>
						{{ item.label || item.value }}
					</ion-item>
				</ion-list>
			</ion-content>
		</ion-popover>
	</div>
</template>

<style lang="scss" scoped>
.ui-select {
	position: relative;

	&__overlay {
		position: absolute;
		z-index: 5;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}

	&__popover {
		--max-height: 360px;
	}

	&__popover-searchbar {
		padding-top: 8px;
		padding-inline-end: 12px;
		padding-inline-start: 12px;
	}

	&__popover-content {
		--padding-top: 8px;
		--padding-start: 8px;
		--padding-end: 8px;
	}

	&__list {
		padding: 0;
	}

	&__item {
		--padding-start: 0;
		--inner-padding-end: 8px;
		--inner-padding-start: 8px;
		--inner-padding-top: 8px;
		--inner-padding-bottom: 8px;
	}
}
</style>
