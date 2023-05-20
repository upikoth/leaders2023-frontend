import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { IonicVue } from '@ionic/vue';
import { register } from 'swiper/element/bundle';

import App from './app.vue'
import router from './router'
import { loadScript } from './utils'
import environments from './environments';

import './assets/css/index.css'

await loadScript(`https://api-maps.yandex.ru/3.0/?apikey=${environments.YANDEX_API_KEY}&lang=ru_RU`)
register();

const app = createApp(App)

app.use(createPinia())
app.use(IonicVue)
app.use(router)

router.isReady().then(() => {
  app.mount('#app');
});
