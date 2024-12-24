import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import '@mdi/font/css/materialdesignicons.css'
import router from './routers'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi'
  }
})

createApp(App).use(router).use(vuetify).mount('#app')
