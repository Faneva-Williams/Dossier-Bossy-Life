// Importation des styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

// Configuration de FontAwesome
library.add(faBell);

// Création de l'application Vue
const app = createApp(App);

// Enregistrement du composant FontAwesomeIcon
app.component('font-awesome-icon', FontAwesomeIcon);

// Utilisation du router
app.use(router);

// Montage de l'application
app.mount('#app');
