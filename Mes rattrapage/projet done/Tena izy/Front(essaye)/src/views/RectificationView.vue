<script setup>
import Navbar from '@/components/Navbar.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import Logout from '@/components/LogoutView.vue';
import Swal from 'sweetalert2';

const nif = ref('');
const raisonsociale = ref('');
const ligne_erronee = ref('');
const commentaire = ref('');
const file = ref(null);
const rectifications = ref([]);

// Nouvelle fonction pour charger les informations du contribuable
const loadContribuableInfo = () => {
  const contribuableInfo = JSON.parse(localStorage.getItem('contribuableInfo'));
  if (contribuableInfo) {
    nif.value = contribuableInfo.nif;
    raisonsociale.value = contribuableInfo.raisonsociale;
  }
};

// Gestion de l'upload du fichier
const handleFileUpload = (event) => {
  file.value = event.target.files[0];
};

// Méthode pour soumettre la rectification
const submitRectification = async () => {
  const formData = new FormData();
  formData.append('nif', nif.value);
  formData.append('raisonsociale', raisonsociale.value);
  formData.append('ligne_erronee', ligne_erronee.value);
  formData.append('commentaire', commentaire.value);
  if (file.value) {
    formData.append('file', file.value);
  }

  try {
    const response = await axios.post('http://localhost:2005/rectifications/ajout', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    Swal.fire({
  position: "top-center",
  icon: "success",
  title: "Votre demande de rectification est bien envoyé",
  showConfirmButton: false,
  timer: 1500
});
    //fetchRectifications(); // Recharger la liste après ajout
    resetForm(); // Réinitialiser le formulaire
  } catch (error) {
    
   Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Il y a une erreur , veuillez refaire votre demande",
});
  }
};

// Récupérer la liste des rectifications
/*const fetchRectifications = async () => {
  try {
    const response = await axios.get('http://localhost:2005/rectifications');
    rectifications.value = response.data.liste; // Assurez-vous que la structure de la réponse correspond
  } catch (error) {
    console.error('Erreur lors du chargement des rectifications :', error);
  }
};*/

// Réinitialiser le formulaire
const resetForm = () => {
  ligne_erronee.value = '';
  commentaire.value = '';
  file.value = null;
  // Ne réinitialisez pas nif et raisonsociale
};

// Charger la liste des rectifications et les infos du contribuable au montage du composant
onMounted(() => {
  loadContribuableInfo();
  //fetchRectifications();
});
</script>

<template>
  <main class="app-container">
    <header class="header">
        <h1>Direction Générale des Impôts</h1>
    </header>
    <Navbar />
    <div class="corps">
    <div class="rectification-page">
      <h2>Demande de rectification de TVA</h2>
      <form @submit.prevent="submitRectification" enctype="multipart/form-data" class="rectification-form">
        <div class="form-group">
          <label for="nif">NIF</label>
          <input v-model="nif" type="text" id="nif" required readonly />
        </div>
        <div class="form-group">
          <label for="raisonsociale">Raison Sociale</label>
          <input v-model="raisonsociale" type="text" id="raisonsociale" required readonly />
        </div>
        <div class="form-group">
          <label for="ligne_erronee">Ligne Erronée</label>
          <select id="ligne_erronee" class="form-select" v-model="ligne_erronee" required>
            <option value="">Sélectionnez le type d'erreur</option>
            <option value="Erreurs de calcul">Erreurs de calcul</option>
            <option value="Erreurs de saisie">Erreurs de saisie</option>
            <option value="Prise en compte d'opérations hors période">Prise en compte d'opérations hors période</option>
            <option value="Omission de certaines opérations">Omission de certaines opérations</option>
          </select>
        </div>
        <div class="form-group">
          <label for="commentaire">Commentaire</label>
          <textarea v-model="commentaire" id="commentaire" required rows="4"></textarea>
        </div>
        <div class="form-group">
          <label for="file">Fichier à joindre (facultatif)</label>
          <input type="file" id="file" @change="handleFileUpload" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Soumettre la rectification</button>
          <RouterLink to='/listes/rectification'>
            <button type="button" class="btn btn-primary" @click="fetchRectifications">Voir la Liste des Rectifications</button>
          </RouterLink>
        </div>
         <div class="action-panel">
            <Logout/>
        </div>
      </form>

      <div v-if="rectifications.length" class="table-container">
        <h1>Liste de mes Rectifications</h1>
        <table class="rectifications-table">
          <thead>
            <tr>
              <th>#</th>
              <th>NIF</th>
              <th>Raison Sociale</th>
              <th>Ligne Erronée</th>
              <th>Commentaire</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rectification, index) in rectifications" :key="rectification.id_rect">
              <td>{{ index + 1 }}</td>
              <td>{{ rectification.nif }}</td>
              <td>{{ rectification.raisonsociale }}</td>
              <td>{{ rectification.ligne_erronee }}</td>
              <td>{{ rectification.commentaire }}</td>
              <td>{{ rectification.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
  </div>
  </main>
</template>


<style scoped>

* {
  box-sizing: border-box;
}
.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: 'Arial', sans-serif;
    color: #333;
    background-color: #f5f5f5;
}

.corps {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5; /* Light background for the whole page */
}

.rectification-page {
  overflow: hidden; /* Prevents internal scrolling */
  padding: 20px;
}

h2 {
  color: #1a5276; /* Main heading color */
}

.rectification-form {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  gap: 15px; /* Spacing between elements */
  background-color: #ffffff; /* White background for the form */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px; /* Space between form and table */
}

.form-group {
  margin-bottom: 0; /* Remove extra bottom margins */
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%; /* Full width for inputs */
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

textarea {
  resize: none; /* Prevents resizing of textarea */
}

.form-actions {
    display: flex; /* Utilisation de Flexbox pour aligner les boutons */
    justify-content: space-between; /* Espace entre les boutons */
    margin-top: 20px; /* Espace au-dessus des boutons */
}

.btn {
    background-color: #1a5276; /* Couleur principale correspondant au header */
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px; /* Taille de police accrue */
    transition: background-color 0.3s, transform 0.3s; /* Ajout de transition pour un effet de survol */
    margin-right: 10px; /* Espace entre les boutons */
}

.btn:last-child {
    margin-right: 0; /* Supprime l'espace à droite du dernier bouton */
}

.btn:hover {
    background-color: #155a8a; /* Couleur plus foncée au survol */
    transform: translateY(-2px); /* Légère élévation au survol */
}

.btn-secondary {
    background-color: #28a745; /* Couleur secondaire différente pour le second bouton */
}

.btn-secondary:hover {
    background-color: #218838; /* Couleur plus foncée au survol */
}


.wide-btn {
  width: 100%; /* Full width for buttons */
  display: block; /* Ensures block-level rendering */
  margin-top: 10px; /* Additional top margin */
}

.table-container {
  margin-top: 30px; /* Space above table */
  overflow-x: auto; /* Horizontal scroll if needed */
  width: 100%;
}

.rectifications-table {
  width: 100%; /* Full width for table */
  border-collapse: collapse; /* Merge borders */
}

.rectifications-table th,
.rectifications-table td {
  padding: 10px;
  border: 1px solid #ddd; /* Light border */
  text-align: left;
}

.rectifications-table th {
  background-color: #f2f2f2; /* Light gray for header */
}

.rectifications-table tbody tr:hover {
  background-color: #f1f1f1; /* Highlight on row hover */
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
