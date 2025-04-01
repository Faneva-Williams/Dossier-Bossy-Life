<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import Logout from "@/components/LogoutView.vue";

const nifCherche = ref("");
const listes = ref([""]);

//fonction
const listeContribuable = async () => {
  const response = await axios.get(
    "http://localhost:2005/contribuables/listes"
  );
  //console.log(response)
  listes.value = response.data.liste;
  //console.log(listes.value)
};

const searchVirement = async () => {
  try {
    const response = await axios.post(
      "http://localhost:2005/contribuables/recherche",
      {
        nif: nifCherche.value, // Utilisez params ici
      }
    );
    console.log(response);
    listes.value = response.data.data; // Mettez à jour la liste des virements avec les résultats de recherche
  } catch (error) {
    console.error("Error searching virements:", error);
  }
};

const SuppContribuable = (nif) => {
  if (confirm("Vous voullez supprimé vraiment cette enregistrement?")) {
    axios
      .delete(`http://localhost:2005/contribuables/supprimer/${nif}`)
      .then((res) => {
        alert(res.data.message);
        router.push("/contribuable");
        listeContribuable();
      });
  }
};
onMounted(() => {
  listeContribuable();
});
</script>

<template>
  <Sidebar />
  <main>
    <div class="corp">
      <div class="layout">
        <section class="section">
          <div class="row">
            <div class="">
              <button class="btn btn-primary mb-3 new-contrib-btn">
                <RouterLink to="/admin/ajoutContri" class="nav-link">
                  +Nouveau contribuables
                </RouterLink>
              </button>
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
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Contribuables</h5>

                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">NIF</th>
                        <th scope="col">Raison Sociale</th>
                        <th scope="col">Adresse</th>
                        <th scope="col">CIN</th>
                        <th scope="col">NUMSTAT</th>
                        <th scope="col">ACTIVITE</th>
                        <th scope="col" class="action-column">ACTION</th>
                      </tr>
                    </thead>
                    <tbody v-for="liste in listes" :key="liste.nif">
                      <tr>
                        <td>{{ liste.nif }}</td>
                        <td>{{ liste.raisonsociale }}</td>
                        <td>{{ liste.adresse }}</td>
                        <td>{{ liste.cin }}</td>
                        <td>{{ liste.numStat }}</td>
                        <td>{{ liste.activite }}</td>
                        <td>
                          <button class="btn btn-success btn-sm me-2">
                            <RouterLink
                              :to="{
                                path: '/admin/contribuable/edit/' + liste.nif,
                              }"
                              class="nav-link"
                            >
                              <i class="fs-4 bi-pencil"></i>
                            </RouterLink>
                          </button>
                          <button
                            class="btn btn-danger btn-sm"
                            @click="SuppContribuable(liste.nif)"
                          >
                            <i class="fs-4 bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style>
.corp {
  margin-top: -600px;
  margin-left: -100px;
  height: calc(100vh - 50px);
  overflow-y: hidden;
  overflow-x: hidden;
}

.card {
  max-height: calc(100vh - 200px); /* Ajustez selon vos besoins */
  overflow-y: auto; /* Permet le défilement vertical */
}

.table {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.action-column {
  width: 150px; /* Ajustez la largeur pour la colonne ACTION */
}

.layout {
  display: flex;
  justify-content: flex-start; /* Alignement à gauche */
  height: 100vh;
  margin-left: 400px; /* Réduire un peu plus à gauche */
}

.new-contrib-btn {
  background-color: #007bff; /* Couleur bleue par défaut */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
}

.new-contrib-btn:hover {
  background-color: #0056b3; /* Teinte plus foncée au survol */
}

.btn-primary {
  background-color: #007bff; /* Identique au bouton */
}

.toggle-switch {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.btn i {
  font-size: 1.2rem; /* Ajustez la taille de l'icône */
  color: white; /* Assure que les icônes sont bien visibles */
}

.btn-success i {
  color: #fff;
}

.btn-danger i {
  color: #fff;
}
.btn-sm {
  height: 40px;
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
