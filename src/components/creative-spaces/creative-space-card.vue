<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import {
	useIonRouter,
	IonCard,
	IonCardTitle,
	IonCardSubtitle,
	IonCardHeader,
	IonCardContent,
	IonButton,
} from '@ionic/vue'

import type { ICreativeSpaceListItem } from '@/api';
import { formatPrice } from '@/utils'
import { ViewName } from '@/router';
import { useScreenStore } from '@/stores'
import environments from '@/environments'

import UiCarousel from '@/components/ui/ui-carousel.vue'
import UiDot from '@/components/ui/ui-dot.vue'

const ionRouter = useIonRouter()

const screenStore = useScreenStore()

const props = defineProps({
	creativeSpace: {
		type: Object as PropType<ICreativeSpaceListItem>,
		required: true
	},
})

const emit = defineEmits({
	'before-redirect-to-details-page': null,
});


const images = computed((): string[] => props.creativeSpace.photos.map(photoName => `${environments.S3_ACCESS_DOMAIN_NAME}/${photoName}`))

function redirectToCreativeSpacesDetailsPage() {
	emit('before-redirect-to-details-page')
	ionRouter.replace({ name: ViewName.CreativeSpacesDetailsView, params: { id: props.creativeSpace.id } })
}
</script>

<template>
	<ion-card class="creative-space-card">
		<div>
			<ui-carousel
				:images="images"
				height="200px"
			/>
		</div>

		<ion-card-header>
			<ion-card-title class="creative-space-card__title">
				{{ props.creativeSpace.title }}
			</ion-card-title>
			<ion-card-subtitle class="creative-space-card__subtitle">
				{{ props.creativeSpace.address }}
			</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content class="creative-space-card__conent">
			<p>
				<b>Стоимость:</b>
				{{ formatPrice(props.creativeSpace.pricePerHour) }}/час
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
			<ion-button
				class="creative-space-card__details-button"
				fill="outline"
				:size="screenStore.isXs ? 'small' : 'default'"
				@click="redirectToCreativeSpacesDetailsPage"
			>
				Подробнее
			</ion-button>
		</ion-card-content>
	</ion-card>
</template>

<style lang="scss" scoped>
.creative-space-card {
	display: flex;
	height: 500px;
	flex-direction: column;
	margin: 0;

	&__conent {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

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

	&__details-button {
		margin-top: auto;
		margin-left: auto;
	}
}
</style>
