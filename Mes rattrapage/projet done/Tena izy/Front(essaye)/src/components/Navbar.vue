<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { io } from 'socket.io-client'; // Add this line
import axios from 'axios';
const teste = ()=>{
  alerte('teste')
}

const isModalVisible = ref(false); // Référence pour contrôler la modal

const shadowModalNotif = () => {
  isModalVisible.value = true; // Afficher la modal
};

const closeModalNotif = () => {
  isModalVisible.value = false; // Fermer la modal
  getRectification();
  location.reload(); // Recharger la page
};

const listes = ref([]);
const showModal = ref(false);
const modalFileUrl = ref('');
const newAcceptation = ref(false)
let previousCountAcceptation = ref(localStorage.getItem('nombrePrecedentNotification'))
const differenceAcceptation = ref(0);
//refuseeee
const newRefuse = ref(false)
let previousCountRefuse = ref(localStorage.getItem('nombrePrecedentRefuseDemande'))
const differenceNombreRefuse = ref(0)


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
    const currentNombreRefuse = response.data.countRefuse
    console.log('nombre refuse Actuelle:', currentNombreRefuse);
    console.log('nombre actuelle:',currentAcceptation);
    listes.value = response.data.liste

    differenceAcceptation.value = (currentAcceptation-previousCountAcceptation.value)

    differenceNombreRefuse.value = (currentNombreRefuse-previousCountRefuse.value)
    
    console.log('le nombre difference accepte est:', differenceAcceptation.value)
     console.log('le nombre difference refuse est:', differenceNombreRefuse.value)
    console.log('nombre avant la comparaison:', previousCountAcceptation.value)

    if(currentAcceptation > previousCountAcceptation.value ){
        newAcceptation.value = true;
    }

    else if(currentAcceptation <= previousCountAcceptation){
      newAcceptation.value = false;
    }

    else if(currentNombreRefuse > previousCountRefuse.value){
      newRefuse.value = true;
    }

    else
      {
        newRefuse.value = false;
      }
    previousCountAcceptation = currentAcceptation;
    previousCountRefuse = currentNombreRefuse;
    localStorage.setItem('nombrePrecedentNotification', previousCountAcceptation)
    localStorage.setItem('nombrePrecedentRefuseDemande', previousCountRefuse)
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
onMounted(()=> {
  getRectification();
}
)

</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <RouterLink to="/home" class="navbar-brand">Espace Contribuable</RouterLink>
      <button class="navbar-toggler">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-menu">
        <RouterLink to="/home" class="navbar-item" >Accueil</RouterLink>
        <RouterLink to="/about" class="navbar-item" >Déclarations</RouterLink>
        <RouterLink to="/paiement" class="navbar-item">Paiement</RouterLink>
        <RouterLink to="/rectification" class="navbar-item">Rectification</RouterLink>
        <a
  :class="['nav-link nav-icon', { 'has-notification': newAcceptation || newRefuse }]"
  href="#"
  @click.prevent="shadowModalNotif"
>
  <i class="bi bi-bell">
    <span class="badge bg-primary badge-number"></span>
  </i>
</a>


          

        <RouterLink to="/admin/login" class="navbar-item admin-link" @click="isMenuOpen = false">
          <span class="admin-icon">&#128100;</span>
          Admin
        </RouterLink>
      </div>
    </div>

    <!-- Affichage du modal de notification -->
  </nav>
   <div v-if="isModalVisible" class="modal-overlay" @click="closeModalNotif">
    <div class="modal-content" @click.stop>
      <h3 >Notifications</h3>
      <p  v-if="newAcceptation && differenceAcceptation>0" class="txt">La direction Général des impots a accepté votre demande de rectification</p>
      <p  v-if="newRefuse && differenceNombreRefuse>0" class="txt">La direction Général des impots a refusé votre demande de rectification pour une certaine raison</p>
      <p v-else>Aucune notification</p>
       <!--<p v-else class="txt">Auccune notification</p> -->
      <!-- Ajoutez le contenu de votre notification ici -->
      <button @click="closeModalNotif">Fermer</button>
    </div>
  </div>
  <RouterView />
</template>
<style scoped>
.navbar {
  background-color: #1a5276;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-brand {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  align-items: center;
  margin-left: auto; /* Aligns the menu to the right */
}

.navbar-item {
  color: #ffffff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
}


.fa-bell {
  font-size: 1.2rem;
  color: white; /* Ajustez la couleur si besoin */
}
.navbar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.admin-link {
  background-color: #27AE60;
  border-radius: 5px;
  margin-left: 1rem;
}

.admin-icon {
  margin-right: 0.5rem;
}

.navbar-toggler {
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .navbar-menu {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 1rem;
  }

  .navbar-menu.is-active {
    display: flex;
  }

  .navbar-item {
    width: 100%;
    padding: 0.75rem 0;
  }

  .admin-link {
    margin: 0.75rem 0 0 0;
  }

  .navbar-toggler {
    display: block;
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Pour s'assurer qu'il est au-dessus des autres éléments */
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.notification-badge {
  background-color: #dc3545; /* Couleur de fond pour le badge */
  color: white; /* Couleur du texte du badge */
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.notification-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  margin-top: 0.5rem;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
}
@keyframes shake {
  0% { transform: translate(0); }
  25% { transform: translate(-2px, 0); }
  50% { transform: translate(2px, 0); }
  75% { transform: translate(-2px, 0); }
  100% { transform: translate(0); }
}

.has-notification {
  color: red; /* Changer la couleur en rouge */
  animation: shake 0.5s; /* Appliquer l'animation */
}


</style>
