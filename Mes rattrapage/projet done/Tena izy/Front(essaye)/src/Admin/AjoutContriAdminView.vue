<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const nif = ref("");
const raisonsociale = ref("");
const adresse = ref("");
const mdp = ref("");
const cin = ref("");
const numStat = ref("");
const activite = ref("");
const route = useRoute();
const router = useRouter();

const ajoutContribuable = async () => {
  await axios
    .post("http://localhost:2005/contribuables/ajout", {
      nif: nif.value,
      raisonsociale: raisonsociale.value,
      adresse: adresse.value,
      mdp: mdp.value,
      cin: cin.value,
      numStat: numStat.value,
      activite: activite.value,
    })
    .then((res) => {
      alert(res.data.message);
      router.push({ name: "ListeContribuable" });
    })
    .catch((err) => {
      console.error("Error adding contribuable:", err);
    });
};
</script>

<template>
  <main>
    <div class="container-fluid mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10 col-sm-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title text-center">Formulaire</h5>
              <form class="row g-3">
                <div class="col-12">
                  <label for="nif" class="form-label">NIF</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Votre NIF"
                    v-model="nif"
                  />
                </div>
                <div class="col-12">
                  <label for="nom" class="form-label">Raison sociale</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Votre nom"
                    v-model="raisonsociale"
                  />
                </div>
                <div class="col-12">
                  <label for="adresse" class="form-label">Adresse</label>
                  <input type="text" class="form-control" v-model="adresse" />
                </div>
                <div class="col-12">
                  <label for="mdp" class="form-label">MDP</label>
                  <input type="text" class="form-control" v-model="mdp" />
                </div>
                <div class="col-12">
                  <label for="cin" class="form-label">CIN</label>
                  <input type="text" class="form-control" v-model="cin" />
                </div>
                <div class="col-12">
                  <label for="numStat" class="form-label"
                    >Numéro Statistique</label
                  >
                  <input type="text" class="form-control" v-model="numStat" />
                </div>
                <div class="col-12">
                  <label for="activite" class="form-label">Activité</label>
                  <input type="text" class="form-control" v-model="activite" />
                </div>
              </form>
            </div>
          </div>
          <div class="d-flex justify-content-between mt-4 px-4">
            <button
              type="button"
              @click="ajoutContribuable"
              class="btn btn-primary"
            >
              Ajouter
            </button>
            <button type="reset" class="btn btn-secondary">
              <RouterLink to="/admin/home" class="nav-link">Retour</RouterLink>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
/* Styles pour que le défilement soit uniquement dans le card-body */
html,
body {
  overflow-x: hidden; /* Empêche le défilement horizontal */
}

.container-fluid {
  max-width: 100%; /* Utilise toute la largeur disponible */
}

.card-body {
  max-height: 500px; /* Définir une hauteur maximale pour le card-body */
  overflow-y: auto; /* Permet le défilement vertical */
}

.table {
  width: 100%; /* Assurez-vous que le tableau occupe toute la largeur */
}
.table-responsive {
  max-height: 400px; /* Définir une hauteur maximale pour le conteneur du tableau */
  overflow-y: auto; /* Permet le défilement vertical */
}
</style>
