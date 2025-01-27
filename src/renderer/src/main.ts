import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './routers'

import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'

import toggleDarkMode from './utils/toggleDarkMode'
import toggleTheme from './utils/toggleTheme'

createApp(App)
  .use(router)
  .use(PrimeVue, {
    theme: {
      options: { darkModeSelector: '.dark' }
    }
  })
  .use(ToastService)
  .mount('#app')

if (!(await window.api.store.getItem('theme'))) {
  window.api.store.setItem('theme', {
    darkMode: 'system',
    theme: 'Aura'
  })
}

await toggleDarkMode((await window.api.store.getItem('theme')).darkMode)
await toggleTheme((await window.api.store.getItem('theme')).theme)
