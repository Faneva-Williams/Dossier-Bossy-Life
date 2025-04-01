<script setup>
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const virements = ref([]);
const router = useRouter();

const nifCherche = ref("");

const listenVirement = async () => {
  try {
    const response = await axios.get("http://localhost:2005/virements/listens");
    virements.value = response.data.liste; // Récupère la liste des virements
  } catch (error) {
    console.error("Error fetching virements:", error);
  }
};

const searchVirement = async () => {
  try {
    const response = await axios.post(
      "http://localhost:2005/virements/recherche",
      {
        nif: nifCherche.value, // Utilisez params ici
      }
    );
    console.log(response);
    virements.value = response.data.data; // Mettez à jour la liste des virements avec les résultats de recherche
  } catch (error) {
    console.error("Error searching virements:", error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Formats date to YYYY-MM-DD
};

onMounted(() => {
  listenVirement();
});
</script>

<template>
  <Sidebar />
  <div class="corp">
    <h1 class="title">Liste des paiements</h1>
    <div class="search-container">
      <input
        type="text"
        v-model="nifCherche"
        placeholder="Rechercher par NIF"
        @input="searchVirement"
      />
      <button @click="searchVirement" class="btn btn-primary">
        Rechercher
      </button>
    </div>
    <div class="layout">
      <div class="table-container">
        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">Nif</th>
              <th scope="col">Raison Sociale</th>
              <th scope="col">Nif Payeur</th>
              <th scope="col">Nom Payeur</th>
              <th scope="col">Date de Paiement</th>
              <th scope="col">Compte Bancaire</th>
              <th scope="col">Montant à payer</th>
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
              <td>{{ virement.tvaAPayer }} Ariary</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="button-container">
      <RouterLink to="/admin/home" class="back-btn">Retour</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.corp {
  margin-top: -600px;
  margin-left: -100px;
  height: calc(100vh - 50px);
  overflow-y: hidden;
  overflow-x: hidden;
  margin-left: 30px;
}

.title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin: 20px 0;
  text-transform: uppercase;

  padding-bottom: 10px;
  margin-top: 20px;
}

.layout {
  display: flex;
  justify-content: center; /* Centre horizontalement les éléments */
  margin: 0 auto; /* Centre le conteneur lui-même */
  max-width: 100%; /* Permet au conteneur d'utiliser toute la largeur disponible */
  margin-left: 200px; /* Augmentez cette valeur pour déplacer plus à gauche */
  margin-right: -5px; /* Augmentez cette valeur pour déplacer plus à gauche */
}

.table-container {
  width: 100%; /* Augmente la largeur pour prendre plus d'espace */
  padding: 20px;
  background-color: #f8f9fa;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Scrollbar uniquement pour le conteneur de table */
  max-height: calc(
    100vh - 300px
  ); /* Ajuste la hauteur pour s'adapter à l'écran */
  margin-left: 20px;
  margin: 1rem auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.button-container {
  position: static; /* Changé de fixed à static */
  margin-top: 20px;
  text-align: center;
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
thead th {
  background-color: #007bff;
  color: #fff;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
  padding: 8px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
.back-btn {
  margin-top: -30px; /* manakisaka tableau*/
  padding: 10px 20px;
  background-color: gray;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-container input {
  margin-right: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
