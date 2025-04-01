<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Logout from '@/components/LogoutView.vue';

const router = useRouter();
const listes = ref([]);
const filteredListes = ref([]);
const searchYear = ref('');
const years = ref([]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

// Filter by year
const filterByYear = () => {
  if (!searchYear.value) {
    filteredListes.value = listes.value; // Affiche toutes les déclarations si aucune année n'est sélectionnée
    return;
  }

  filteredListes.value = listes.value.filter(liste => {
    const year = new Date(liste.periode).getFullYear(); // Supposons que `periode` est une date
    return year === parseInt(searchYear.value);
  });
};

// Fetch available years
const fetchYears = () => {
  const currentYear = new Date().getFullYear();
  years.value = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
};

// Fetch declarations
const listeDeclaration = async () => {
  
   const token = localStorage.getItem('token'); // Récupérer le token

  const response = await axios.get('http://localhost:2005/declarations/listes', {
    headers: {
        Authorization: `Bearer ${token}` // Ajouter le token dans l'en-tête
      }
  });
   
  listes.value = response.data.liste;
  filteredListes.value = listes.value; // Initialisation avec toutes les déclarations
};




// Select declaration and navigate
const selectDeclaration = (declarationId) => {
  const selectedDeclaration = listes.value.find(liste => liste.num_decl === declarationId);
  const { nif, raisonsociale, vente, achats, activite, tvaAPayer } = selectedDeclaration;

 const tva = tvaAPayer;
  // Redirect with additional data
  router.push({
    name: 'virement',
    query: {
      num_decl: declarationId,
      nif,
      raisonsociale,
      vente,
      achats,
      activite,
      tvaAPayer,
    }
  });
};


onMounted(() => {
  listeDeclaration();
  fetchYears();
});
</script>
<template>
  <div class="app-container">
    <header class="header">
      <h1>Direction Générale des Impôts</h1>
    </header>
    <Navbar />
    <div class="content-container">
      <main class="main-content">
        <h3 class="title">Liste de mes déclarations</h3>
        
        <!-- Barre de recherche centrée -->
        <div class="search-container-centered">
          <label for="search-year" class="search-label">Année:</label>
          <select id="search-year" v-model="searchYear" class="search-input">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
          <button @click="filterByYear" class="btn btn-primary">Rechercher</button>
        </div>

        <div class="table-wrapper">
          <table class="table table-sm">
            <thead>
              <tr>
                <th scope="col">Numéro</th>
                <th scope="col">NIF</th>
                <th scope="col">Raison Sociale</th>
                <th scope="col" class="action">Période</th>
                <th scope="col">Vente</th>
                <th scope="col">Achats</th>
                <th scope="col">TVA (Calculée)</th>
                <th scope="col" class="action">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(liste, index) in filteredListes" :key="liste.num_decl">
                <td>{{ index + 1 }}</td>
                <td>{{ liste.nif }}</td>
                <td>{{ liste.raisonsociale }}</td>
                <td>{{ formatDate(liste.periode) }}</td>
                <td>{{ liste.vente }}</td>
                <td>{{ liste.achats }}</td>
                <td>{{ liste.tvaAPayer }}</td>
                <td class="action-cell">
                  <button @click="selectDeclaration(liste.num_decl)" class="btn btn-primary">Payer</button>
                  <RouterLink :to="{ name: 'about' }" class="btn btn-primary">Annuler</RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="action-buttons">
          <RouterLink :to="{ name: 'about' }"></RouterLink>
            
        </div>
      </main>
       <div class="action-panel">
            <Logout/>
        </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
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

.search-container-centered {
  display: flex;
  align-items: center; /* Aligner verticalement au centre */
  justify-content: center; /* Aligner horizontalement au centre */
  gap: 10px; /* Ajout d'un espacement entre les éléments */
  margin: 20px 0;
}

.search-label {
  font-size: 1rem;
  margin-right: 5px;
}

.search-input {
  font-size: 1rem;
  padding: 8px 12px;
  height: 38px; /* Même hauteur que le bouton pour aligner */
  border-radius: 5px;
}

.btn-primary {
  padding: 8px 12px;
  font-size: 1rem;
  height: 38px; /* Même hauteur que le champ de sélection */
  line-height: 1;
  cursor: pointer;
}


.table-wrapper {
  margin: 1rem auto;
  max-height: 300px;
  overflow-y: auto;
  width: 80%;
  max-width: 1200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.table th,
.table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.action-cell {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding: 0 10%;
}


.btn-secondary {
  background-color: #6c757d;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.table th,
.table td {
  border: 1px solid #007bff;
}
.title {
  font-size: 2rem; /* Taille de la police */
  font-weight: bold; /* Texte en gras */
  color: #1A5276; /* Couleur bleu foncé */
  text-align: center; /* Centrage du texte */
  margin-bottom: 20px; /* Espace sous le titre */
  padding-bottom: 10px; /* Espace sous le texte pour souligner */
  text-transform: uppercase; /* Texte en majuscules */
  letter-spacing: 1px; /* Espacement entre les lettres */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Ombre pour un effet de profondeur */
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
