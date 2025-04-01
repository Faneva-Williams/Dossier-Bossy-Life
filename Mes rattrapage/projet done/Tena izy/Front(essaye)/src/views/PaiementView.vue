<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import { useRouter } from 'vue-router';
import Logout from '@/components/LogoutView.vue';
const router = useRouter();
const listes = ref([]); 
const virements = ref([]); // État pour les virements
const searchYear = ref('');




const listeVirement = async () => {
     const token = localStorage.getItem('token'); // Récupérer le token
    const response = await axios.get('http://localhost:2005/virements/listes',{
        headers: {
        Authorization: `Bearer ${token}` // Ajouter le token dans l'en-tête
      }
    });
    virements.value = response.data.liste; // Récupère la liste des virements
}
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
const fetchYears = () => {
  const currentYear = new Date().getFullYear();
  years.value = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
};

// Function to format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Formats date to YYYY-MM-DD
}

onMounted(() => {
    listeVirement();
});
</script>
<template>
<main class="app-container">
    <header class="header">
        <h1>Direction Générale des Impôts</h1>
    </header>
    <Navbar />
    
    <div class="info-section">
        <h4>Paiement des Impôts</h4>
        <ol>
            <li>Consultez d'abord les déclarations d'impôts à payer.</li>
            <li>Cliquez sur <strong>« Payer »</strong> pour être ajouté à l'ordre de virement directement.</li>
        </ol>
    </div>

    <div class="declarations">
        <router-link to="/declaration" class="declaration-link">
            ----> Liste des déclarations des impôts <----- 
        </router-link>
    </div>

    <!-- Tableau des virements avec barre de défilement à l'intérieur -->
    <div class="virements-section">
        <h4>Liste des Virements</h4>
        
        <div class="table-scroll-container"> <!-- Ajout du conteneur défilable -->
            <table class="table table-bordered payment-table">
                <thead>
                    <tr>
                        <th scope="col">NIF</th>
                        <th scope="col">Raison Sociale</th>
                        <th scope="col">NIF du Payeur</th>
                        <th scope="col">Nom du Payeur</th>
                        <th scope="col">Date de Paiement</th>
                        <th scope="col">Compte bancaire</th>
                        <th scope="col">TVA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(virement, index) in virements" :key="index">
                        <td>{{ virement.nif }}</td>
                        <td>{{ virement.raisonsociale }}</td>
                        <td>{{ virement.nifPayeur }}</td>
                        <td>{{ virement.nomPayeur }}</td>
                        <td>{{ formatDate(virement.datePaiement) }}</td>
                        <td>{{ virement.comptebancaire }}</td>
                        <td>{{  virement.tvaAPayer }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="action-panel">
        <Logout/>
    </div>
</main>
<footer></footer>
</template>

<style scoped>
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

.info-section {
    padding: 15px;
    background-color: #ffffff; 
    border: 1px solid #1a5276; 
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
    margin-bottom: 10px;
}

.info-section:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.info-section h4 {
    margin-bottom: 10px;
    font-size: 1.5rem;
    color: #1a5276; 
}

.info-section ol {
    padding-left: 20px;
}

.info-section li {
    font-size: 1rem;
    margin-bottom: 8px;
    color: #555;
}

.declarations {
    margin: 0;
    padding: 0;
}

.declaration-link {
    display: block;
    padding: 10px;
    background-color: #1a5276; 
    color: white;
    text-align: center;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s;
    font-size: 1.1rem;
    margin-bottom: 0;
}

.declaration-link:hover {
    background-color: #155a8a; 
}

/* Ajout de styles pour la table */
.payment-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.payment-table th,
.payment-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.payment-table th {
    background-color: #f2f2f2;
}

/* Conteneur pour le défilement dans le tableau */
.table-scroll-container {
    max-height: 200px; /* Hauteur réduite pour permettre le bouton de déconnexion visible */
    overflow-y: auto;
}

.action-panel {
    position: fixed; 
    bottom: 20px; 
    right: 20px; 
    display: flex;
    justify-content: flex-end; 
}

.btn-logout {
    background-color: #E74C3C; 
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
    background-color: #C0392B; 
}

.btn-icon {
    margin-right: 0.5rem;
    font-size: 1.2rem;
}
</style>
