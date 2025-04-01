<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Sidebar from "@/components/Sidebar.vue";

const rectifications = ref([]);
const newRectification = ref(false);
let previousCount = localStorage.getItem("nombrePrecedent") || 0;
const difference = ref(0);
const fichier = ref();
const nifCherche = ref("");

const isFileModalOpen = ref(false);
const fileUrl = ref("");

const isModalOpen = ref(false);
const selectedRectification = ref({});

const isApprovalModalOpen = ref(false); // Modal for approval confirmation
const isRejectionModalOpen = ref(false); // Modal for rejection confirmation
const pendingActionId = ref(null); // To store the ID of the rectification pending action

const openModal = async (rectification) => {
  selectedRectification.value = rectification;
  isModalOpen.value = true;
  difference.value--;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedRectification.value = {};
};

const openFileModal = () => {
  fileUrl.value = `http://localhost:2005/uploads/${selectedRectification.value.file_path}`;
  isFileModalOpen.value = true;
};

const closeFileModal = () => {
  isFileModalOpen.value = false;
  fileUrl.value = "";
};

const openApprovalModal = (id) => {
  pendingActionId.value = id;
  isApprovalModalOpen.value = true;
};

const closeApprovalModal = () => {
  isApprovalModalOpen.value = false;
  pendingActionId.value = null;
};

const openRejectionModal = (id) => {
  pendingActionId.value = id;
  isRejectionModalOpen.value = true;
};

const closeRejectionModal = () => {
  isRejectionModalOpen.value = false;
  pendingActionId.value = null;
};

const approuver = async () => {
  if (pendingActionId.value) {
    await axios.patch(
      `http://localhost:2005/rectifications/approuver/${pendingActionId.value}`
    );
    closeApprovalModal();
    closeModal(); // Fermer le modal de détails
    await afficheRectification(); // Actualiser la liste après approbation
  }
};

const searchVirement = async () => {
  try {
    const response = await axios.post(
      "http://localhost:2005/rectifications/recherche",
      {
        nif: nifCherche.value, // Utilisez params ici
      }
    );
    console.log(response);
    rectifications.value = response.data.data; // Mettez à jour la liste des virements avec les résultats de recherche
  } catch (error) {
    console.error("Error searching virements:", error);
  }
};
const refuser = async () => {
  if (pendingActionId.value) {
    await axios.patch(
      `http://localhost:2005/rectifications/refuser/${pendingActionId.value}`
    );
    closeRejectionModal();
    closeModal(); // Fermer le modal de détails
    await afficheRectification(); // Actualiser la liste après refus
  }
};

const afficheRectification = async () => {
  try {
    const res = await axios.get("http://localhost:2005/rectifications/listens");
    const currentRectifications = res.data.count;

    rectifications.value = res.data.liste.map((rectification) => ({
      ...rectification,
      isNew: false,
    }));

    difference.value = currentRectifications - previousCount;

    if (currentRectifications > previousCount) {
      newRectification.value = true;
    } else {
      newRectification.value = false;
    }

    previousCount = currentRectifications;
    localStorage.setItem("nombrePrecedent", previousCount);
  } catch (error) {
    console.error("Erreur lors de la récupération des rectifications:", error);
  }
};

onMounted(() => {
  afficheRectification();
});
</script>

<template>
  <Sidebar />
  <div class="corp">
    <div class="notification-wrapper">
      <div
        v-if="newRectification && difference > 0"
        class="notification-container-accepte"
      >
        <p class="txt">{{ difference }} nouveaux demandes non lues.</p>
      </div>
      <div v-if="!newRectification" class="notification-container">
        <p>Aucune nouvelle demande de rectification</p>
      </div>
    </div>
    <div>
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
          <h1 class="title">Les demandes de rectifications</h1>

          <table class="table table-sm">
            <thead>
              <tr>
                <th scope="col">Nif</th>
                <th scope="col">Raison Sociale</th>
                <th scope="col">Types de rectification</th>
                <th scope="col">Commentaires</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(rectification, index) in rectifications"
                :key="index"
                :class="{
                  'new-rectification': index < difference && difference > 0,
                }"
              >
                <td>{{ rectification.nif }}</td>
                <td>{{ rectification.raisonsociale }}</td>
                <td>{{ rectification.ligne_erronee }}</td>
                <td>{{ rectification.commentaire }}</td>
                <td>
                  <button
                    class="btn btn-success"
                    @click="openModal(rectification)"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal for viewing rectification details -->
      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h5 class="card-title text-center mb-4">
            Détails de la Rectification
          </h5>
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label"
                >NIF : {{ selectedRectification.nif }}</label
              >
            </div>
            <div class="col-12">
              <label class="form-label"
                >Raison Sociale :
                {{ selectedRectification.raisonsociale }}</label
              >
            </div>
            <div class="col-12">
              <label class="form-label"
                >Type de Rectification :
                {{ selectedRectification.ligne_erronee }}</label
              >
            </div>
            <div class="col-12">
              <label class="form-label"
                >Commentaire : {{ selectedRectification.commentaire }}</label
              >
            </div>
            <div class="col-12">
              <label class="form-label">Emplacement du Fichier :</label>
              <div v-if="!selectedRectification.fichier">
                <a
                  :href="`http://localhost:2005/uploads/${selectedRectification.file_path}`"
                  @click.prevent="openFileModal"
                  target="_blank"
                  class="file-link text-primary"
                >
                  Voir le fichier
                </a>
              </div>
              <div v-else>
                <p>Aucun fichier disponible.</p>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center mt-4">
            <button
              type="button"
              @click="openApprovalModal(selectedRectification.id_rect)"
              class="btn btn-secondary mx-2"
            >
              Approuver
            </button>
            <button
              type="button"
              @click="openRejectionModal(selectedRectification.id_rect)"
              class="btn btn-danger mx-2"
            >
              Refuser
            </button>
          </div>
        </div>
      </div>

      <!-- Modal for file viewing -->
      <div v-if="isFileModalOpen" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeFileModal">&times;</span>
          <h5 class="text-center mb-4">Visualiser le Fichier</h5>
          <iframe
            :src="fileUrl"
            style="width: 100%; height: 400px"
            frameborder="0"
          ></iframe>
        </div>
      </div>

      <!-- Modal for approval confirmation -->
      <div v-if="isApprovalModalOpen" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeApprovalModal">&times;</span>
          <p>Voulez-vous vraiment approuver cette déclaration ?</p>
          <div class="d-flex justify-content-center mt-4">
            <button class="btn btn-success mx-2" @click="approuver">Oui</button>
            <button class="btn btn-danger mx-2" @click="closeApprovalModal">
              Non
            </button>
          </div>
        </div>
      </div>

      <!-- Modal for rejection confirmation -->
      <div v-if="isRejectionModalOpen" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeRejectionModal">&times;</span>
          <p>Voulez-vous vraiment refuser cette déclaration ?</p>
          <div class="d-flex justify-content-center mt-4">
            <button class="btn btn-success mx-2" @click="refuser">Oui</button>
            <button class="btn btn-danger mx-2" @click="closeRejectionModal">
              Non
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-wrapper {
  margin-left: 300px; /* Ajustez cette valeur selon vos besoins */
  margin-right: 300px; /* Ajustez cette valeur selon vos besoins */
  padding: 10px;
  position: relative; /* Pour un positionnement éventuel */
}

.notification-container-accepte {
  background-color: #d4edda; /* Exemple de fond pour notifications acceptées */
  color: #155724; /* Exemple de couleur de texte */
  border: 1px solid #c3e6cb; /* Bordure pour les notifications */
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px; /* Espacement entre notifications */
}

.notification-container {
  background-color: #f8d7da; /* Exemple de fond pour notifications sans nouvelles */
  color: #721c24; /* Exemple de couleur de texte */
  border: 1px solid #f5c6cb; /* Bordure pour notifications */
  border-radius: 5px;
  padding: 15px;
}

.corp {
  margin-top: -600px;
  margin-left: -100px;
  height: calc(100vh - 50px);
  overflow-y: hidden;
  overflow-x: hidden;
  margin-left: 30px;
}

.notification-container {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: center;
  color: #007bff;
}
.notification-container-accepte {
  background-color: #ce0707;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: center;
  color: #007bff;
}
.title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin: 20px 0;
  text-transform: uppercase;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
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

.btn-success {
  border-radius: 25px;
  padding: 6px 12px;
  transition: background-color 0.3s, transform 0.2s;
}
.btn-success:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.new-rectification {
  background-color: #e8f0fe;
  color: #333;
  font-weight: bold;
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
  background-color: rgba(0, 0, 0, 0.7);
}
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
}
.close {
  cursor: pointer;
  float: right;
  font-size: 20px;
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
  margin-left: 20px; /* Ajustez cette marge selon votre besoin */
}
</style>
