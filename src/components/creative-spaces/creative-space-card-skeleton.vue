<script setup lang="ts">
import { computed } from 'vue'
import {
	IonCard,
	IonCardTitle,
	IonCardSubtitle,
	IonCardHeader,
	IonCardContent,
} from '@ionic/vue'

import { useUserStore } from '@/stores'

import UiSkeleton from '@/components/ui/ui-skeleton.vue'

const userStore = useUserStore()

const isStatusVisible = computed(() => {
	return userStore.isLandlord|| userStore.isAdmin
})
</script>

<template>
	<ion-card class="creative-space-card-skeleton">
		<ui-skeleton height="200px" />

		<ion-card-header>
			<ion-card-title class="creative-space-card-skeleton__title">
				<ui-skeleton width="75%" />
			</ion-card-title>
			<ion-card-subtitle class="creative-space-card-skeleton__subtitle">
				<ui-skeleton />
			</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content class="creative-space-card-skeleton__conent">
			<p
				v-if="isStatusVisible"
				class="creative-space-card-skeleton__status"
			>
				<ui-skeleton
					height="12px"
					width="150px"
				/>
			</p>
			<p
				class="creative-space-card-skeleton__rating"
			>
				<ui-skeleton
					height="12px"
					width="150px"
				/>
			</p>
			<p>
				<ui-skeleton
					height="12px"
					width="150px"
				/>
			</p>
			<p
				class="creative-space-card-skeleton__info-metro"
			>
				<ui-skeleton
					height="12px"
					width="300px"
				/>
			</p>
			<p class="creative-space-card-skeleton__info-description">
				<ui-skeleton height="76px" />
			</p>
			<ui-skeleton
				class="creative-space-card-skeleton__details-button"
				width="120px"
				height="32px"
			/>
		</ion-card-content>
	</ion-card>
</template>

<style lang="scss" scoped>
.creative-space-card-skeleton {
	display: flex;
	height: 510px;
	flex-direction: column;
	margin: 0;

	&__conent {
		display: flex;
		flex-direction: column;
		flex-grow: 1;

		& > *:not(:last-child) {
			margin-bottom: 8px;
		}
	}

	&__details-button {
		margin-top: auto;
		margin-left: auto;
	}
}
</style>
