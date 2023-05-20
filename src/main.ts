import { createApp, defineCustomElement } from 'vue'
import { createPinia } from 'pinia'
import { IonicVue } from '@ionic/vue';
import { register } from 'swiper/element/bundle';

import CreativeSpaceMarker from '@/components/map/creative-space-marker.ce.vue'

import App from './app.vue'
import router from './router'

import './assets/css/index.css'

register();

const CreativeSpaceMarkerComponent = defineCustomElement(CreativeSpaceMarker)

customElements.define('map-creative-space-marker', CreativeSpaceMarkerComponent)

const app = createApp(App)

app.use(createPinia())
app.use(IonicVue)
app.use(router)

router.isReady().then(() => {
  app.mount('#app');
});
