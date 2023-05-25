<script setup lang="ts">
import { toRefs } from 'vue'
import type { PropType } from 'vue'
import { IonImg } from '@ionic/vue'

const props = defineProps({
	images: {
		type: Array as PropType<string[]>,
		default: () => []
	},
	height: {
		type: String as PropType<string>,
		default: '100%',
	},
	width: {
		type: String as PropType<string>,
		default: '100%',
	},
	objectFit: {
		type: String as PropType<string>,
		default: 'cover',
	}
})

const { height, width, objectFit } = toRefs(props)
</script>

<template>
	<swiper-container
		class="ui-carousel"
		navigation="true"
		pagination="true"
		loop="true"
	>
		<swiper-slide
			v-for="(image, index) in props.images"
			:key="index"
		>
			<ion-img
				class="ui-carousel__image"
				:src="image"
				alt=""
			/>
		</swiper-slide>
	</swiper-container>
</template>

<style lang="scss" scoped>
.ui-carousel {
	width: v-bind(width);
	height: v-bind(height);

	--swiper-theme-color: var(--ion-color-primary);
	--swiper-navigation-size: 24px;

	&__image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: v-bind(objectFit);
	}
}
</style>
