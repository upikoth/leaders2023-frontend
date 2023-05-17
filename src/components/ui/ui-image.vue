<script setup lang="ts">
import { toRefs } from 'vue'
import type { PropType } from 'vue'
import {
	IonThumbnail,
	IonImg,
	IonButton,
	IonIcon
} from '@ionic/vue';
import { trash } from 'ionicons/icons';

const props = defineProps({
	size: {
		type: String as PropType<string>,
		default: '100%',
	},
	src: {
		type: String as PropType<string>,
		required: true,
	}
})

const emit = defineEmits({
	'delete': null,
});

const { size } = toRefs(props)
</script>

<template>
	<div class="ui-image">
		<ion-thumbnail class="ui-image__thumbnail">
			<div 
				class="ui-image__overlay"
			>
				<ion-button
					slot="icon-only"
					class="ui-image__close-button"
					fill="clear"
					@click="emit('delete')"
				>
					<ion-icon 
						:icon="trash"
					/>
				</ion-button>
			</div>
			<ion-img
				:src="props.src" 
				alt=""
			/>
		</ion-thumbnail>
	</div>
</template>

<style lang="scss" scoped>
.ui-image {
	display: inline-block;
	width: v-bind(size);
	height: v-bind(size);

	&__thumbnail {
		--border-radius: 8px;
		--size: 100%;

		position: relative;
	}

	&__overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 8px;
		transition: background-color 0.15s ease-in-out;

		&:hover {
			background-color: rgb(#000000, 0.5);
		}
	}

	&__close-button {
		position: absolute;
		top: 0;
		right: 0;
		color: black;
		transition: color 0.15s ease-in-out;

		.ui-image__overlay:hover & {
			color: white;
		}
	}
}
</style>
