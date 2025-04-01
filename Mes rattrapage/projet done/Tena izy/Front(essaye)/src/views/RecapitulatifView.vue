<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
//import Logout from '@/components/LogoutView.vue';

const route = useRoute();
const storedData = JSON.parse(localStorage.getItem('contribuableInfo'));
const activite = computed(() => storedData?.activite || 'Non spécifié');


const printPage = () => {
  window.print();
};


// Calcul de la TVA collectée (20% de la vente)
const tvaCollectee = computed(() => (route.query.vente * 0.2).toFixed(2));

// Calcul de la TVA déductible (20% des achats)
const tvaDeductible = computed(() => (route.query.achats * 0.2).toFixed(2));

onMounted(() => {
  console.log(route.query);
});
</script>
<template>
  <div class="app-container">
    <header class="header">
      <h1>Direction Générale des Impôts</h1>
    </header>

    <div class="page-container">
      <Navbar />
      <h1 class="text-center">RECEPISSE DE PAIEMENT</h1>

      <div class="border-container">
        <!-- Premier tableau -->
        <table class="general-info">
          <tr>
            <td><strong>NIF PAYEUR:</strong></td>
            <td>{{ route.query.nif }}</td>
          </tr>
          <tr>
            <td><strong>Nom PAYEUR:</strong></td>
            <td>{{ route.query.nomPayeur }}</td>
          </tr>
        </table>
        
        <table class="general-info">
          <tr>
            <td><strong>NUMERO RECEPISSE:</strong></td>
            <td>{{ route.query.numDecl }}</td>
          </tr>
          <tr>
            <td><strong>NIF :</strong></td>
            <td>{{ route.query.nif }}</td>
          </tr>
          <tr>
            <td><strong>Raison sociale :</strong></td>
            <td>{{ route.query.raisonsociale }}</td>
          </tr>
        </table>

        <!-- Deuxième tableau -->
        <table class="general-info">
          <tr>
            <td><strong>Activité:</strong></td>
            <td>{{ route.query.activite || activite }}</td>
          </tr>
          <tr>
            <td><strong>Vente:</strong></td>
            <td>{{ route.query.vente }}</td>
          </tr>
          <tr>
            <td><strong>Achat:</strong></td>
            <td>{{ route.query.achats }}</td>
          </tr>
          <tr>
            <td><strong>TVA payé:</strong></td>
            <td>{{ route.query.tvaAPayer }}</td>
          </tr>
          <tr>
            <td><strong>TVA collectée:</strong></td>
            <td>{{ tvaCollectee }}</td>
          </tr>
          <tr>
            <td><strong>TVA déductible:</strong></td>
            <td>{{ tvaDeductible }}</td>
          </tr>
          <tr>
            <td><strong>Date de paiement:</strong></td>
            <td>{{ route.query.datePaiement }}</td>
          </tr>
        </table>
      </div>
<div>
      <div class="text-center button-container">
        <button type="button" class="btn btn-primary btn-sm" @click="printPage">Imprimer</button>
      </div>
       
      </div>
    </div>
    
  </div>
</template>

<style scoped>
/* Réinitialisation de base */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* Conteneur principal */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  color: #333;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

/* Conteneur de la bordure autour des tableaux */
.border-container {
  border: 2px solid #1a5276;
  border-radius: 6px;
  padding: 10px;
  width: calc(100% - 40px);
  max-height: 60vh; /* Limite la hauteur totale */
  overflow-y: auto; /* Permet un défilement vertical si nécessaire */
  margin: 10px auto;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Tableaux d'informations */
.general-info {
  width: 100%;
  margin-bottom: 8px;
  border-collapse: separate;
  border-spacing: 0 4px;
}

/* Style des cellules du tableau */
.general-info tr, .general-info td {
  border: none;
  padding: 4px 8px;
}

/* Style de la première colonne */
.general-info td:first-child {
  width: 35%;
  background-color: #f8f9fa;
  font-weight: bold;
}

/* Style de la deuxième colonne */
.general-info td:last-child {
  background-color: #e9ecef;
}

/* Alignement de l'en-tête */
h1 {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 10px;
}

/* Alignement du texte */
.text-center {
  text-align: center;
}

/* Conteneur pour le bouton */
.button-container {
  margin-top: 20px; /* Espace supplémentaire pour séparer le bouton du contenu */
  display: flex;
  justify-content: center;
}

/* Style du bouton */
.btn-primary {
  background-color: #1a5276;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #154360;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Style pour l'en-tête */
.header {
  background-color: #1a5276;
  color: #ffffff;
  padding: 0.8rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 1.2rem;
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
