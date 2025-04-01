<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import { useRouter, useRoute } from 'vue-router';
import Logout from '@/components/LogoutView.vue';
import Swal from 'sweetalert2'

// State variables to hold taxpayer information
const nif = ref('');
const raisonsociale = ref('');
const adresse = ref('');
const cin = ref('');
const numStat = ref('');
const activite = ref('');
const tvaAPayer = ref('');
const impotAccount = ref('00999 00140 213 10 100 304 59');


// Use Vue Router for navigation
const router = useRouter();
const route = useRoute(); // Récupère les paramètres de la route

// New field for declaration number and date
const numDecl = ref('');

const datePaiement = ref(new Date().toISOString().split('T')[0]); // Date d'aujourd'hui au format YYYY-MM-DD



onMounted(() => {
    // Récupérer le numéro de déclaration depuis les paramètres de la requête
    numDecl.value = route.query.num_decl || '';
    tvaAPayer.value = route.query.tvaAPayer || '';
    
    fetchContribuable(); 
});


const fetchContribuable = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found');
        return;
    }

    try {
        const response = await axios.get('http://localhost:2005/contribuables/infos', {
            headers: {
                'Authorization': `Bearer ${token}` // Ajout des backticks pour les template strings
            }
        });

        const { data } = response;
        nif.value = data.nif;
        raisonsociale.value = data.raisonsociale;
        adresse.value = data.adresse;
        cin.value = data.cin;
        numStat.value = data.numStat;
        activite.value = data.activite;

        localStorage.setItem('contribuableInfo', JSON.stringify(data));

    } catch (error) {
        console.error('Error fetching taxpayer info:', error);
    }
};

// Payer form fields
const selectedPayer = ref('');
const nifPayeur = ref('');
const nomPayeur = ref('');
const compteBancaire = ref(''); // Nouveau champ pour le numéro de compte bancaire

// Function to handle payer selection
const handlePayerChange = (value) => {
    selectedPayer.value = value;

    if (value === 'moi') {
        // Autofill the fields with taxpayer info
        nifPayeur.value = nif.value;
        nomPayeur.value = raisonsociale.value;
    } else {
        // Clear the fields if another payer is selected
        nifPayeur.value = '';
        nomPayeur.value = '';
    }
};


// Dans VirementView.vue
const handlePayment = async () => {
    try {
        const paymentData = {
            nif: nif.value,
            raisonsociale: raisonsociale.value, 
            nifPayeur: nifPayeur.value,
            nomPayeur: nomPayeur.value,
            datePaiement: datePaiement.value,
            numDecl: numDecl.value,
            tvaAPayer: tvaAPayer.value,
            comptebancaire: compteBancaire.value,
            compteimpot: impotAccount.value
        };

        // Send payment data to the API
        await axios.post('http://localhost:2005/virements/ajout', paymentData);

        // If successful, show an alert and redirect with data
        Swal.fire("Le virement a été ajouté avec succès !");
    
        router.push({
      name: 'recapitulatif',
      query: {
        nif: nifPayeur.value,
        nomPayeur: nomPayeur.value,
        raisonsociale: route.query.raisonsociale,
        vente: route.query.vente,
        achats: route.query.achats,
        periode: route.query.periode,
        numDecl: numDecl.value,
        datePaiement: datePaiement.value,
        tvaAPayer : route.query.tvaAPayer,
        activite: route.query.activite || activite.value 

            }
        });
    } catch (error) {
        console.error('Payment failed:', error);
        alert('Échec de l\'ajout du virement. Veuillez réessayer.');
    }
};

</script>

<template>
<main class="app-container">
    <header class="header">
        <h1>Direction Générale des Impôts</h1>
    </header>
    
    <Navbar />

    <div class="za">
        <fieldset>
            <div class="fieldset-header">
                <legend>Choisir le payeur:</legend>
                <div class="radio-group">
                    <div>
                        <input type="radio" id="payerMoi" name="payer" value="moi" @change="handlePayerChange('moi')" />
                        <label for="payerMoi">Je souhaite payer moi-même</label>
                    </div>
                    <div>
                        <input type="radio" id="payerAutre" name="payer" value="autre" @change="handlePayerChange('autre')" />
                        <label for="payerAutre">Autre personne payeur</label>
                    </div>
                </div>
            </div>
        </fieldset>

        <!-- Autofill payeur fields based on taxpayer selection -->
        <div class="form-table">
            <div class="form-row">
                <div class="form-group">
                    <label for="nifPayeur">NIF du payeur</label>
                    <input type="text" id="nifPayeur" class="form-control" v-model="nifPayeur" />
                </div>
                <div class="form-group">
                    <label for="nomPayeur">Nom du payeur</label>
                    <input type="text" id="nomPayeur" class="form-control" v-model="nomPayeur" />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="num_decl">Num_decl</label>
                    <input type="text" id="num_decl" class="form-control" v-model="numDecl" readonly />
                </div>
                <div class="form-group">
                    <label for="datePaiement">Date</label>
                    <input type="date" id="datePaiement" class="form-control" v-model="datePaiement" readonly />
                </div>
                
            </div>
             <div class="form-group">
                    <label for="tvaAPayer">TVA PAYE</label>
                    <input type="text" id="tvaAPayer" class="form-control" v-model="tvaAPayer" readonly />
                </div>
            <div class="form-row">
            
                <div class="form-group">
                    <label for="compte">Veuillez entrer votre numéro de compte bancaire</label>
                    <input type="number" id="compte" class="form-control" v-model="compteBancaire" />
                </div>
                <div class="form-group">
                    <label for="imp">Numéro de compte impot</label>
                    <input type="text" id="imp" class="form-control" v-model="impotAccount" readonly />
                    
                </div>
                
            </div>
        </div>

        <!-- Button to handle payment and redirect to /recapitulatif -->
        <div class="text-center mt-2 button-container">
            <button type="button" class="btn btn-primary btn-sm" @click="handlePayment">Payer</button>
            <RouterLink to="/about" class="btn btn-primary btn-sm">Annuler</RouterLink>
        </div>
    </div>
</main>
</template>

<style>
.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden; /* Empêche les barres de défilement */
    font-family: 'Arial', sans-serif;
    color: #333;
    background-color: #f5f5f5;
}

.header {
    background-color: #1a5276;
    color: #ffffff;
    padding: 0.5rem; /* Réduit la hauteur de l'en-tête */
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
    margin: 0;
    font-size: 1.2rem; /* Ajuste la taille de la police */
    font-weight: 600;
}

.za {
    flex: 1;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 6px;
    overflow-y: auto; /* Autorise le défilement interne sans barre globale */
}

.radio-group {
    display: flex;
    gap: 10px;
}

.form-table {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px; /* Réduit les espaces entre les colonnes */
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-control {
    padding: 6px; /* Réduit la hauteur des champs */
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.3s;
}

.form-control:focus {
    border-color: #007bff;
    outline: none;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 15px; /* Réduit l'espace entre les boutons */
}

.btn-primary {
    background-color: #007bff;
    color: white;
    padding: 5px 10px; /* Réduit la taille des boutons */
}

.btn-primary:hover {
    background-color: #0056b3;
}

.text-center {
    text-align: center;
}
</style>
