<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

// Define reactive references for the fields
const raisonsociale = ref('');
const adresse = ref('');
const mdp = ref('');
const cin = ref('');
const numStat = ref('');
const activite = ref('');


const route = useRoute();
const router = useRouter();
const nifContribuable = ref(route.params.nif);

// Function to fetch contributor details
const editContribuable = (nif) => {
   axios.get(`http://localhost:2005/contribuables/editer/${nifContribuable.value}`)
       .then(res => {
           // console.log(res.data); // Vérifiez ici ce qui est renvoyé
            raisonsociale.value = res.data.data.raisonsociale;
            adresse.value = res.data.data.adresse;
            mdp.value = res.data.data.mdp;
            cin.value = res.data.data.cin;
            numStat.value = res.data.data.numStat;
            activite.value = res.data.data.activite;
        });
};


// Function to modify contributor details
const modifierContribuable = (nif) => {
   if (raisonsociale.value == '' || adresse.value == '' || mdp.value == '' || cin.value == '' || numStat.value == '' ||  activite.value == '' ) {
       Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Vous devriez complétez tus les champs",
});

   }
   axios.patch(`http://localhost:2005/contribuables/modifier/${nifContribuable.value}`,
       {
        'raisonsociale': raisonsociale.value,
        'adresse': adresse.value,
        'mdp': mdp.value,
        'cin': cin.value,
        'numStat': numStat.value,
        'activite': activite.value,
    }).then(res => {
        Swal.fire({
  icon: "success",
  text: "Modification réussi",

});

        router.push('/admin/contribuable');
    });
};

// Fetch contributor details on component mount
onMounted(() => {
    editContribuable();
});
</script>
<template>
  <main>
    <div class="container-fluid d-flex align-items-center justify-content-center" style="height: 100vh;">
      <div class="row justify-content-center w-100">
        <div class="col-lg-8 col-md-10 col-sm-12">
          <div class="card">
            <div class="card-body" style="max-height: 500px; overflow-y: auto;">
              <h5 class="card-title text-center">Formulaire</h5>
              <form class="row g-3">
                <div class="col-12">
                  <label for="nif" class="form-label">NIF</label>
                  <input type="text" class="form-control" placeholder="Votre NIF" v-model="nif">
                </div>
                <div class="col-12">
                  <label for="nom" class="form-label">Raison sociale</label>
                  <input type="text" class="form-control" placeholder="Votre nom" v-model="raisonsociale">
                </div>
                <div class="col-12">
                  <label for="adresse" class="form-label">Adresse</label>
                  <input type="text" class="form-control" v-model="adresse">
                </div>
                <div class="col-12">
                  <label for="mdp" class="form-label">MDP</label>
                  <input type="text" class="form-control" v-model="mdp">
                </div>
                <div class="col-12">
                  <label for="cin" class="form-label">CIN</label>
                  <input type="text" class="form-control" v-model="cin">
                </div>
                <div class="col-12">
                  <label for="numStat" class="form-label">Numéro Statistique</label>
                  <input type="text" class="form-control" v-model="numStat">
                </div>
                <div class="col-12">
                  <label for="activite" class="form-label">Activité</label>
                  <input type="text" class="form-control" v-model="activite">
                </div>
              </form>
            </div>
          </div>
          <div class="d-flex justify-content-between mt-4 px-4">
            <button type="button" @click="modifierContribuable()" class="btn btn-primary">Modifier</button>
            <RouterLink to="/admin/contribuable" class="btn btn-secondary">
              Retour
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
 html, body {
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
