<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import {
	IonCard,
	IonCardTitle,
	IonCardSubtitle,
	IonCardHeader,
	IonCardContent
} from '@ionic/vue'

import type { ICreativeSpaceListItem } from '@/api';
import { formatPrice } from '@/utils'

import UiCarousel from '@/components/ui/ui-carousel.vue'
import UiDot from '@/components/ui/ui-dot.vue'

const props = defineProps({
	creativeSpace: {
		type: Object as PropType<ICreativeSpaceListItem>,
		required: true
	},
})

const images = computed((): string[] => props.creativeSpace.photos)
</script>

<template>
	<ion-card class="creative-space-card">
		<ui-carousel
			:images="images"
			height="200px"
		/>

		<ion-card-header>
			<ion-card-title class="creative-space-card__title">
				Заголовка пока нет, надо сделать! фывафыв афыв фыва фывафывафыв афывафыва
			</ion-card-title>
			<ion-card-subtitle class="creative-space-card__subtitle">
				Здесь должен быть адрес, его пока нет, надо сделать!asd fasdfasdfasdf
			</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content>
			<p>
				<b>Стоимость:</b>
				{{ formatPrice(props.creativeSpace.pricePerHour) }} / час
			</p>
			<p>
				<b>Часы работы:</b>
				{{ props.creativeSpace.workingHours.startAt }} - {{ props.creativeSpace.workingHours.endAt }}
			</p>
			<p
				class="creative-space-card__info-metro"
			>
				<b class="creative-space-card__info-metro-title">Ближайшее метро:</b>
				<template 
					v-if="props.creativeSpace.metroStations.length"
				>
					<ui-dot
						class="creative-space-card__info-metro-color"
						:color="props.creativeSpace.metroStations[0].color"
						size="12px"
					/>
					{{ props.creativeSpace.metroStations[0].name }},
					{{ props.creativeSpace.metroStations[0].distanceInMinutes }} мин. пешком
				</template>
				<template v-else>
					нет информации
				</template>
			</p>
			<p class="creative-space-card__info-description">
				<b>Описание:</b>
				{{ props.creativeSpace.description }}
			</p>
		</ion-card-content>
	</ion-card>
</template>

<style lang="scss" scoped>
.creative-space-card {
	height: 440px;
	margin: 0;

	&__info-metro,
	&__subtitle,
	&__title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__info-metro {
		display: flex;
		align-items: center;
	}

	&__info-metro-title {
		margin-right: 8px;
	}

	&__info-metro-color {
		margin-right: 4px;
	}

	&__info-description {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
	}
}
</style>
