import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import config from '../formkit.config'
import { useToast } from 'vue-toast-notification'

import App from './App.vue'
import router from './router'
import "vue-toast-notification/dist/theme-sugar.css"

// Configuración de las notificaciones
const $toast = useToast({
    duration: 5000,
    position: 'top-right'
});


const app = createApp(App)

// Se podría crear un store para tener la configuración de forma global
// En cambio, usamos provide - inject (para practicar)
app.provide("toast", $toast)

app.use(createPinia())
app.use(plugin, defaultConfig(config)) // FormKit
app.use(router)

app.mount('#app')
