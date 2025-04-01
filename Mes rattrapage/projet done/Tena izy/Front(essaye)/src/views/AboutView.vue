<script setup>
import { ref, computed } from 'vue';
import Navbar from '@/components/Navbar.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Logout from '@/components/LogoutView.vue';
import Swal from 'sweetalert2';

const router = useRouter();
const achats = ref('');
const vente = ref('');
const contribuableInfo = ref({
  nif: '',
  raisonsociale: '',
  activite: ''
});

const handleSuivantClick = async () => {
  await mettreAJourTVA(); // Mettez à jour la TVA
  if (!errorMessage.value) { // Vérifiez s'il n'y a pas d'erreurs
    isModalVisible.value = true; // Affichez le modal si tout est OK
  }
};

const errorMessage = ref('');
const alertVisible = ref(false);
const alertMessage = ref('');

const taux20Achats = computed(() => (achats.value * 0.20).toFixed(2));
const taux20Ventes = computed(() => (vente.value * 0.20).toFixed(2));

const tvaCollecte = ref('0.00');
const tvaDeductible = ref('0.00');

const tvaAPayer = computed(() => {
  const tauxAchats = parseFloat(taux20Achats.value) || 0;
  const tauxVentes = parseFloat(taux20Ventes.value) || 0;
  console.log(`Taux Achats: ${tauxAchats}, Taux Ventes: ${tauxVentes}`); // Pour déboguer
  return (tauxAchats - tauxVentes).toFixed(2);
});

const isModalVisible = ref(false);

const resetErrorMessage = () => {
  errorMessage.value = '';
};

const mettreAJourTVA = async () => {
  if (achats.value === '' || vente.value === '') {
      Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Veuillez compléter les champs.",
});

    return;
  }

  if (parseFloat(vente.value) > parseFloat(achats.value)) {
     Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Le montant des ventes ne peut pas être supérieur au chiffre d'affaire (achats).",
});
    return;
  }

  if (parseFloat(achats.value) < 400000000) {
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Vous avez saisissez le montant dans le chiffre d'affaire inferieur à 400 000 000 Ariary",
});
    return;
  }

  errorMessage.value = '';

  // Calculer la TVA collectée basée sur les ventes
  tvaCollecte.value = taux20Ventes.value;
  // Calculer la TVA déductible basée sur les achats
  tvaDeductible.value = taux20Achats.value;

  const contribuableData = JSON.parse(localStorage.getItem('contribuableInfo'));
  if (contribuableData) {
    contribuableInfo.value = contribuableData;
  }
};


const ajoutDeclaration = async () => {
  const declaration = {
    'nif': parseInt(contribuableInfo.value.nif),
    'raisonsociale': contribuableInfo.value.raisonsociale,
    'periode': new Date().toISOString(),
    'vente': vente.value,
    'achats': achats.value,
    'tvaAPayer': tvaAPayer.value

  };

  try {
    const res = await axios.post('http://localhost:2005/declarations/ajout', declaration);
   Swal.fire({
  position: "top-center",
  icon: "success",
  title: "Declaration enregistré",
  showConfirmButton: false,
  timer: 1500
});

    alertVisible.value = true;
    return res.data;
  } catch (err) {
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Erreur sur l\'ajout de déclaration. Essayez encore.",
});
    alertVisible.value = true;
    return null;
  }
};

const enregistrerEtPayer = async () => {
  const declarationResponse = await ajoutDeclaration();
  if (declarationResponse && declarationResponse.num_decl) {
    try {
      await effectuerPaiement(tvaAPayer.value);
      await router.push({ 
        path: '/virement', 
        query: { num_decl: declarationResponse.num_decl }
      });
    } catch (error) {
       Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Erreur lors du processus d\'enregistrement et de paiement",
});
      alertVisible.value = true;
    }
  } else {
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Aucune déclaration valide à traiter.",
});
    alertVisible.value = true;
  }
};

const resetAlert = () => {
  alertVisible.value = false;
  location.reload();
};

</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>Direction Générale des Impôts</h1>
    </header>
    <Navbar />
    <div class="content-container">
      <main class="main-content">
        <h3>FORMULAIRE DE SAISIE DE DÉCLARATION</h3>
        <div class="table-wrapper">
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td>
                  <div class="form-container">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th scope="col">Libellé</th>
                          <th scope="col">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Chiffre d'affaire</td>
                          <td>
                            <input v-model.number="achats" type="number" class="form-control" placeholder="Montant" />
                          </td>
                        </tr>
                        <tr>
                          <td>Taux 20% Achats</td>
                          <td>{{ taux20Achats }}</td>
                        </tr>
                        <tr>
                          <td>Vente</td>
                          <td>
                            <input v-model.number="vente" type="number" class="form-control" placeholder="Montant" />
                          </td>
                        </tr>
                        <tr>
                          <td>Taux 20% Ventes</td>
                          <td>{{ taux20Ventes }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div v-if="errorMessage" class="alert alert-danger">
                      {{ errorMessage }}
                      <button type="button" class="btn btn-secondary" @click="resetErrorMessage">OK</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <RouterLink to="/declaration" class="nav-link professional-link">
              Listes de déclarations
            </RouterLink>
            <div class="text-center flex-grow-1">
              <button type="button" class="btn btn-primary" @click="handleSuivantClick">Suivant</button>
            </div>
            <div class="action-panel">
            <Logout/>
        </div>
          </div>
        </div>

        <div v-if="isModalVisible" class="modal-overlay">
          <div class="modal-content">
            <h3>RÉCAPITULATIF DE LA DÉCLARATION À PAYER</h3>
            <table class="table table-sm table-bordered">
              <tbody>
                <tr>
                  <td class="label-col">Raison Sociale</td>
                  <td class="value-col">{{ contribuableInfo.raisonsociale }}</td>
                </tr>
                <tr>
                  <td class="label-col">Date</td>
                  <td class="value-col">{{ new Date().toLocaleDateString() }}</td>
                </tr>
                <tr>
                  <td class="label-col">TVA collectée</td>
                  <td class="value-col">{{ tvaCollecte }} Ariary</td>
                </tr>
                <tr>
                  <td class="label-col">TVA déductible</td>
                  <td class="value-col">{{ tvaDeductible }} Ariary</td>
                </tr>
                <tr>
                  <td class="label-col">TVA à payer</td>
                  <td class="value-col">{{ tvaAPayer }} Ariary</td>
                </tr>
              </tbody>
            </table>
            <div class="text-center mt-2 button-group">
              <button type="button" class="btn btn-primary" @click="ajoutDeclaration">Enregistrer</button>
              <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Fermer</button>
            </div>
          </div>
        </div>
        
      </main>

      <div v-if="alertVisible" class="alert-container">
        <div class="alert alert-success" role="alert">
          {{ alertMessage }}
          <button type="button" class="btn btn-secondary" @click="resetAlert">
          OK
          </button>
        </div>
      </div>
    </div>
  </div>
  
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

.content-container {
  display: flex;
  flex: 1;
  padding: 1rem;
  overflow: auto;
}

.main-content {
  flex: 1;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-wrapper {
  margin: 1rem 0;
  overflow-y: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.btn-primary {
  background-color: #007bff; /* Bleu professionnel */
  color: white;
  padding: 0.5rem 1rem; /* Augmenter le rembourrage */
  font-size: 0.90rem; /* Augmenter la taille de la police */
}

.btn-primary:hover {
  background-color: #0056b3; /* Bleu plus foncé au survol */
}

.btn-secondary {
  background-color: #6c757d; /* Couleur grise pour le bouton secondaire */
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268; /* Couleur plus foncée au survol */
}

.alert-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.alert {
  margin: 0;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.flex-grow-1 {
  flex-grow: 1;
}

.professional-link {
  color: #28a745; /* Vert */
  font-weight: bold;
  text-decoration: none; /* Enlever le soulignement */
  padding: 0.75rem 1.5rem; /* Ajouter un rembourrage pour le bouton */
  border-radius: 4px; /* Coins arrondis */
  transition: background-color 0.3s, color 0.3s; /* Transition douce */
}

.professional-link:hover {
  background-color: #e2f3e2; /* Fond légèrement plus clair au survol */
  color: #155724; /* Changer la couleur au survol */
}

.button-group button {
  margin: 0 10px; /* Espace horizontal entre les boutons */
}

.action-panel {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
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
