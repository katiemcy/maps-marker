import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLocationCrosshairs, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

library.add(faLocationCrosshairs, faMagnifyingGlass)


createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')

