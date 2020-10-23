import Buefy from 'buefy';
import Vue from 'vue';
import App from './App.vue'
import 'buefy/dist/buefy.css';
import VueSimpleAlert from "vue-simple-alert";
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(VueSimpleAlert);

new Vue({
  render: h => h(App),
}).$mount('#app')
