import './assets/main.css'

import { createApp } from 'vue'
// import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import SearchBar from './components/SearchBar.vue'

const app = createApp(App)
// const pinia = createPinia()

app.component('SearchBar', SearchBar)
// app.use(pinia)
app.use(router)

app.mount('#app')
