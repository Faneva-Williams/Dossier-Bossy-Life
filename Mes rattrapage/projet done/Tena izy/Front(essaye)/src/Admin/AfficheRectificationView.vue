<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const id = ref(route.params.id_rect);
const nif = ref();
const raisonSociale = ref();
const commentaire = ref();
const type = ref();
const fichier = ref();
const showModal = ref(false); // État pour afficher ou masquer la modal

const AfficheRectification = async () => {
  try {
    const response = await axios.get(`http://localhost:2005/rectifications/edit/${id.value}`);
    const data = response.data.data;

    id.value = data.id_rect;
    nif.value = data.nif;
    raisonSociale.value = data.raisonsociale;
    commentaire.value = data.commentaire;
    fichier.value = data.file_path; // Assurez-vous que c'est uniquement le nom du fichier
    type.value = data.ligne_erronee;
  } catch (error) {
    console.error('Erreur lors de la récupération de la rectification:', error);
  }
};

const approuver = async () => {
  if (confirm('Voulez-vous Approuver ce declaration?')) {
    const response = await axios.patch(`http://localhost:2005/rectifications/approuver/${id.value}`);
    alert(response.data.message);
  }
};

const refuser = async () => {
  if (confirm('Voulez-vous Supprimer cette declaration?')) {
    const response = await axios.patch(`http://localhost:2005/rectifications/refuser/${id.value}`);
    alert(response.data.message);
  }
};

const toggleModal = () => {
  showModal.value = !showModal.value; // Basculer l'état de la modal
};

onMounted(() => {
  AfficheRectification();
});
</script>

<template>
  <main>
    <div class="card mt-3 shadow">
      <div class="card-body">
        <h5 class="card-title text-center mb-4">Détails de la Rectification</h5>

        <form class="row g-3">
          <div class="col-6">
            <label for="inputNanme4" class="form-label">Id : {{ id }}</label>
          </div>
          <div class="col-12">
            <label for="inputEmail4" class="form-label">NIF : {{ nif }}</label>
          </div>
          <div class="col-12">
            <label for="inputPassword4" class="form-label">Raison Sociale : {{ raisonSociale }}</label>
          </div>
          <div class="col-12">
            <label for="inputAddress" class="form-label">Type de Rectification : {{ type }}</label>
          </div>
          <div class="col-12">
            <label for="inputAddress" class="form-label">Commentaire : {{ commentaire }}</label>
          </div>
          <div class="col-12">
            <label class="form-label">Emplacement du Fichier :</label>
            <a v-if="fichier" @click="toggleModal()" class="file-link text-primary" style="cursor: pointer;">
              Voir le fichier
            </a>
          </div>

          <div class="d-flex justify-content-center mt-4">
            <button type="button" @click="approuver()" class="btn btn-secondary mx-2" style="max-width: 150px;">Approuver</button>
            <button type="reset" @click="refuser()" class="btn btn-danger mx-2" style="max-width: 150px;">Refuser</button>
          </div>

          <div class="d-flex justify-content-center mt-2">
            <RouterLink to="/admin/listes/rectifications" class="btn btn-primary" style="max-width: 150px;">Annuler</RouterLink>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" :class="{'show': showModal}" :style="{ display: showModal ? 'block' : 'none' }" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Fichier</h5>
            <button type="button" class="close" @click="toggleModal()" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <iframe v-if="fichier" :src="`http://localhost:2005/uploads/${fichier}`" width="100%" height="600px" frameborder="0"></iframe>
            <p v-else>Aucun fichier à afficher.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="toggleModal()">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.card {
  border-radius: 15px;
}

.file-link {
  font-weight: bold;
  text-decoration: underline;
}

.file-link:hover {
  color: darkblue;
}

.btn {
  flex: 1;
  max-width: 150px;
  height: 50px;
}

/* Styles pour la modal */
.modal {
  display: none;
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
  width: 100%;
  max-width: 800px; /* Set a max width for the modal */
  max-height: 100vh; /* Set a max height for the modal */
  overflow: hidden; /* Prevent scrolling within the modal */
  border-radius: 8px; /* Add rounded corners for a polished look */
}

.modal-iframe {
  width: 100%;
  height: 60vh; /* Adjust height as needed */
  border: none; /* Remove the default iframe border */
}
.modal.show {
  display: block;
  
}

.toggle {
  color: #aaa;
  font-size: 100px;
  font-weight: bold;
  cursor: pointer;
}

.toggle:hover,
.toggle:focus {
  color: black;
  text-decoration: none;
}
</style>
