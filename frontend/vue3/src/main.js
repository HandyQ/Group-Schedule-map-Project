import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueGoogleMaps from '@fawmi/vue-google-maps'

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyCiffWzfj6qZDHdaGN4pnyQ-jwdWr_UKmQ',
      libraries: "places"
    }
  })
  .mount('#app')
