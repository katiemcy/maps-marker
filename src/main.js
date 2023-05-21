import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLocationCrosshairs, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

library.add(faLocationCrosshairs, faMagnifyingGlass)

import * as fb from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'


createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')

