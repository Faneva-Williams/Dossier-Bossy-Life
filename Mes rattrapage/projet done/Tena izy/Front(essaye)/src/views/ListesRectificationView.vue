<script setup>
import Navbar from '@/components/Navbar.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Logout from '@/components/LogoutView.vue';

const listes = ref([]);
const showModal = ref(false);
const modalFileUrl = ref('');
const newAcceptation = ref(false)
let previousCountAcceptation = ref(localStorage.getItem('nombrePrecedentNotification'))
const differenceAcceptation = ref(0);

// Récupération des rectifications

const getRectification = async () => {
  try {
    const token = localStorage.getItem('token');
    //console.log(token)
    const response = await axios.get('http://localhost:2005/rectifications/listes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    //console.log(response.data)
    const currentAcceptation = response.data.count
    console.log('nombre actuelle:',currentAcceptation);
    listes.value = response.data.liste

    differenceAcceptation.value = (currentAcceptation-previousCountAcceptation.value)
    console.log('le nombre est:', differenceAcceptation.value)
    console.log('nombre avant la comparaison:', previousCountAcceptation.value)

    if(currentAcceptation > previousCountAcceptation.value ){
        newAcceptation.value = true;
    }

    else{
      newAcceptation.value = false;
    }

    previousCountAcceptation = currentAcceptation
    localStorage.setItem('nombrePrecedentNotification', previousCountAcceptation)
  } catch (error) {
    console.error('Erreur lors de la récupération des rectifications:', error.response.data);
  }
};

const refresh = () =>{
  getRectification();
}


// Ouvrir le modal
const openModal = (filePath) => {
  modalFileUrl.value = `http://localhost:2005/uploads/${filePath}`;
  showModal.value = true;
};

// Fermer le modal
const closeModal = () => {
  showModal.value = false;
  modalFileUrl.value = '';
};

// Chargement de la liste au montage du composant
onMounted(() => {
  getRectification();
});
</script>
<template>
  <main class="app-container">
    <header class="header">
      <h1>Direction Générale des Impôts</h1>
    </header>
    <Navbar />
    <div v-if="newAcceptation && differenceAcceptation > 0" class="notification-container-accepte">
      <p class="txt">La direction Général des impots a accepté votre demande de rectification</p>
      <button @click="refresh()" class="btn btn-info">Bien reçu</button>
    </div>
    
    <!-- Conteneur avec défilement -->
    <div class="table-container">
      <table class="table table-striped mt-3">
        <thead>
          <tr>
            <th scope="col">#</th>
           
             <th scope="col">Ligne errone</th>
            <th scope="col">Commentaire</th>
            <th scope="col">Fichier</th>
            <th scope="col">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(liste) in listes" :key="liste.id_rect">
            <td>{{ liste.id_rect }}</td>
            
            <td>{{ liste.ligne_erronee }}</td>
            <td>{{ liste.commentaire }}</td>
            
            <td>
              <a v-if="liste.file_path" @click.prevent="openModal(liste.file_path)" class="file-link">
                Voir le fichier
              </a>
            </td>
            <td>{{ liste.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <iframe :src="modalFileUrl" class="modal-iframe" frameborder="0"></iframe>
      </div>
    </div>
    
    <div class="action-panel">
      <Logout />
    </div>
  </main>
</template>

<style scoped>
.notification-container-accepte {
  background-color: #ce0707;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: center;
  color: #007bff;
} 
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  color: #333;
  background-color: #f5f5f5;
}
.header {
  background-color: #1a5276;
  color: #ffffff;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Conteneur de tableau avec défilement */
.table-container {
  max-height: 400px; /* Ajustez la hauteur selon vos besoins */
  overflow-y: auto; /* Barre de défilement verticale */
  margin-top: 20px; /* Espacement au-dessus du tableau */
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 800px; /* Set a max width for the modal */
  max-height: 80vh; /* Set a max height for the modal */
  overflow: hidden; /* Prevent scrolling within the modal */
  border-radius: 8px; /* Add rounded corners for a polished look */
}

.modal-iframe {
  width: 100%;
  height: 60vh; /* Adjust height as needed */
  border: none; /* Remove the default iframe border */
}

.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

.action-panel {
  position: fixed; /* Fixe le bouton en bas */
  bottom: 20px; /* Distance du bas de la fenêtre */
  right: 20px; /* Distance du côté droit de la fenêtre */
  margin-top: 0; /* Enlève la marge du haut */
  display: flex;
  justify-content: flex-end; /* Aligne le contenu à droite */
}

.btn-logout {
  background-color: #E74C3C; /* Rouge pour indiquer une action de déconnexion */
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-logout:hover {
  background-color: #C0392B; /* Couleur plus foncée au survol */
}

.btn-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}
</style>
