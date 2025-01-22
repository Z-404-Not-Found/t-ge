import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './routers'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'

createApp(App)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: { darkModeSelector: '.dark' }
    }
  })
  .use(ToastService)
  .mount('#app')
