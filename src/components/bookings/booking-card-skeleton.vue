<script setup lang="ts">
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
</script>

<template>
	<ion-card class="booking-card-skeleton">
		<ui-skeleton 
			height="200px"
		/>

		<ion-card-header>
			<ion-card-title class="booking-card-skeleton__title">
				<ui-skeleton width="75%" />
			</ion-card-title>
			<ion-card-subtitle class="booking-card-skeleton__subtitle">
				<ui-skeleton />
			</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content class="booking-card-skeleton__conent">
			<p class="booking-card-skeleton__status">
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
			<p>
				<ui-skeleton
					height="12px"
					width="150px"
				/>
			</p>
			<p
				v-if="userStore.isAdmin || userStore.isTenant"
				class="booking-card-skeleton__one-line-content"
			>
				<ui-skeleton
					height="12px"
					width="250px"
				/>
			</p>
			<p
				v-if="userStore.isAdmin || userStore.isTenant"
				class="booking-card-skeleton__one-line-content"
			>
				<ui-skeleton
					height="12px"
					width="80%"
				/>
			</p>
			<p
				v-if="userStore.isAdmin || userStore.isLandlord"
				class="booking-card-skeleton__one-line-content"
			>
				<ui-skeleton
					height="12px"
					width="90%"
				/>
			</p>
			<p
				v-if="userStore.isAdmin || userStore.isLandlord"
				class="booking-card-skeleton__one-line-content"
			>
				<ui-skeleton
					height="12px"
					width="90%"
				/>
			</p>
			<div
				class="booking-card-skeleton__details-buttons"
			>
				<ui-skeleton
					width="120px"
					height="32px"
				/>
			</div>
		</ion-card-content>
	</ion-card>
</template>

<style lang="scss" scoped>
.booking-card-skeleton {
	display: flex;
	height: 500px;
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

	&__details-buttons {
		margin-top: auto;
		margin-left: auto;

		> ion-button:not(:last-child) {
			margin-right: 12px;
		}
	}
}
</style>
